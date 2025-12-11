// src/components/Admin/ContentForm.jsx
import { useState } from 'react';
import { Upload, X } from 'lucide-react';

const ContentForm = ({ onSubmit, onCancel, initialData = {}, contentType }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    image: initialData.image || '',
    video: initialData.video || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    tags: initialData.tags ? initialData.tags.join(', ') : '',
    featured: initialData.featured || false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local URL for preview
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, image: previewUrl }));
      
      // In production, you'd upload to a server
      // const uploadedUrl = await uploadToCloudinary(file);
      // setFormData(prev => ({ ...prev, image: uploadedUrl }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="content-form">
      <div className="form-group">
        <label>Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows="3"
          required
        />
      </div>

      <div className="form-group">
        <label>Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">Select Category</option>
          <option value="weddings">Weddings</option>
          <option value="corporate">Corporate</option>
          <option value="festivals">Festivals</option>
          <option value="private">Private Events</option>
        </select>
      </div>

      <div className="form-group">
        <label>Image</label>
        <div className="image-upload">
          {formData.image && (
            <img src={formData.image} alt="Preview" className="image-preview" />
          )}
          <label className="upload-button">
            <Upload size={20} />
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              hidden
            />
          </label>
        </div>
      </div>

      <div className="form-group">
        <label>Tags (comma-separated)</label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="wedding, fireworks, nairobi"
        />
      </div>

      <div className="form-group checkbox">
        <label>
          <input
            type="checkbox"
            checked={formData.featured}
            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
          />
          Featured Item
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {initialData.id ? 'Update' : 'Add'} Content
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
};