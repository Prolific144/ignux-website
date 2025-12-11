// src/components/Home/HomePage.jsx
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  Palette, 
  Clock,
  Star,
  Users,
  Award,
  Zap,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import Hero from '../components/Home/Hero';
import ServicesPreview from '../components/Home/ServicesPreview';
import PortfolioPreview from '../components/Home/PortfolioPreview';
import CTAButton from '../components/Shared/CTAButton';
import { siteConfig } from '../../config/site.config';

const HomePage = () => {
  const features = [
    {
      icon: Shield,
      title: '100% Safety Record',
      description: 'Licensed pyrotechnicians with comprehensive safety protocols and full insurance coverage.',
      color: 'green'
    },
    {
      icon: Sparkles,
      title: 'Professional Displays',
      description: 'Expert execution with premium quality fireworks and precision timing.',
      color: 'gold'
    },
    {
      icon: Palette,
      title: 'Custom Designs',
      description: 'Tailored displays to perfectly match your event theme and vision.',
      color: 'blue'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'Flawless execution with precise timing and reliable scheduling.',
      color: 'orange'
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Only using certified, high-quality fireworks from trusted manufacturers.',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description: 'Skilled professionals with years of experience in pyrotechnics.',
      color: 'red'
    }
  ];

  const testimonials = [
    {
      name: 'Michael & Sarah',
      event: 'Wedding Reception',
      quote: 'The fireworks display was the highlight of our wedding! Our guests are still talking about it.',
      rating: 5
    },
    {
      name: 'TechCorp Africa',
      event: 'Product Launch',
      quote: 'IGNUX transformed our product launch into an unforgettable spectacle. Professional and precise!',
      rating: 5
    },
    {
      name: 'Nairobi Arts Festival',
      event: 'Annual Festival',
      quote: 'Our most spectacular fireworks display yet. The team handled everything flawlessly.',
      rating: 5
    }
  ];

  return (
    <>
      <Helmet>
        <title>Home | {siteConfig.company.name} - Professional Fireworks & Stage FX</title>
        <meta name="description" content={siteConfig.company.tagline} />
      </Helmet>

      <Hero />
      
      {/* Features Section */}
      <section className="section features-section bg-surface-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-primary">
              Why Choose <span className="gradient-text">{siteConfig.company.name}</span>
            </h2>
            <p className="section-subtitle text-secondary text-center max-w-2xl mx-auto mb-12">
              We combine artistry, technology, and safety to create breathtaking displays that leave lasting impressions
            </p>
            
            <div className="features-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card bg-surface border border-border-light rounded-xl p-6 transition-all duration-300 hover:border-accent-orange hover:shadow-lg group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`feature-icon-wrapper w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === 'green' ? 'bg-green-500/10' :
                    feature.color === 'gold' ? 'bg-yellow-500/10' :
                    feature.color === 'blue' ? 'bg-blue-500/10' :
                    feature.color === 'orange' ? 'bg-orange-500/10' :
                    feature.color === 'purple' ? 'bg-purple-500/10' :
                    'bg-red-500/10'
                  }`}>
                    <feature.icon className={`w-7 h-7 ${
                      feature.color === 'green' ? 'text-green-500' :
                      feature.color === 'gold' ? 'text-yellow-500' :
                      feature.color === 'blue' ? 'text-blue-500' :
                      feature.color === 'orange' ? 'text-orange-500' :
                      feature.color === 'purple' ? 'text-purple-500' :
                      'text-red-500'
                    } group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                  <p className="text-secondary">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <ServicesPreview />
      <PortfolioPreview />

      {/* Testimonials Section */}
      <section className="section testimonials-section bg-surface">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-primary">
              What Our <span className="gradient-text">Clients Say</span>
            </h2>
            <p className="section-subtitle text-secondary text-center max-w-2xl mx-auto mb-12">
              Don't just take our word for it - hear from those who've experienced the {siteConfig.company.name} magic
            </p>
            
            <div className="testimonials-grid grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="testimonial-card bg-surface border border-border-light rounded-xl p-6 relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="absolute top-4 right-4">
                    <div className="rating flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent-gold text-accent-gold" />
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-6xl text-accent-orange/20 mb-4">"</div>
                  
                  <blockquote className="text-lg text-secondary italic mb-6">
                    {testimonial.quote}
                  </blockquote>
                  
                  <div className="testimonial-author">
                    <div className="w-10 h-10 rounded-full bg-spark-gradient flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-primary">{testimonial.name}</div>
                      <div className="text-sm text-accent-orange">{testimonial.event}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section process-section bg-surface-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-primary">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="section-subtitle text-secondary text-center max-w-2xl mx-auto mb-12">
              From consultation to spectacular show - here's how we bring your vision to life
            </p>
            
            <div className="process-steps grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Consultation',
                  description: 'We discuss your vision, venue, and requirements',
                  icon: 'users'
                },
                {
                  step: '2',
                  title: 'Design',
                  description: 'Custom display design with timeline and budget',
                  icon: 'palette'
                },
                {
                  step: '3',
                  title: 'Preparation',
                  description: 'Venue inspection, permits, and safety planning',
                  icon: 'shield'
                },
                {
                  step: '4',
                  title: 'Execution',
                  description: 'Flawless setup and spectacular display',
                  icon: 'sparkles'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="process-step text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="step-number w-16 h-16 rounded-full bg-spark-gradient flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{step.title}</h3>
                  <p className="text-secondary">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section final-cta-section bg-surface">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="final-cta-card bg-surface border border-border rounded-2xl p-12 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-spark-gradient"></div>
              <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-accent-gold/10" />
              
              <h2 className="cta-title text-4xl font-bold mb-4 text-primary">
                Ready to <span className="gradient-text">Ignite Your Event?</span>
              </h2>
              <p className="cta-subtitle text-xl text-secondary max-w-2xl mx-auto mb-8">
                Contact us today for a free consultation and personalized quote. 
                Let's create something spectacular together!
              </p>
              
              <div className="cta-features grid sm:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
                <div className="cta-feature flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent-orange" />
                  <span>Free Consultation</span>
                </div>
                <div className="cta-feature flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent-orange" />
                  <span>24-Hour Response</span>
                </div>
                <div className="cta-feature flex items-center justify-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-accent-orange" />
                  <span>No Obligation Quote</span>
                </div>
              </div>
              
              <div className="cta-buttons flex flex-col sm:flex-row gap-4 justify-center items-center">
                <CTAButton 
                  text="Get Free Quote" 
                  variant="primary" 
                  size="large"
                  href="/contact"
                  icon="message"
                />
                <CTAButton 
                  text={`Call Now: ${siteConfig.company.contact.phoneDisplay}`}
                  variant="outline"
                  size="large"
                  href={`tel:${siteConfig.company.contact.phone}`}
                  icon="phone"
                />
              </div>
              
              <div className="trust-badges flex flex-wrap gap-6 justify-center mt-8 pt-8 border-t border-border-light">
                <div className="badge flex items-center gap-2 text-sm text-secondary">
                  <Shield className="w-4 h-4 text-accent-orange" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="badge flex items-center gap-2 text-sm text-secondary">
                  <Award className="w-4 h-4 text-accent-orange" />
                  <span>Certified Professionals</span>
                </div>
                <div className="badge flex items-center gap-2 text-sm text-secondary">
                  <TrendingUp className="w-4 h-4 text-accent-orange" />
                  <span>200+ Successful Events</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomePage;