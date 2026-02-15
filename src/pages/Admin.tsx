import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  ArrowLeft,
  ExternalLink,
  Eye
} from 'lucide-react';
import { useAuth, useProjects, useEducation, useAchievements, useMessages } from '../hooks/useSupabase';
import type { Project, Education, Achievement } from '../types/database';

type Tab = 'projects' | 'education' | 'achievements' | 'messages';

interface ProjectFormData {
  title: string;
  description: string;
  image_url: string;
  tech_stack: string;
  project_url: string;
  github_url: string;
  featured: boolean;
}

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string;
  certificate_image: string;
  description: string;
}

interface AchievementFormData {
  title: string;
  issuer: string;
  date: string;
  description: string;
  credential_url: string;
  image_url: string;
}

const INITIAL_PROJECT_FORM: ProjectFormData = {
  title: '',
  description: '',
  image_url: '',
  tech_stack: '',
  project_url: '',
  github_url: '',
  featured: false,
};

const INITIAL_EDUCATION_FORM: EducationFormData = {
  institution: '',
  degree: '',
  field: '',
  start_date: '',
  end_date: '',
  certificate_image: '',
  description: '',
};

const INITIAL_ACHIEVEMENT_FORM: AchievementFormData = {
  title: '',
  issuer: '',
  date: '',
  description: '',
  credential_url: '',
  image_url: '',
};

