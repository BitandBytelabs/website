import React, { useState } from 'react';
import { Project, ProjectCategory, ProjectStatus, TechSpec, ProjectChallenge } from '../../types';
import { X, Plus, Trash2, Save, FileText, Cpu, Sliders, Layers } from 'lucide-react';

interface ProjectEditorModalProps {
  project?: Partial<Project> | null;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => Promise<void>;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({ project, onClose, onSave }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [projectNumber, setProjectNumber] = useState(project?.projectNumber || '002');
  const [slug, setSlug] = useState(project?.slug || '');
  const [category, setCategory] = useState<ProjectCategory>(project?.category || 'Electronics');
  const [status, setStatus] = useState<ProjectStatus>(project?.status || 'In Development');
  const [shortDescription, setShortDescription] = useState(project?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(project?.fullDescription || '');
  const [documentation, setDocumentation] = useState(project?.documentation || '');
  const [thumbnail, setThumbnail] = useState(project?.thumbnail || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800');
  const [githubUrl, setGithubUrl] = useState(project?.githubUrl || '');
  const [demoUrl, setDemoUrl] = useState(project?.demoUrl || '');
  const [published, setPublished] = useState<boolean>(project?.published ?? true);
  const [featured, setFeatured] = useState<boolean>(project?.featured ?? false);

  // Arrays
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies || ['Electronics', 'C++']);
  const [techInput, setTechInput] = useState('');

  const [hardware, setHardware] = useState<string[]>(project?.hardware || ['Microcontroller Board', 'Sensors']);
  const [hwInput, setHwInput] = useState('');

  const [specs, setSpecs] = useState<TechSpec[]>(project?.specs || [{ label: 'Supply Voltage', value: '5.0', unit: 'V' }]);
  const [challenges, setChallenges] = useState<ProjectChallenge[]>(project?.challenges || []);

  const [submitting, setSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!project) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  };

  const handleAddTech = () => {
    if (techInput.trim()) {
      setTechnologies([...technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const handleAddHw = () => {
    if (hwInput.trim()) {
      setHardware([...hardware, hwInput.trim()]);
      setHwInput('');
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: 'New Param', value: '100', unit: 'unit' }]);
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecs(specs.filter((_, i) => i !== idx));
  };

  const handleAddChallenge = () => {
    setChallenges([...challenges, { challenge: 'Thermal Jitter', solution: 'Added heat sink.' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave({
        id: project?.id,
        title,
        projectNumber,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category,
        status,
        shortDescription,
        fullDescription,
        documentation,
        thumbnail,
        githubUrl,
        demoUrl,
        published,
        featured,
        technologies,
        hardware,
        software: ['KiCad', 'GCC Toolchain'],
        teamMemberIds: project?.teamMemberIds || ['team-001'],
        startDate: project?.startDate || new Date().toISOString().split('T')[0],
        gallery: [thumbnail],
        videos: [],
        specs,
        keyAchievements: ['System verified in hardware lab testing'],
        challenges,
        futureImprovements: ['v2.0 Revision planned'],
      });
      onClose();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0D0D0D] border border-[#1A1A1A] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative font-mono text-xs text-[#E0E0E0]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-[#1A1A1A] text-[#888] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1 border-b border-[#1A1A1A] pb-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-wider">
            {project ? `Edit Project #${project.projectNumber}: ${project.title}` : 'Create New Engineering Project'}
          </h2>
          <p className="text-[#888] font-sans text-xs">
            Enter technical details, component stack, and markdown documentation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* BASIC INFO */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[#888] mb-1 uppercase font-bold">Project Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. AM Walkie-Talkie Transceiver"
                className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
              />
            </div>

            <div>
              <label className="block text-[#888] mb-1 uppercase font-bold">Project Number *</label>
              <input
                type="text"
                required
                value={projectNumber}
                onChange={(e) => setProjectNumber(e.target.value)}
                placeholder="001"
                className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[#888] mb-1 uppercase font-bold">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="am-walkie-talkie"
                className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
              />
            </div>

            <div>
              <label className="block text-[#888] mb-1 uppercase font-bold">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
              >
                <option value="Electronics">Electronics</option>
                <option value="Communication">Communication</option>
                <option value="Embedded Systems">Embedded Systems</option>
                <option value="IoT">IoT</option>
                <option value="Robotics">Robotics</option>
                <option value="Drones">Drones</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Software">Software</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            <div>
              <label className="block text-[#888] mb-1 uppercase font-bold">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
              >
                <option value="Research">Research</option>
                <option value="Planning">Planning</option>
                <option value="In Development">In Development</option>
                <option value="Prototyping">Prototyping</option>
                <option value="Testing">Testing</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#888] mb-1 uppercase font-bold">Short Summary *</label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Brief overview for repository list..."
              className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
            />
          </div>

          <div>
            <label className="block text-[#888] mb-1 uppercase font-bold">Full Engineering Overview *</label>
            <textarea
              rows={3}
              required
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              placeholder="In-depth description of design requirements and execution..."
              className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41] font-sans"
            />
          </div>

          <div>
            <label className="block text-[#888] mb-1 uppercase font-bold">Documentation (Markdown) *</label>
            <textarea
              rows={6}
              required
              value={documentation}
              onChange={(e) => setDocumentation(e.target.value)}
              placeholder="# Project Documentation..."
              className="w-full bg-[#0A0A0A] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41] font-mono"
            />
          </div>

          {/* HARDWARE & TECH TAGS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#888] mb-1 uppercase font-bold">Hardware Components</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={hwInput}
                  onChange={(e) => setHwInput(e.target.value)}
                  placeholder="e.g. 2N2222 Transistor"
                  className="flex-1 bg-[#0A0A0A] border border-[#222] p-2 text-white focus:outline-none focus:border-[#00FF41]"
                />
                <button
                  type="button"
                  onClick={handleAddHw}
                  className="px-3 py-2 bg-[#1A1A1A] text-white hover:bg-[#222] uppercase font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {hardware.map((h, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#0A0A0A] text-[#FFB800] border border-[#222]">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#888] mb-1 uppercase font-bold">Technologies</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="e.g. FreeRTOS"
                  className="flex-1 bg-[#0A0A0A] border border-[#222] p-2 text-white focus:outline-none focus:border-[#00FF41]"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-3 py-2 bg-[#1A1A1A] text-white hover:bg-[#222] uppercase font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {technologies.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 bg-[#0A0A0A] text-[#00FF41] border border-[#222]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SPECS MANAGER */}
          <div className="space-y-2 pt-2 border-t border-[#1A1A1A]">
            <div className="flex items-center justify-between">
              <span className="text-[#888] font-bold uppercase">Technical Specifications</span>
              <button
                type="button"
                onClick={handleAddSpec}
                className="px-2.5 py-1 bg-[#1A1A1A] text-[#00FF41] hover:bg-[#222] flex items-center space-x-1 uppercase font-bold"
              >
                <Plus className="w-3 h-3" />
                <span>Add Spec</span>
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((s, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].label = e.target.value;
                      setSpecs(updated);
                    }}
                    className="flex-1 bg-[#0A0A0A] border border-[#222] p-1.5 text-white"
                  />
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].value = e.target.value;
                      setSpecs(updated);
                    }}
                    className="w-24 bg-[#0A0A0A] border border-[#222] p-1.5 text-white"
                  />
                  <input
                    type="text"
                    value={s.unit || ''}
                    onChange={(e) => {
                      const updated = [...specs];
                      updated[idx].unit = e.target.value;
                      setSpecs(updated);
                    }}
                    placeholder="unit"
                    className="w-16 bg-[#0A0A0A] border border-[#222] p-1.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PUBLISHED & FEATURED TOGGLES */}
          <div className="flex items-center space-x-6 pt-2 border-t border-[#1A1A1A]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="accent-[#00FF41] w-4 h-4"
              />
              <span className="text-white font-bold uppercase">Published Publicly</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[#FFB800] w-4 h-4"
              />
              <span className="text-white font-bold uppercase">Featured Spotlight</span>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-[#1A1A1A] flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#1A1A1A] text-[#AAA] hover:bg-[#222] uppercase font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#00FF41] text-black font-bold hover:bg-[#00e038] flex items-center space-x-2 uppercase"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? 'Saving Record...' : 'SAVE PROJECT RECORD'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
