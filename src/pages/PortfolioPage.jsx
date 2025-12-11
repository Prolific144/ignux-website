import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Calendar, 
  MapPin, 
  Users,
  Filter
} from 'lucide-react';

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'private', label: 'Private Events' }
  ];

  const projects = [
    {
      id: 1,
      title: 'Karen Wedding Finale',
      category: 'weddings',
      date: 'December 2023',
      location: 'Karen, Nairobi',
      description: 'Grand fireworks finale for a 500-guest wedding celebration.',
      image: '/images/portfolio/wedding-1.jpg',
      video: '/videos/wedding-showcase.mp4'
    },
    {
      id: 2,
      title: 'Tech Conference Launch',
      category: 'corporate',
      date: 'November 2023',
      location: 'KICC, Nairobi',
      description: 'Product launch with brand-colored pyrotechnics.',
      image: '/images/portfolio/corporate-1.jpg',
      stats: { guests: '2000', duration: '15min' }
    },
    {
      id: 3,
      title: 'Music Festival Finale',
      category: 'festivals',
      date: 'October 2023',
      location: 'Carnivore Grounds',
      description: 'Large-scale synchronized fireworks with live music.',
      image: '/images/portfolio/festival-1.jpg',
      stats: { guests: '10000', duration: '30min' }
    },
    {
      id: 4,
      title: 'Private Birthday Bash',
      category: 'private',
      date: 'September 2023',
      location: 'Muthaiga Residence',
      description: 'Intimate garden fireworks display.',
      image: '/images/portfolio/private-1.jpg',
      stats: { guests: '100', duration: '10min' }
    },
    {
      id: 5,
      title: 'Lakeside Wedding',
      category: 'weddings',
      date: 'August 2023',
      location: 'Lake Naivasha',
      description: 'Waterfront fireworks reflection show.',
      image: '/images/portfolio/wedding-2.jpg'
    },
    {
      id: 6,
      title: 'Corporate Gala Night',
      category: 'corporate',
      date: 'July 2023',
      location: 'Sankara Hotel',
      description: 'Indoor pyrotechnics for awards ceremony.',
      image: '/images/portfolio/corporate-2.jpg'
    }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Portfolio | IGNUX - Our Work</title>
        <meta name="description" content="View our portfolio of spectacular fireworks displays and stage FX for weddings, corporate events, and festivals across Kenya." />
      </Helmet>

      {/* Hero */}
      <section className="portfolio-hero">
        <div className="container">
          <h1 className="section-title">
            Our <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="section-subtitle">
            Experience the magic through our past projects. Each display tells a unique story.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="section portfolio-filters">
        <div className="container">
          <div className="filters-container">
            <Filter className="filter-icon" />
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="section">
        <div className="container">
          <div className="portfolio-grid">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="portfolio-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProject(project)}
              >
                <div className="portfolio-image">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="portfolio-overlay">
                    <Play className="play-icon" />
                  </div>
                </div>
                <div className="portfolio-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="portfolio-meta">
                    <div className="meta-item">
                      <Calendar size={16} />
                      <span>{project.date}</span>
                    </div>
                    <div className="meta-item">
                      <MapPin size={16} />
                      <span>{project.location}</span>
                    </div>
                    {project.stats && (
                      <div className="meta-item">
                        <Users size={16} />
                        <span>{project.stats.guests} guests</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats-section">
        <div className="container">
          <div className="portfolio-stats">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Events Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="project-modal" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedProject(null)}>
              ×
            </button>
            <div className="modal-body">
              <h2>{selectedProject.title}</h2>
              <div className="modal-details">
                <p><strong>Category:</strong> {selectedProject.category}</p>
                <p><strong>Date:</strong> {selectedProject.date}</p>
                <p><strong>Location:</strong> {selectedProject.location}</p>
                <p><strong>Description:</strong> {selectedProject.description}</p>
              </div>
              {selectedProject.video ? (
                <video controls className="modal-media">
                  <source src={selectedProject.video} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="modal-media"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioPage;