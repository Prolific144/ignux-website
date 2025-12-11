// src/pages/Admin/Dashboard.jsx
import { useState } from 'react';
import { useContentManager } from '../../hooks/useContentManager';
import ContentForm from '../../components/Admin/ContentForm';
import { Edit, Trash2, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { 
    content, 
    addContent, 
    updateContent, 
    deleteContent 
  } = useContentManager(activeTab);

  const handleSubmit = async (formData) => {
    if (editingItem) {
      await updateContent(editingItem.id, formData);
    } else {
      await addContent(formData);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="admin-dashboard">
      <h1>IGNUX Admin Dashboard</h1>
      
      <div className="admin-tabs">
        {['portfolio', 'blog', 'testimonials', 'services'].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="admin-content">
        {showForm ? (
          <ContentForm
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingItem(null);
            }}
            initialData={editingItem || {}}
            contentType={activeTab}
          />
        ) : (
          <>
            <div className="admin-header">
              <h2>Manage {activeTab}</h2>
              <button 
                className="btn-primary"
                onClick={() => setShowForm(true)}
              >
                Add New
              </button>
            </div>

            <div className="content-list">
              {content.map(item => (
                <div key={item.id} className="content-item">
                  {item.image && (
                    <img src={item.image} alt={item.title} />
                  )}
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="item-meta">
                      <span>{item.category}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button onClick={() => {
                      setEditingItem(item);
                      setShowForm(true);
                    }}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteContent(item.id)}>
                      <Trash2 size={16} />
                    </button>
                    <button onClick={() => window.open(`/${activeTab}/${item.id}`, '_blank')}>
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};