import React, { useState, useEffect } from 'react';
import { MediaItem } from '../../types';
import { ApiService, getOptimizedImageUrl } from '../../services/api';
import { X, Upload, Search, Image as ImageIcon, Trash2, Check, Eye, Loader2, Folder, AlertTriangle } from 'lucide-react';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mediaItem: MediaItem) => void;
  defaultFolder?: 'bitvolt/projects' | 'bitvolt/team' | 'bitvolt/research' | 'bitvolt/general' | string;
  modalTitle?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  defaultFolder = 'bitvolt/general',
  modalTitle = 'Select Media Asset',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Upload Form State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDataUrl, setUploadDataUrl] = useState<string | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadFolder, setUploadFolder] = useState<string>(defaultFolder || 'bitvolt/general');
  const [uploadCategory, setUploadCategory] = useState<string>('General');
  const [uploading, setUploading] = useState(false);

  // Selected item state in modal
  const [highlightedItem, setHighlightedItem] = useState<MediaItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
      if (defaultFolder && defaultFolder !== 'All') {
        setUploadFolder(defaultFolder);
      }
    }
  }, [isOpen]);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ApiService.getMedia();
      setMediaList(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError('Invalid file type. Please select a JPG, PNG, or WEBP image.');
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    setError(null);
    setUploadFile(file);
    if (!uploadTitle) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      setUploadTitle(nameWithoutExt);
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDataUrl) {
      setError('Please select an image file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const newMedia = await ApiService.uploadMedia({
        fileDataUrl: uploadDataUrl,
        title: uploadTitle || uploadFile?.name || 'Uploaded Asset',
        folder: uploadFolder,
        category: uploadCategory,
      });

      setSuccessMsg('Image uploaded to Cloudinary successfully!');
      setUploadFile(null);
      setUploadDataUrl(null);
      setUploadTitle('');
      
      // Refresh list and switch to library tab highlighting new item
      await loadMedia();
      setHighlightedItem(newMedia);
      setActiveTab('library');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (e: React.MouseEvent, item: MediaItem) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete '${item.title}'?`)) return;

    setError(null);
    try {
      await ApiService.deleteMedia(item.id);
      setSuccessMsg(`Deleted '${item.title}' from Cloudinary and database.`);
      if (highlightedItem?.id === item.id) setHighlightedItem(null);
      await loadMedia();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleConfirmSelect = () => {
    if (highlightedItem) {
      onSelect(highlightedItem);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Filtered media
  const filteredMedia = mediaList.filter((item) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = item.title?.toLowerCase().includes(q) || item.url?.toLowerCase().includes(q);
    const folderMatch = selectedFolder === 'All' || (item.folder && item.folder.includes(selectedFolder));
    const categoryMatch = selectedCategory === 'All' || item.category === selectedCategory;
    return titleMatch && folderMatch && categoryMatch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 font-mono text-xs">
      <div className="bg-[#0D0D0D] border border-[#222] text-[#E0E0E0] w-full max-w-5xl h-[85vh] flex flex-col rounded-sm shadow-2xl overflow-hidden relative">
        {/* MODAL HEADER */}
        <div className="px-5 py-4 border-b border-[#222] bg-[#0A0A0A] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-[#00FF41]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">{modalTitle}</h2>
            <span className="bg-[#1A1A1A] border border-[#333] px-2 py-0.5 text-[10px] text-[#00FF41] rounded-sm">
              Cloudinary Media Library
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#1A1A1A] text-[#888] hover:text-white rounded-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* NOTIFICATIONS */}
        {error && (
          <div className="mx-5 mt-3 p-3 bg-red-950/60 border border-red-500/40 text-red-300 flex items-start space-x-2 rounded-sm">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px] font-sans">{error}</div>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {successMsg && (
          <div className="mx-5 mt-3 p-2.5 bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-[11px] font-sans rounded-sm">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TABS HEADER */}
        <div className="px-5 pt-3 bg-[#0A0A0A] border-b border-[#222] flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 uppercase font-bold text-[11px] border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'library'
                ? 'border-[#00FF41] text-[#00FF41] bg-[#111]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Browse Library ({mediaList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 uppercase font-bold text-[11px] border-b-2 flex items-center space-x-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-[#00FF41] text-[#00FF41] bg-[#111]'
                : 'border-transparent text-[#888] hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload New to Cloudinary</span>
          </button>
        </div>

        {/* TAB BODY */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'library' && (
            <div className="space-y-4">
              {/* FILTERS & SEARCH */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#666]" />
                  <input
                    type="text"
                    placeholder="Search by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#222] pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#00FF41]"
                  />
                </div>

                <div>
                  <select
                    value={selectedFolder}
                    onChange={(e) => setSelectedFolder(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#222] px-3 py-2 text-white focus:outline-none focus:border-[#00FF41]"
                  >
                    <option value="All">Folder: All Cloudinary Folders</option>
                    <option value="bitvolt/projects">bitvolt/projects</option>
                    <option value="bitvolt/team">bitvolt/team</option>
                    <option value="bitvolt/research">bitvolt/research</option>
                    <option value="bitvolt/general">bitvolt/general</option>
                  </select>
                </div>

                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-[#0A0A0A] border border-[#222] px-3 py-2 text-white focus:outline-none focus:border-[#00FF41]"
                  >
                    <option value="All">Category: All Categories</option>
                    <option value="Schematic">Schematic</option>
                    <option value="PCB">PCB</option>
                    <option value="Diagram">Diagram</option>
                    <option value="Prototype">Prototype</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* MEDIA GRID */}
              {loading ? (
                <div className="py-20 text-center space-y-2 text-[#888]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#00FF41]" />
                  <p>Fetching Cloudinary assets...</p>
                </div>
              ) : filteredMedia.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-[#222] space-y-3 p-6 rounded-sm">
                  <ImageIcon className="w-8 h-8 text-[#444] mx-auto" />
                  <p className="text-[#888]">No media assets match your query.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-4 py-2 bg-[#00FF41] text-black font-bold uppercase rounded-sm inline-block"
                  >
                    Upload First Image
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filteredMedia.map((item) => {
                    const isSelected = highlightedItem?.id === item.id;
                    const optUrl = getOptimizedImageUrl(item.url || item.secureUrl);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setHighlightedItem(item)}
                        className={`group bg-[#0A0A0A] border p-2 space-y-2 rounded-sm cursor-pointer relative transition-all ${
                          isSelected
                            ? 'border-[#00FF41] ring-1 ring-[#00FF41] bg-[#00FF41]/5'
                            : 'border-[#222] hover:border-[#444]'
                        }`}
                      >
                        {/* IMAGE CONTAINER */}
                        <div className="h-32 bg-[#050505] rounded-sm overflow-hidden relative flex items-center justify-center">
                          <img
                            src={optUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-[#00FF41]/20 backdrop-blur-[1px] flex items-center justify-center">
                              <span className="p-1.5 bg-[#00FF41] text-black rounded-full shadow-lg">
                                <Check className="w-4 h-4 stroke-[3]" />
                              </span>
                            </div>
                          )}
                          <div className="absolute top-1.5 right-1.5 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewItem(item);
                              }}
                              className="p-1 bg-black/80 text-white hover:text-[#00FF41] rounded-sm"
                              title="Full Preview"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteMedia(e, item)}
                              className="p-1 bg-red-950/80 text-red-300 hover:text-red-200 rounded-sm"
                              title="Delete from Cloudinary"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* INFO FOOTER */}
                        <div className="space-y-1">
                          <p className="font-bold text-[11px] text-white truncate">{item.title}</p>
                          <div className="flex items-center justify-between text-[9px] text-[#888]">
                            <span className="truncate text-[#00FF41] font-mono">{item.format || 'PNG'}</span>
                            <span className="truncate">{item.folder ? item.folder.replace('bitvolt/', '') : 'general'}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
            <div className="max-w-2xl mx-auto py-4 space-y-6">
              <form onSubmit={handleUploadSubmit} className="space-y-4 bg-[#0A0A0A] border border-[#222] p-6 rounded-sm">
                <div className="space-y-1">
                  <h3 className="font-bold uppercase text-white">Upload Image to Cloudinary</h3>
                  <p className="text-[#888] font-sans text-xs">
                    Images are stored directly in Cloudinary and optimized automatically for fast delivery.
                  </p>
                </div>

                {/* DROPZONE / FILE SELECTOR */}
                <div>
                  <label className="block text-[#AAA] mb-1 uppercase font-bold">Select File (JPG, PNG, WEBP, max 10MB) *</label>
                  <div className="border-2 border-dashed border-[#222] hover:border-[#00FF41] bg-[#050505] p-6 text-center rounded-sm transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {uploadDataUrl ? (
                      <div className="space-y-3">
                        <img
                          src={uploadDataUrl}
                          alt="Pre-upload preview"
                          className="max-h-44 mx-auto rounded-sm border border-[#333] object-contain"
                        />
                        <p className="text-[#00FF41] font-bold text-[11px]">
                          {uploadFile?.name} ({(uploadFile!.size / (1024 * 1024)).toFixed(2)} MB)
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-4">
                        <Upload className="w-8 h-8 text-[#00FF41] mx-auto animate-bounce" />
                        <p className="text-white font-bold">Click or drag image file here</p>
                        <p className="text-[#666] text-[10px]">Supports JPEG, PNG, WEBP up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* TITLE & FOLDER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#AAA] mb-1 uppercase font-bold">Asset Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Walkie Talkie PCB Top View"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#AAA] mb-1 uppercase font-bold">Cloudinary Target Folder *</label>
                    <select
                      value={uploadFolder}
                      onChange={(e) => setUploadFolder(e.target.value)}
                      className="w-full bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                    >
                      <option value="bitvolt/projects">bitvolt/projects (Projects Cover & Gallery)</option>
                      <option value="bitvolt/team">bitvolt/team (Team Profile Photos)</option>
                      <option value="bitvolt/research">bitvolt/research (Research Articles)</option>
                      <option value="bitvolt/general">bitvolt/general (General Assets)</option>
                    </select>
                  </div>
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-[#AAA] mb-1 uppercase font-bold">Asset Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full bg-[#050505] border border-[#222] p-2.5 text-white focus:outline-none focus:border-[#00FF41]"
                  >
                    <option value="General">General</option>
                    <option value="Schematic">Schematic</option>
                    <option value="PCB">PCB Layout</option>
                    <option value="Diagram">System Diagram</option>
                    <option value="Prototype">Prototype Hardware</option>
                  </select>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={uploading || !uploadDataUrl}
                    className={`w-full py-3 bg-[#00FF41] text-black font-bold uppercase rounded-sm flex items-center justify-center space-x-2 transition-all ${
                      uploading || !uploadDataUrl ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00e038]'
                    }`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading to Cloudinary...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>UPLOAD & SAVE METADATA</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-[#222] bg-[#0A0A0A] flex items-center justify-between">
          <div className="text-[11px] text-[#888] truncate max-w-md">
            {highlightedItem ? (
              <span className="text-[#00FF41]">
                Selected: <strong className="text-white">{highlightedItem.title}</strong>
              </span>
            ) : (
              <span>Click any image above to select it.</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#1A1A1A] text-[#AAA] hover:bg-[#222] uppercase font-bold rounded-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelect}
              disabled={!highlightedItem}
              className={`px-6 py-2 bg-[#00FF41] text-black font-bold uppercase rounded-sm flex items-center space-x-1.5 ${
                !highlightedItem ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00e038]'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>Use Selected Image</span>
            </button>
          </div>
        </div>
      </div>

      {/* FULL PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-[#222] max-w-3xl w-full p-6 space-y-4 rounded-sm relative text-xs">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-4 right-4 p-1.5 bg-[#1A1A1A] text-[#888] hover:text-white rounded-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-bold uppercase text-white text-sm">{previewItem.title}</h3>

            <div className="bg-[#050505] border border-[#222] p-2 flex items-center justify-center max-h-[60vh] overflow-hidden rounded-sm">
              <img
                src={previewItem.url || previewItem.secureUrl}
                alt={previewItem.title}
                className="max-h-[55vh] object-contain rounded-sm"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#0A0A0A] p-3 border border-[#222] text-[#888] text-[10px]">
              <div>
                <span className="block text-[#AAA]">Cloudinary Public ID:</span>
                <span className="text-[#00FF41] font-mono truncate block">{previewItem.cloudinaryPublicId || previewItem.publicId}</span>
              </div>
              <div>
                <span className="block text-[#AAA]">Folder:</span>
                <span className="text-white font-mono">{previewItem.folder || 'bitvolt/general'}</span>
              </div>
              <div>
                <span className="block text-[#AAA]">Format:</span>
                <span className="text-white font-mono">{previewItem.format}</span>
              </div>
              <div>
                <span className="block text-[#AAA]">Dimensions:</span>
                <span className="text-white font-mono">{previewItem.width || '?'} x {previewItem.height || '?'} px</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setHighlightedItem(previewItem);
                  onSelect(previewItem);
                  setPreviewItem(null);
                  onClose();
                }}
                className="px-4 py-2 bg-[#00FF41] text-black font-bold uppercase rounded-sm"
              >
                Select This Asset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
