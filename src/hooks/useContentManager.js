// src/hooks/useContentManager.js
import { useState, useEffect } from 'react';

export const useContentManager = (contentType) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      
      // Try API first
      if (process.env.REACT_APP_API_URL) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/${contentType}`);
        if (response.ok) {
          const data = await response.json();
          setContent(data);
          // Cache in localStorage
          localStorage.setItem(`ignux_${contentType}`, JSON.stringify(data));
          return;
        }
      }
      
      // Fallback to localStorage
      const localContent = localStorage.getItem(`ignux_${contentType}`);
      if (localContent) {
        setContent(JSON.parse(localContent));
      }
      
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${contentType}:`, err);
      
      // Last resort: fallback data
      const fallback = localStorage.getItem(`ignux_${contentType}_fallback`);
      if (fallback) {
        setContent(JSON.parse(fallback));
      }
    } finally {
      setLoading(false);
    }
  };

  const addContent = async (newItem) => {
    try {
      const itemWithMeta = {
        ...newItem,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedContent = [itemWithMeta, ...content];
      setContent(updatedContent);
      
      // Save to localStorage
      localStorage.setItem(`ignux_${contentType}`, JSON.stringify(updatedContent));
      
      // Send to API if available
      if (process.env.REACT_APP_API_URL) {
        await fetch(`${process.env.REACT_APP_API_URL}/${contentType}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemWithMeta)
        });
      }
      
      return itemWithMeta;
    } catch (err) {
      console.error('Error adding content:', err);
      throw err;
    }
  };

  const updateContent = async (id, updates) => {
    try {
      const updatedContent = content.map(item => 
        item.id === id 
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      );
      
      setContent(updatedContent);
      localStorage.setItem(`ignux_${contentType}`, JSON.stringify(updatedContent));
      
      if (process.env.REACT_APP_API_URL) {
        await fetch(`${process.env.REACT_APP_API_URL}/${contentType}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
      }
    } catch (err) {
      console.error('Error updating content:', err);
      throw err;
    }
  };

  const deleteContent = async (id) => {
    try {
      const updatedContent = content.filter(item => item.id !== id);
      setContent(updatedContent);
      localStorage.setItem(`ignux_${contentType}`, JSON.stringify(updatedContent));
      
      if (process.env.REACT_APP_API_URL) {
        await fetch(`${process.env.REACT_APP_API_URL}/${contentType}/${id}`, {
          method: 'DELETE'
        });
      }
    } catch (err) {
      console.error('Error deleting content:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchContent();
  }, [contentType]);

  return {
    content,
    loading,
    error,
    addContent,
    updateContent,
    deleteContent,
    refetch: fetchContent
  };
};