import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  GraduationCap, 
  Mail, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  X,
  Save,
  Loader2
} from 'lucide-react';
import { useAuth, useProjects, useEducation, useMessages } from '../hooks/useSupabase';
import type { Project, Education } from '../types/database';

type Tab = 'projects' | 'education' | 'messages';

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

export default function Admin() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject } = useProjects();
  const { education, loading: educationLoading, addEducation, updateEducation, deleteEducation } = useEducation();
  const { messages, fetchMessages } = useMessages();
  
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectFormData>(INITIAL_PROJECT_FORM);
  const [educationForm, setEducationForm] = useState<EducationFormData>(INITIAL_EDUCATION_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Login Screen
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-strong rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Sign in to manage your portfolio</p>
            <p className="text-gray-500 text-sm mt-2">Demo: admin@example.com / admin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="w-full btn-primary">
              Sign In
            </button>
          </form>

          <a
            href="/"
            className="block w-full mt-4 text-center text-gray-400 hover:text-white transition-colors"
          >
            Back to Portfolio
          </a>
        </div>
      </div>
    );
  }

  // Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-charcoal-light border-r border-white/10 hidden lg:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'projects'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            Projects
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'education'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            Education
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'messages'
                ? 'bg-orange-500 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Mail className="w-5 h-5" />
            Messages
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-charcoal-light border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold">Admin</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-gray-400">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        {/* Mobile Tabs */}
        <div className="flex gap-2 mt-4">
          {(['projects', 'education', 'messages'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-sm capitalize transition-all ${
                activeTab === tab
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              {tab}
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
              <h2 className="text-2xl font-bold text-white">Projects</h2>
              <button
                onClick={() => openProjectModal()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="glass rounded-xl p-4 flex items-center gap-4">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{project.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-1">{project.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {project.featured && (
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                            Featured
                          </span>
                        )}
                        <span className="text-gray-500 text-xs">
                          {project.tech_stack.length} technologies
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openProjectModal(project)}
                        className="p-2 glass rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="p-2 glass rounded-lg text-gray-400 hover:text-red-400 transition-colors"
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
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <button
                onClick={() => openEducationModal()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>

            {educationLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4">
                {education.map((edu) => (
                  <div key={edu.id} className="glass rounded-xl p-4 flex items-center gap-4">
                    <img
                      src={edu.certificate_image || 'https://via.placeholder.com/64'}
                      alt={edu.institution}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">{edu.institution}</h3>
                      <p className="text-orange-400 text-sm">{edu.degree}</p>
                      <p className="text-gray-500 text-sm">{edu.field}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEducationModal(edu)}
                        className="p-2 glass rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEducation(edu.id)}
                        className="p-2 glass rounded-lg text-gray-400 hover:text-red-400 transition-colors"
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
            <h2 className="text-2xl font-bold text-white mb-6">Messages</h2>
            <div className="grid gap-4">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="glass rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{message.name}</h3>
                      <span className="text-gray-500 text-sm">
                        {new Date(message.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-orange-400 text-sm mb-2">{message.email}</p>
                    <p className="text-gray-300">{message.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-strong rounded-2xl p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 glass rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-6">
              {editingProject || editingEducation ? 'Edit' : 'Add'} {activeTab === 'projects' ? 'Project' : 'Education'}
            </h3>

            {activeTab === 'projects' ? (
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className="input-glass resize-none"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                  <input
                    type="url"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    value={projectForm.tech_stack}
                    onChange={(e) => setProjectForm({ ...projectForm, tech_stack: e.target.value })}
                    className="input-glass"
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Project URL</label>
                    <input
                      type="url"
                      value={projectForm.project_url}
                      onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })}
                      className="input-glass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL</label>
                    <input
                      type="url"
                      value={projectForm.github_url}
                      onChange={(e) => setProjectForm({ ...projectForm, github_url: e.target.value })}
                      className="input-glass"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500"
                  />
                  <label htmlFor="featured" className="text-gray-300">Featured Project</label>
                </div>
                <button type="submit" className="w-full btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Project
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleEducationSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Institution</label>
                  <input
                    type="text"
                    value={educationForm.institution}
                    onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Degree</label>
                  <input
                    type="text"
                    value={educationForm.degree}
                    onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Field</label>
                  <input
                    type="text"
                    value={educationForm.field}
                    onChange={(e) => setEducationForm({ ...educationForm, field: e.target.value })}
                    className="input-glass"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={educationForm.start_date}
                      onChange={(e) => setEducationForm({ ...educationForm, start_date: e.target.value })}
                      className="input-glass"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">End Date</label>
                    <input
                      type="date"
                      value={educationForm.end_date}
                      onChange={(e) => setEducationForm({ ...educationForm, end_date: e.target.value })}
                      className="input-glass"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Certificate Image URL</label>
                  <input
                    type="url"
                    value={educationForm.certificate_image}
                    onChange={(e) => setEducationForm({ ...educationForm, certificate_image: e.target.value })}
                    className="input-glass"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={educationForm.description}
                    onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                    className="input-glass resize-none"
                    rows={3}
                  />
                </div>
                <button type="submit" className="w-full btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    <>
                      <Save className="w-4 h-4 inline mr-2" />
                      Save Education
                    </>
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
