import { useEffect, useState, useRef, useMemo } from 'react';
import { Github, GitCommit, Star, GitPullRequest, ExternalLink } from 'lucide-react';

const GITHUB_USERNAME = 'mumtazka';

interface ContributionDay {
    contributionCount: number;
    date: string;
    color: string;
    contributionLevel: string;
}

interface ContributionWeek {
    contributionDays: ContributionDay[];
}

interface ContributionCalendar {
    totalContributions: number;
    weeks: ContributionWeek[];
}

interface ContributionData {
    contributionCalendar: ContributionCalendar;
    totalCommitContributions: number;
    totalPullRequestContributions: number;
    totalRepositoriesWithContributedCommits: number;
    restrictedContributionsCount: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

// Map GitHub contribution levels to our theme colors
function getContributionColor(level: string, count: number): string {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    switch (level) {
        case 'FIRST_QUARTILE':
            return 'bg-orange-200';
        case 'SECOND_QUARTILE':
            return 'bg-orange-300';
        case 'THIRD_QUARTILE':
            return 'bg-orange-400';
        case 'FOURTH_QUARTILE':
            return 'bg-orange-500';
        default:
            return 'bg-gray-100';
    }
}

function getContributionBorder(level: string, count: number): string {
    if (count === 0) return 'border-gray-200';
    switch (level) {
        case 'FIRST_QUARTILE':
            return 'border-orange-300';
        case 'SECOND_QUARTILE':
            return 'border-orange-400';
        case 'THIRD_QUARTILE':
            return 'border-orange-500';
        case 'FOURTH_QUARTILE':
            return 'border-orange-600';
        default:
            return 'border-gray-200';
    }
}

export default function GitHubContributions() {
    const [contributionData, setContributionData] = useState<ContributionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const graphRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    // Intersection observer for section visibility
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Fetch contribution data from GitHub GraphQL API
    useEffect(() => {
        async function fetchContributions() {
            const token = import.meta.env.VITE_GITHUB_TOKEN;

            if (!token) {
                setError('GitHub token not configured');
                setLoading(false);
                return;
            }

            const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                    color
                    contributionLevel
                  }
                }
              }
              totalCommitContributions
              totalPullRequestContributions
              totalRepositoriesWithContributedCommits
              restrictedContributionsCount
            }
          }
        }
      `;

            try {
                const response = await fetch('https://api.github.com/graphql', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                        variables: { username: GITHUB_USERNAME },
                    }),
                });

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                const data = await response.json();

                if (data.errors) {
                    throw new Error(data.errors[0].message);
                }

                setContributionData(data.data.user.contributionsCollection);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch contributions');
            } finally {
                setLoading(false);
            }
        }

        fetchContributions();
    }, []);

    // Calculate stats from contribution data
    const stats = useMemo(() => {
        if (!contributionData) return null;

        const allDays = contributionData.contributionCalendar.weeks.flatMap(w => w.contributionDays);
        const activeDays = allDays.filter(d => d.contributionCount > 0).length;
        const maxContributions = Math.max(...allDays.map(d => d.contributionCount));

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const sortedDays = [...allDays].sort((a, b) => b.date.localeCompare(a.date));

        // Allow one gap for today if it has no contributions yet
        let startChecking = false;
        for (const day of sortedDays) {
            if (day.date === today && day.contributionCount === 0) {
                continue; // Skip today if no contributions yet
            }
            if (day.contributionCount > 0) {
                startChecking = true;
                currentStreak++;
            } else if (startChecking) {
                break;
            }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 0;
        const chronologicalDays = [...allDays].sort((a, b) => a.date.localeCompare(b.date));
        for (const day of chronologicalDays) {
            if (day.contributionCount > 0) {
                tempStreak++;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }

        // Calculate average per day (non-zero days)
        const avgPerDay = activeDays > 0
            ? (contributionData.contributionCalendar.totalContributions / activeDays).toFixed(1)
            : '0';

        return {
            totalContributions: contributionData.contributionCalendar.totalContributions,
            totalCommits: contributionData.totalCommitContributions,
            totalPRs: contributionData.totalPullRequestContributions,
            totalRepos: contributionData.totalRepositoriesWithContributedCommits,
            activeDays,
            maxContributions,
            currentStreak,
            longestStreak,
            avgPerDay,
        };
    }, [contributionData]);

    // Get month label positions for the graph
    const monthPositions = useMemo(() => {
        if (!contributionData) return [];

        const positions: { label: string; index: number }[] = [];
        let lastMonth = -1;

        contributionData.contributionCalendar.weeks.forEach((week, weekIndex) => {
            const firstDay = week.contributionDays[0];
            if (firstDay) {
                const month = new Date(firstDay.date).getMonth();
                if (month !== lastMonth) {
                    positions.push({ label: MONTH_LABELS[month], index: weekIndex });
                    lastMonth = month;
                }
            }
        });

        return positions;
    }, [contributionData]);

    const handleDayHover = (day: ContributionDay, event: React.MouseEvent) => {
        const rect = graphRef.current?.getBoundingClientRect();
        const tooltip = tooltipRef.current;
        if (rect && tooltip) {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            tooltip.style.display = 'block';
            tooltip.style.left = `${Math.min(x, (graphRef.current?.clientWidth || 0) - 180)}px`;
            tooltip.style.top = `${y - 45}px`;

            const countText = `${day.contributionCount} contribution${day.contributionCount !== 1 ? 's' : ''}`;
            const dateStr = new Date(day.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });

            tooltip.innerHTML = `
                <p class="font-semibold">${countText}</p>
                <p class="text-gray-400">${dateStr}</p>
                <div class="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            `;
        }
    };

    return (
        <section
            ref={sectionRef}
            id="contributions"
            className="relative py-20 bg-charcoal"
        >
            {/* Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 lg:pl-28">
                {/* Section Header */}
                <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        GitHub <span className="text-gradient">Contributions</span>
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-orange-500" />
                        <p className="text-gray-600 max-w-xl">
                            My real-time contribution activity on GitHub. Building and shipping code every day.
                        </p>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-orange-500" />
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="glass rounded-2xl p-8">
                            {/* Stats skeleton */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="glass rounded-xl p-4 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                                        <div className="h-8 bg-gray-200 rounded w-3/4" />
                                    </div>
                                ))}
                            </div>
                            {/* Graph skeleton */}
                            <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="glass rounded-2xl p-8 text-center">
                            <Github className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">Unable to load contributions</p>
                            <p className="text-gray-400 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                {!loading && !error && contributionData && stats && (
                    <div className={`space-y-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>



                        {/* Contribution Graph */}
                        <div className="glass rounded-2xl p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                                    Contribution Activity
                                </h3>
                                <a
                                    href={`https://github.com/${GITHUB_USERNAME}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                    @{GITHUB_USERNAME}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            {/* Graph + Mona */}
                            <div className="flex gap-4 items-center">

                                {/* Graph */}
                                <div ref={graphRef} className="relative overflow-x-auto pb-2 flex-1 min-w-0">
                                    {/* Month Labels */}
                                    <div className="flex mb-2 ml-8" style={{ gap: '0px' }}>
                                        {monthPositions.map((pos, i) => (
                                            <div
                                                key={i}
                                                className="text-xs text-gray-400 shrink-0"
                                                style={{
                                                    width: i < monthPositions.length - 1
                                                        ? `${(monthPositions[i + 1].index - pos.index) * 14}px`
                                                        : 'auto',
                                                }}
                                            >
                                                {pos.label}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Grid */}
                                    <div className="flex gap-0.5">
                                        {/* Day Labels */}
                                        <div className="flex flex-col gap-0.5 mr-1 shrink-0">
                                            {DAY_LABELS.map((label, i) => (
                                                <div key={i} className="h-[12px] flex items-center">
                                                    <span className="text-[10px] text-gray-400 w-6 text-right">{label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Contribution Cells */}
                                        {contributionData.contributionCalendar.weeks.map((week, weekIndex) => (
                                            <div key={weekIndex} className="flex flex-col gap-0.5">
                                                {week.contributionDays.map((day, dayIndex) => (
                                                    <div
                                                        key={dayIndex}
                                                        className={`w-[12px] h-[12px] rounded-[3px] border transition-all duration-200 cursor-pointer hover:scale-150 hover:z-10 ${getContributionColor(day.contributionLevel, day.contributionCount)} ${getContributionBorder(day.contributionLevel, day.contributionCount)}`}
                                                        onMouseEnter={(e) => handleDayHover(day, e)}
                                                        onMouseLeave={() => { if (tooltipRef.current) tooltipRef.current.style.display = 'none'; }}
                                                        style={{
                                                            animationDelay: `${weekIndex * 10}ms`,
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Tooltip */}
                                    <div
                                        ref={tooltipRef}
                                        className="absolute z-20 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
                                        style={{ display: 'none' }}
                                    />
                                </div>{/* end graph */}

                                {/* Mona — GIF mascot */}
                                <div className="hidden md:flex flex-col items-center justify-center shrink-0 select-none group/mona" style={{ width: 120 }}>
                                    <img
                                        src="/mona-loading-dark.gif"
                                        alt="Mona Octocat"
                                        className="w-20 h-20 object-contain transition-transform duration-500 group-hover/mona:scale-110"
                                    />
                                    <span className="text-[10px] text-gray-400 mt-2 tracking-wide font-medium">Mona</span>
                                </div>

                            </div>{/* end flex row */}

                            {/* Legend */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <GitCommit className="w-3.5 h-3.5" />
                                        <span>{stats.totalCommits} commits</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <GitPullRequest className="w-3.5 h-3.5" />
                                        <span>{stats.totalPRs} PRs</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-3.5 h-3.5" />
                                        <span>{stats.totalRepos} repos</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span>Less</span>
                                    <div className="w-[12px] h-[12px] rounded-[3px] bg-gray-100 border border-gray-200" />
                                    <div className="w-[12px] h-[12px] rounded-[3px] bg-orange-200 border border-orange-300" />
                                    <div className="w-[12px] h-[12px] rounded-[3px] bg-orange-300 border border-orange-400" />
                                    <div className="w-[12px] h-[12px] rounded-[3px] bg-orange-400 border border-orange-500" />
                                    <div className="w-[12px] h-[12px] rounded-[3px] bg-orange-500 border border-orange-600" />
                                    <span>More</span>
                                </div>
                            </div>
                        </div>



                        {/* View Profile Link */}
                        <div className="text-center pt-4">
                            <a
                                href={`https://github.com/${GITHUB_USERNAME}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 glass rounded-xl text-gray-900 hover:bg-orange-500/20 transition-all duration-300 group"
                            >
                                <Github className="w-5 h-5" />
                                View Full Profile on GitHub
                                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
