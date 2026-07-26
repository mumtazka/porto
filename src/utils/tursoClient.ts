const API_BASE = import.meta.env.VITE_API_BASE || '';

const isConfigured = !!import.meta.env.VITE_API_BASE || !!import.meta.env.VITE_TURSO_CONFIGURED;

if (!isConfigured) {
  console.warn(
    'Turso API is not configured. The app will run in read-only/demo mode with local data.'
  );
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch((): { error: string } => ({ error: 'Request failed' }));
    throw new Error(error.error || `API error: ${res.status}`);
  }
  return res.json();
}

export const tursoApi = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: 'DELETE' }),
};

export const isTursoConfigured = () => isConfigured;

export const mockProjects: unknown[] = [];
export const mockEducation: unknown[] = [];
export const mockAchievements: unknown[] = [];
