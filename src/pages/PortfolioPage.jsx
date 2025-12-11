import { Helmet } from 'react-helmet-async';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Calendar, 
  MapPin, 
  Users,
  Filter,
  Video,
  Image as ImageIcon,
  X,
  Volume2,
  VolumeX
} from 'lucide-react';

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'videos', 'images'
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'weddings', label: 'Weddings' },
    { id: 'corporate', label: 'Corporate' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'private', label: 'Private Events' }
  ];

  const contentTabs = [
    { id: 'all', label: 'All Content', icon: Filter },
    { id: 'videos', label: 'Video Gallery', icon: Video },
    { id: 'images', label: 'Photo Gallery', icon: ImageIcon }
  ];

  const projects = [
    {
      id: 1,
      title: 'Karen Wedding Finale',
      category: 'weddings',
      date: 'December 2023',
      location: 'Karen, Nairobi',
      description: 'Grand fireworks finale for a 500-guest wedding celebration with synchronized music.',
      type: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-display-over-a-lake-1122-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '500', duration: '12min', height: '150m' },
      tags: ['grand finale', 'synchronized', 'wedding']
    },
    {
      id: 2,
      title: 'Tech Conference Launch',
      category: 'corporate',
      date: 'November 2023',
      location: 'KICC, Nairobi',
      description: 'Product launch with brand-colored pyrotechnics and LED wall integration.',
      type: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-display-1171-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '2000', duration: '15min', colors: 'Brand Colors' },
      tags: ['corporate', 'branding', 'indoor']
    },
    {
      id: 3,
      title: 'Music Festival Finale',
      category: 'festivals',
      date: 'October 2023',
      location: 'Carnivore Grounds',
      description: 'Large-scale synchronized fireworks with live music performance.',
      type: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-over-a-body-of-water-1120-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '10000', duration: '30min', shells: '500+' },
      tags: ['festival', 'large-scale', 'synchronized']
    },
    {
      id: 4,
      title: 'Private Birthday Bash',
      category: 'private',
      date: 'September 2023',
      location: 'Muthaiga Residence',
      description: 'Intimate garden fireworks display with personalized effects.',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '100', duration: '10min', effects: 'Custom' },
      tags: ['private', 'garden', 'personalized']
    },
    {
      id: 5,
      title: 'Lakeside Wedding Reflections',
      category: 'weddings',
      date: 'August 2023',
      location: 'Lake Naivasha',
      description: 'Waterfront fireworks with beautiful lake reflections.',
      type: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-display-over-a-lake-1122-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '300', duration: '8min', reflection: 'Waterfront' },
      tags: ['wedding', 'lakeside', 'reflection']
    },
    {
      id: 6,
      title: 'Corporate Gala Night',
      category: 'corporate',
      date: 'July 2023',
      location: 'Sankara Hotel',
      description: 'Indoor pyrotechnics for awards ceremony with stage effects.',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '500', duration: '5min', venue: 'Indoor' },
      tags: ['corporate', 'indoor', 'stage-fx']
    },
    {
      id: 7,
      title: 'New Year Celebration',
      category: 'festivals',
      date: 'January 2023',
      location: 'Nairobi CBD',
      description: 'City-wide fireworks display for New Year celebrations.',
      type: 'video',
      mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fireworks-display-1171-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '50000', duration: '20min', altitude: '200m' },
      tags: ['new-year', 'city-wide', 'celebration']
    },
    {
      id: 8,
      title: 'Anniversary Celebration',
      category: 'private',
      date: 'June 2023',
      location: 'Runda Residence',
      description: 'Golden anniversary fireworks with special effects.',
      type: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      stats: { guests: '150', duration: '7min', theme: 'Golden' },
      tags: ['anniversary', 'golden', 'special-effects']
    }
  ];

  const videoProjects = projects.filter(project => project.type === 'video');
  const imageProjects = projects.filter(project => project.type === 'image');

  const getFilteredProjects = () => {
    let filtered = projects;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    // Filter by content type
    if (activeTab === 'videos') {
      filtered = filtered.filter(project => project.type === 'video');
    } else if (activeTab === 'images') {
      filtered = filtered.filter(project => project.type === 'image');
    }
    
    return filtered;
  };

  const filteredProjects = getFilteredProjects();

  const handleVideoPlay = (projectId) => {
    const video = videoRefs.current[projectId];
    if (video) {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Portfolio | IGNUX - Our Work</title>
        <meta name="description" content="View our portfolio of spectacular fireworks displays and stage FX for weddings, corporate events, and festivals across Kenya." />
      </Helmet>

      {/* Hero */}
      <section className="portfolio-hero" style={{
        background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(255,107,0,0.2) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="hero-video"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            zIndex: '-1',
            objectFit: 'cover',
            opacity: '0.3'
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-fireworks-display-over-a-lake-1122-large.mp4" type="video/mp4" />
        </video>
        
        <div className="container" style={{ position: 'relative', zIndex: '1' }}>
          <h1 className="section-title">
            Our <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="section-subtitle" style={{
            maxWidth: '800px',
            margin: '0 auto',
            fontSize: 'var(--font-size-xl)',
            color: 'var(--color-text-secondary)',
            lineHeight: '1.6'
          }}>
            Experience the magic through our past projects. Each display tells a unique story.
          </p>
        </div>
      </section>

      {/* Content Type Tabs */}
      <section className="section" style={{ paddingTop: 'var(--spacing-8)', paddingBottom: '0' }}>
        <div className="container">
          <div className="content-tabs" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--spacing-2)',
            marginBottom: 'var(--spacing-8)'
          }}>
            {contentTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`content-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-2)',
                    padding: 'var(--spacing-3) var(--spacing-6)',
                    background: activeTab === tab.id ? 'var(--color-surface)' : 'transparent',
                    border: `1px solid ${activeTab === tab.id ? 'var(--color-accent-orange)' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-full)',
                    color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="section portfolio-filters" style={{ paddingTop: '0' }}>
        <div className="container">
          <div className="filters-container" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-4)',
            padding: 'var(--spacing-6)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--color-border-light)',
            marginBottom: 'var(--spacing-12)'
          }}>
            <Filter className="filter-icon" style={{ color: 'var(--color-accent-orange)' }} />
            <div className="category-filters" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-2)'
            }}>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    background: selectedCategory === category.id ? 'var(--spark-gradient)' : 'transparent',
                    border: `1px solid ${selectedCategory === category.id ? 'transparent' : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-full)',
                    color: selectedCategory === category.id ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                    fontWeight: 'var(--font-weight-medium)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Highlights Section */}
      {activeTab === 'all' || activeTab === 'videos' ? (
        <section className="section video-section" style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.02) 0%, rgba(255,107,0,0.02) 100%)'
        }}>
          <div className="container">
            <h2 className="section-title" style={{ marginBottom: 'var(--spacing-4)' }}>
              Video <span className="gradient-text">Highlights</span>
            </h2>
            <p className="text-center mb-12" style={{
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-lg)',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Watch our most spectacular fireworks displays in action
            </p>
            
            <div className="video-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: 'var(--spacing-8)',
              marginBottom: 'var(--spacing-16)'
            }}>
              {videoProjects.slice(0, 3).map((project) => (
                <motion.div
                  key={project.id}
                  className="video-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  style={{
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-2xl)',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border-light)',
                    transition: 'all var(--transition-base)'
                  }}
                >
                  <div className="video-container" style={{ position: 'relative' }}>
                    <video
                      ref={(el) => videoRefs.current[project.id] = el}
                      src={project.mediaUrl}
                      poster={project.thumbnail}
                      muted={isMuted}
                      loop
                      playsInline
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    <div className="video-controls" style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      padding: 'var(--spacing-4)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <button
                        onClick={() => handleVideoPlay(project.id)}
                        style={{
                          background: 'var(--color-accent-orange)',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          width: '44px',
                          height: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Play size={20} style={{ color: 'white', marginLeft: '2px' }} />
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        style={{
                          background: 'rgba(255,255,255,0.2)',
                          border: 'none',
                          borderRadius: 'var(--radius-full)',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        {isMuted ? (
                          <VolumeX size={16} style={{ color: 'white' }} />
                        ) : (
                          <Volume2 size={16} style={{ color: 'white' }} />
                        )}
                      </button>
                    </div>
                    <div style={{
                      position: 'absolute',
                      top: 'var(--spacing-3)',
                      right: 'var(--spacing-3)',
                      background: 'var(--color-accent-orange)',
                      color: 'var(--color-text-inverse)',
                      padding: 'var(--spacing-1) var(--spacing-2)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-semibold)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-1)'
                    }}>
                      <Video size={12} />
                      Video
                    </div>
                  </div>
                  <div className="video-content" style={{ padding: 'var(--spacing-6)' }}>
                    <h3 style={{ 
                      fontSize: 'var(--font-size-xl)', 
                      marginBottom: 'var(--spacing-3)' 
                    }}>
                      {project.title}
                    </h3>
                    <p style={{ 
                      color: 'var(--color-text-secondary)', 
                      marginBottom: 'var(--spacing-4)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      {project.description}
                    </p>
                    <div className="video-stats" style={{
                      display: 'flex',
                      gap: 'var(--spacing-4)',
                      marginTop: 'var(--spacing-4)',
                      paddingTop: 'var(--spacing-4)',
                      borderTop: '1px solid var(--color-border-light)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <Users size={16} style={{ color: 'var(--color-accent-orange)' }} />
                        <span style={{ fontSize: 'var(--font-size-xs)' }}>{project.stats.guests} guests</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                        <Calendar size={16} style={{ color: 'var(--color-accent-orange)' }} />
                        <span style={{ fontSize: 'var(--font-size-xs)' }}>{project.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Portfolio Grid */}
      <section className="section">
        <div className="container">
          <div className="portfolio-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 'var(--spacing-8)'
          }}>
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="portfolio-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedProject(project)}
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: 'var(--radius-2xl)',
                  overflow: 'hidden',
                  transition: 'all var(--transition-base)',
                  border: '1px solid var(--color-border-light)',
                  cursor: 'pointer'
                }}
              >
                <div className="portfolio-image" style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform var(--transition-slow)'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="portfolio-overlay" style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: '0',
                    transition: 'opacity var(--transition-base)'
                  }}>
                    <Play className="play-icon" style={{
                      color: 'white',
                      width: '48px',
                      height: '48px',
                      background: 'var(--color-accent-orange)',
                      borderRadius: 'var(--radius-full)',
                      padding: 'var(--spacing-3)',
                      transition: 'transform var(--transition-base)'
                    }} />
                  </div>
                  
                  {/* Media Type Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--spacing-3)',
                    right: 'var(--spacing-3)',
                    background: project.type === 'video' ? 'var(--color-accent-orange)' : 'var(--color-accent-blue)',
                    color: 'var(--color-text-inverse)',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-1)',
                    zIndex: '2'
                  }}>
                    {project.type === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                    {project.type === 'video' ? 'Video' : 'Photo'}
                  </div>
                  
                  {/* Category Badge */}
                  <div style={{
                    position: 'absolute',
                    top: 'var(--spacing-3)',
                    left: 'var(--spacing-3)',
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: 'var(--spacing-1) var(--spacing-2)',
                    borderRadius: 'var(--radius-full)',
                    fontSize: 'var(--font-size-xs)',
                    fontWeight: 'var(--font-weight-medium)',
                    backdropFilter: 'blur(4px)'
                  }}>
                    {project.category}
                  </div>
                </div>
                <div className="portfolio-content" style={{ padding: 'var(--spacing-6)' }}>
                  <h3 style={{ 
                    fontSize: 'var(--font-size-xl)', 
                    marginBottom: 'var(--spacing-3)',
                    color: 'var(--color-text-primary)'
                  }}>
                    {project.title}
                  </h3>
                  <p style={{ 
                    color: 'var(--color-text-secondary)', 
                    marginBottom: 'var(--spacing-4)',
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: '1.5'
                  }}>
                    {project.description}
                  </p>
                  <div className="portfolio-meta" style={{
                    display: 'flex',
                    gap: 'var(--spacing-4)',
                    marginTop: 'var(--spacing-4)',
                    paddingTop: 'var(--spacing-4)',
                    borderTop: '1px solid var(--color-border-light)'
                  }}>
                    <div className="meta-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      <Calendar size={16} style={{ color: 'var(--color-accent-orange)' }} />
                      <span>{project.date}</span>
                    </div>
                    <div className="meta-item" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-2)',
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      <MapPin size={16} style={{ color: 'var(--color-accent-orange)' }} />
                      <span>{project.location}</span>
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div className="portfolio-tags" style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--spacing-2)',
                    marginTop: 'var(--spacing-4)'
                  }}>
                    {project.tags?.map((tag, index) => (
                      <span key={index} style={{
                        background: 'var(--color-surface-alt)',
                        color: 'var(--color-text-secondary)',
                        padding: 'var(--spacing-1) var(--spacing-2)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-xs)'
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats-section" style={{
        background: 'linear-gradient(135deg, rgba(255,107,0,0.05) 0%, rgba(0,180,255,0.05) 100%)'
      }}>
        <div className="container">
          <div className="portfolio-stats" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--spacing-8)',
            padding: 'var(--spacing-12)',
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-3xl)',
            border: '1px solid var(--color-border-light)'
          }}>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <div className="stat-number" style={{
                display: 'block',
                fontSize: 'var(--font-size-5xl)',
                fontWeight: 'var(--font-weight-bold)',
                background: 'var(--spark-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--spacing-2)'
              }}>
                {projects.length}+
              </div>
              <div className="stat-label" style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Projects Completed
              </div>
            </div>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <div className="stat-number" style={{
                display: 'block',
                fontSize: 'var(--font-size-5xl)',
                fontWeight: 'var(--font-weight-bold)',
                background: 'var(--spark-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--spacing-2)'
              }}>
                100%
              </div>
              <div className="stat-label" style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Client Satisfaction
              </div>
            </div>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <div className="stat-number" style={{
                display: 'block',
                fontSize: 'var(--font-size-5xl)',
                fontWeight: 'var(--font-weight-bold)',
                background: 'var(--spark-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--spacing-2)'
              }}>
                {videoProjects.length}+
              </div>
              <div className="stat-label" style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Video Highlights
              </div>
            </div>
            <div className="stat-item" style={{ textAlign: 'center' }}>
              <div className="stat-number" style={{
                display: 'block',
                fontSize: 'var(--font-size-5xl)',
                fontWeight: 'var(--font-weight-bold)',
                background: 'var(--spark-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 'var(--spacing-2)'
              }}>
                24/7
              </div>
              <div className="stat-label" style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Support Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            Want Your Event Featured Here?
          </h2>
          <p className="cta-subtitle">
            Book our services and create unforgettable memories worth showcasing.
          </p>
          <div className="cta-buttons">
            <button 
              className="cta-button cta-button-primary cta-button-large"
              onClick={() => window.location.href = '/contact'}
            >
              Book Now
            </button>
            <a 
              href="tel:+254750077424"
              className="cta-button cta-button-outline cta-button-large"
            >
              Call: +254 750 077 424
            </a>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <motion.div 
          className="project-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedProject(null)}
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'var(--color-overlay)',
            backdropFilter: 'blur(5px)',
            zIndex: 'var(--z-modal)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-4)'
          }}
        >
          <motion.div 
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-3xl)',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-2xl)'
            }}
          >
            <button 
              className="close-modal"
              onClick={() => setSelectedProject(null)}
              style={{
                position: 'absolute',
                top: 'var(--spacing-4)',
                right: 'var(--spacing-4)',
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: 'var(--font-size-2xl)',
                lineHeight: '1',
                padding: 'var(--spacing-1)',
                borderRadius: 'var(--radius-full)',
                transition: 'all var(--transition-fast)',
                zIndex: '1'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-primary)';
                e.currentTarget.style.background = 'var(--color-surface-alt)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-secondary)';
                e.currentTarget.style.background = 'none';
              }}
            >
              <X size={24} />
            </button>
            
            <div className="modal-body" style={{ padding: 'var(--spacing-8)' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-3)',
                marginBottom: 'var(--spacing-6)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: selectedProject.type === 'video' ? 'var(--color-accent-orange)' : 'var(--color-accent-blue)',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {selectedProject.type === 'video' ? <Video size={24} /> : <ImageIcon size={24} />}
                </div>
                <div>
                  <h2 style={{ 
                    fontSize: 'var(--font-size-3xl)', 
                    marginBottom: 'var(--spacing-2)' 
                  }}>
                    {selectedProject.title}
                  </h2>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-4)'
                  }}>
                    <span style={{
                      background: 'var(--color-surface-alt)',
                      color: 'var(--color-text-secondary)',
                      padding: 'var(--spacing-1) var(--spacing-3)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: 'var(--font-size-xs)',
                      textTransform: 'capitalize'
                    }}>
                      {selectedProject.category}
                    </span>
                    <span style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-sm)'
                    }}>
                      {selectedProject.date}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="modal-media" style={{
                width: '100%',
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                marginBottom: 'var(--spacing-6)'
              }}>
                {selectedProject.type === 'video' ? (
                  <video 
                    controls 
                    autoPlay 
                    style={{
                      width: '100%',
                      borderRadius: 'var(--radius-xl)',
                      display: 'block'
                    }}
                  >
                    <source src={selectedProject.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img 
                    src={selectedProject.mediaUrl} 
                    alt={selectedProject.title}
                    style={{
                      width: '100%',
                      borderRadius: 'var(--radius-xl)',
                      display: 'block'
                    }}
                  />
                )}
              </div>
              
              <div className="modal-details">
                <p style={{ 
                  marginBottom: 'var(--spacing-4)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6'
                }}>
                  <strong style={{ color: 'var(--color-text-primary)' }}>Description:</strong> {selectedProject.description}
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: 'var(--spacing-4)',
                  marginBottom: 'var(--spacing-6)',
                  padding: 'var(--spacing-4)',
                  background: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-xl)'
                }}>
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Location:</strong>
                    <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
                      <MapPin size={14} style={{ display: 'inline-block', marginRight: 'var(--spacing-1)' }} />
                      {selectedProject.location}
                    </div>
                  </div>
                  {selectedProject.stats && (
                    <>
                      <div>
                        <strong style={{ color: 'var(--color-text-primary)' }}>Guests:</strong>
                        <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
                          <Users size={14} style={{ display: 'inline-block', marginRight: 'var(--spacing-1)' }} />
                          {selectedProject.stats.guests}
                        </div>
                      </div>
                      <div>
                        <strong style={{ color: 'var(--color-text-primary)' }}>Duration:</strong>
                        <div style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-1)' }}>
                          {selectedProject.stats.duration}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                {selectedProject.tags && (
                  <div>
                    <strong style={{ color: 'var(--color-text-primary)' }}>Tags:</strong>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 'var(--spacing-2)',
                      marginTop: 'var(--spacing-2)'
                    }}>
                      {selectedProject.tags.map((tag, index) => (
                        <span key={index} style={{
                          background: 'var(--color-surface)',
                          color: 'var(--color-text-secondary)',
                          padding: 'var(--spacing-1) var(--spacing-3)',
                          borderRadius: 'var(--radius-full)',
                          fontSize: 'var(--font-size-xs)',
                          border: '1px solid var(--color-border)'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div style={{
                marginTop: 'var(--spacing-8)',
                paddingTop: 'var(--spacing-6)',
                borderTop: '1px solid var(--color-border-light)',
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    window.location.href = `/contact?project=${selectedProject.id}`;
                    setSelectedProject(null);
                  }}
                  className="cta-button cta-button-primary cta-button-medium"
                >
                  Book Similar Event
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default PortfolioPage;