export default function Admin() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();
  const { education, loading: educationLoading, addEducation, updateEducation, deleteEducation } = useEducation();
  const { achievements, loading: achievementsLoading, addAchievement, updateAchievement, deleteAchievement } = useAchievements();
  const { messages, fetchMessages, deleteMessage } = useMessages();

  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormData>(INITIAL_PROJECT_FORM);
  const [educationForm, setEducationForm] = useState<EducationFormData>(INITIAL_EDUCATION_FORM);
  const [achievementForm, setAchievementForm] = useState<AchievementFormData>(INITIAL_ACHIEVEMENT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user, fetchMessages]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(email, password);
    if (error) {
      alert('Login failed: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Project modal
  const openProjectModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        image_url: project.image_url,
        tech_stack: project.tech_stack.join(', '),
        project_url: project.project_url || '',
        github_url: project.github_url || '',
        featured: project.featured,
      });
    } else {
      setEditingProject(null);
      setProjectForm(INITIAL_PROJECT_FORM);
    }
    setShowModal(true);
  };

  // Education modal
  const openEducationModal = (edu?: Education) => {
    if (edu) {
      setEditingEducation(edu);
      setEducationForm({
        institution: edu.institution,
        degree: edu.degree,
        field: edu.field,
        start_date: edu.start_date,
        end_date: edu.end_date,
        certificate_image: edu.certificate_image || '',
        description: edu.description || '',
      });
    } else {
      setEditingEducation(null);
      setEducationForm(INITIAL_EDUCATION_FORM);
    }
    setShowModal(true);
  };

  // Achievement modal
  const openAchievementModal = (achievement?: Achievement) => {
    if (achievement) {
      setEditingAchievement(achievement);
      setAchievementForm({
        title: achievement.title,
        issuer: achievement.issuer,
        date: achievement.date,
        description: achievement.description || '',
        credential_url: achievement.credential_url || '',
        image_url: achievement.image_url || '',
      });
    } else {
      setEditingAchievement(null);
      setAchievementForm(INITIAL_ACHIEVEMENT_FORM);
    }
    setShowModal(true);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const projectData = {
      ...projectForm,
      tech_stack: projectForm.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editingProject) {
      await updateProject(editingProject.id, projectData);
    } else {
      await addProject(projectData as Omit<Project, 'id' | 'created_at'>);
    }
    setIsSubmitting(false);
    setShowModal(false);
    setProjectForm(INITIAL_PROJECT_FORM);
    setEditingProject(null);
  };

  const handleEducationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editingEducation) {
      await updateEducation(editingEducation.id, educationForm);
    } else {
      await addEducation(educationForm as Omit<Education, 'id' | 'created_at'>);
    }
    setIsSubmitting(false);
    setShowModal(false);
    setEducationForm(INITIAL_EDUCATION_FORM);
    setEditingEducation(null);
  };

  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (editingAchievement) {
      await updateAchievement(editingAchievement.id, achievementForm);
    } else {
      await addAchievement(achievementForm as Omit<Achievement, 'id' | 'created_at'>);
    }
    setIsSubmitting(false);
    setShowModal(false);
    setAchievementForm(INITIAL_ACHIEVEMENT_FORM);
    setEditingAchievement(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      await deleteEducation(id);
    }
  };

  const handleDeleteAchievement = async (id: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      await deleteAchievement(id);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteMessage(id);
      if (selectedMessage === id) setSelectedMessage(null);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'projects', label: 'Projects', icon: <Briefcase className="w-5 h-5" />, count: projects.length },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-5 h-5" />, count: education.length },
    { id: 'achievements', label: 'Achievements', icon: <Award className="w-5 h-5" />, count: achievements.length },
    { id: 'messages', label: 'Messages', icon: <Mail className="w-5 h-5" />, count: messages.length },
  ];

  // Login Screen
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Sign in to manage your portfolio</p>
            <p className="text-gray-400 text-sm mt-2">Demo: admin@example.com / admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.01] transition-all">
              Sign In
            </button>
          </form>

          <a
            href="/"
            className="flex items-center justify-center gap-2 w-full mt-4 text-center text-gray-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </a>
        </div>
      </div>
    );
  }

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-gray-900 font-bold block">Admin Panel</span>
              <span className="text-gray-400 text-xs">Portfolio Manager</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                  ? 'bg-orange-50 text-orange-600 font-medium shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                {tab.label}
              </div>
              {tab.count !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-gray-100 text-gray-500'
                  }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <a href="/" className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all mb-1">
            <ArrowLeft className="w-5 h-5" />
            Back to Site
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 p-4 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-bold">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="p-2 text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${activeTab === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your portfolio projects</p>
              </div>
              <button
                onClick={() => openProjectModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No projects yet. Add your first project!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-semibold">{project.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {project.featured && (
                          <span className="px-2 py-0.5 bg-orange-50 text-orange-500 text-xs rounded-full font-medium">
                            ⭐ Featured
                          </span>
                        )}
                        <span className="text-gray-400 text-xs">
                          {project.tech_stack.length} technologies
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {project.project_url && (
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => openProjectModal(project)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Education Tab */}
        {activeTab === 'education' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your education history</p>
              </div>
              <button
                onClick={() => openEducationModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            {educationLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : education.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No education entries yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <img
                      src={edu.certificate_image || 'https://via.placeholder.com/64'}
                      alt={edu.institution}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-semibold">{edu.institution}</h3>
                      <p className="text-orange-500 text-sm font-medium">{edu.degree}</p>
                      <p className="text-gray-400 text-sm">{edu.field}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEducationModal(edu)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your certifications & awards</p>
              </div>
              <button
                onClick={() => openAchievementModal()}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            </div>

            {achievementsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : achievements.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Award className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No achievements yet. Add your first certification!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                    {achievement.image_url ? (
                      <img
                        src={achievement.image_url}
                        alt={achievement.title}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-100"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
                        <Award className="w-8 h-8 text-orange-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-gray-900 font-semibold">{achievement.title}</h3>
                      <p className="text-orange-500 text-sm font-medium">{achievement.issuer}</p>
                      <p className="text-gray-400 text-sm">{new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {achievement.credential_url && (
                        <a href={achievement.credential_url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => openAchievementModal(achievement)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAchievement(achievement.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
                <p className="text-gray-500 text-sm mt-1">Messages from your contact form</p>
              </div>
              <button
                onClick={fetchMessages}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                <Loader2 className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">No messages yet</p>
                <p className="text-gray-400 text-sm mt-1">Messages sent from your contact form will appear here</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`bg-white rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer ${selectedMessage === message.id ? 'border-orange-300 shadow-md' : 'border-gray-200'
                      }`}
                    onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                          <span className="text-orange-600 font-semibold text-sm">{message.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold">{message.name}</h3>
                          <p className="text-orange-500 text-sm">{message.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">
                          {new Date(message.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteMessage(message.id); }}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-gray-600 ${selectedMessage === message.id ? '' : 'line-clamp-2'}`}>
                      {message.message}
                    </p>
                    {selectedMessage !== message.id && message.message.length > 120 && (
                      <button className="text-orange-500 text-sm mt-1 flex items-center gap-1 hover:underline">
                        <Eye className="w-3 h-3" />
                        Read more
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {(editingProject || editingEducation || editingAchievement) ? 'Edit' : 'Add'}{' '}
              {activeTab === 'projects' ? 'Project' : activeTab === 'education' ? 'Education' : 'Achievement'}
            </h3>

            {/* Project Form */}
            {activeTab === 'projects' && (
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.tech_stack}
                    onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
                    <input
                      type="url"
                      value={projectForm.project_url}
                      onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={projectForm.github_url}
                      onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="featured" className="text-gray-700">Featured Project</label>
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <><Save className="w-4 h-4 inline mr-2" />Save Project</>
                  )}
                </button>
              </form>
            )}

            {/* Education Form */}
            {activeTab === 'education' && (
              <form onSubmit={handleEducationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                  <input
                    type="text"
                    value={educationForm.institution}
                    onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <input
                    type="text"
                    value={educationForm.degree}
                    onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
                  <input
                    type="text"
                    value={educationForm.field}
                    onChange={(e) => setEducationForm({ ...educationForm, field: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={educationForm.start_date}
                      onChange={(e) => setEducationForm({ ...educationForm, start_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={educationForm.end_date}
                      onChange={(e) => setEducationForm({ ...educationForm, end_date: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Image URL</label>
                  <input
                    type="url"
                    value={educationForm.certificate_image}
                    onChange={(e) => setEducationForm({ ...educationForm, certificate_image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={educationForm.description}
                    onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <><Save className="w-4 h-4 inline mr-2" />Save Education</>
                  )}
                </button>
              </form>
            )}

            {/* Achievement Form */}
            {activeTab === 'achievements' && (
              <form onSubmit={handleAchievementSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g. AWS Solutions Architect"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issuer</label>
                  <input
                    type="text"
                    value={achievementForm.issuer}
                    onChange={(e) => setAchievementForm({ ...achievementForm, issuer: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g. Amazon Web Services"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={achievementForm.date}
                    onChange={(e) => setAchievementForm({ ...achievementForm, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credential URL</label>
                  <input
                    type="url"
                    value={achievementForm.credential_url}
                    onChange={(e) => setAchievementForm({ ...achievementForm, credential_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={achievementForm.image_url}
                    onChange={(e) => setAchievementForm({ ...achievementForm, image_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <><Save className="w-4 h-4 inline mr-2" />Save Achievement</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
