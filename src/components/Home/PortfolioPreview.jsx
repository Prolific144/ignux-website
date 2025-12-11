import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import CTAButton from '../Shared/CTAButton';

const PortfolioPreview = () => {
  const projects = [
    {
      title: 'Karen Wedding',
      category: 'Wedding',
      image: '/images/portfolio/wedding-preview.jpg'
    },
    {
      title: 'Tech Conference',
      category: 'Corporate',
      image: '/images/portfolio/corporate-preview.jpg'
    },
    {
      title: 'Music Festival',
      category: 'Festival',
      image: '/images/portfolio/festival-preview.jpg'
    }
  ];

  return (
    <section className="section portfolio-preview">
      <div className="container">
        <h2 className="section-title">
          Recent <span className="gradient-text">Projects</span>
        </h2>
        <div className="portfolio-preview-grid">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              className="portfolio-preview-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="portfolio-preview-image">
                <div className="image-placeholder">
                  <span className="placeholder-text">{project.category}</span>
                </div>
                <div className="portfolio-overlay">
                  <Play className="play-icon" />
                </div>
              </div>
              <div className="portfolio-preview-content">
                <span className="portfolio-category">{project.category}</span>
                <h3>{project.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <CTAButton 
            text="View Full Portfolio" 
            variant="outline" 
            size="large"
            href="/portfolio"
            icon="arrow"
          />
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;