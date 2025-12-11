// src/services/data.service.js
import { siteConfig } from '../config/site.config';

export class DataService {
  static getContactInfo() {
    return siteConfig.company.contact;
  }

  static getSocialLinks() {
    return siteConfig.company.social;
  }

  static async uploadImage(file, category) {
    // Implement image upload to Cloudinary, Firebase, or your own server
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  }

  static async getPortfolioItems() {
    try {
      if (process.env.REACT_APP_API_URL) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/portfolio`);
        return await response.json();
      } else {
        // Fallback to local storage
        return JSON.parse(localStorage.getItem('ignux_portfolio') || '[]');
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return [];
    }
  }
}