import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  Users, 
  Target,
  Award,
  Clock,
  Star,
  Zap,
  Heart,
  Globe,
  TrendingUp,
  CheckCircle,
  MapPin
} from 'lucide-react';
import CTAButton from '../components/Shared/CTAButton';

const AboutPage = () => {
  const milestones = [
    { year: '2018', title: 'Founded', description: 'Started with small wedding displays' },
    { year: '2019', title: 'Team Expansion', description: 'Hired first licensed pyrotechnicians' },
    { year: '2020', title: 'Major Festival', description: 'First large-scale festival display' },
    { year: '2022', title: 'Safety Certified', description: 'Achieved ISO safety standards' },
    { year: '2023', title: 'Regional Reach', description: 'Expanded services across East Africa' },
    { year: '2024', title: 'Innovation Lab', description: 'Launched R&D for new effects' }
  ];

  return (
    <>
      <Helmet>
        <title>About Us | IGNUX - Igniting Experiences</title>
        <meta name="description" content="Learn about IGNUX - Kenya's premier fireworks and stage FX company. Our mission, values, and commitment to safety and excellence." />
      </Helmet>

      {/* Hero Section */}
      <section className="about-hero bg-surface">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="about-hero-content text-center py-20"
          >
            <h1 className="about-title text-5xl md:text-6xl font-bold mb-6 text-primary">
              Igniting <span className="gradient-text">Extraordinary</span> Moments
            </h1>
            <p className="about-subtitle text-xl text-secondary max-w-3xl mx-auto mb-8 leading-relaxed">
              We transform events into unforgettable experiences through spectacular 
              fireworks displays and innovative stage FX. With passion, precision, and professionalism.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <CTAButton 
                text="Our Story" 
                variant="primary" 
                size="large"
                href="#story"
                icon="sparkles"
              />
              <CTAButton 
                text="Meet the Team" 
                variant="outline"
                size="large"
                href="#team"
                icon="users"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="section stats-section bg-surface-alt">
        <div className="container">
          <div className="stats-grid grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: '200+', label: 'Events Completed', icon: Sparkles },
              { number: '100%', label: 'Safety Record', icon: Shield },
              { number: '50+', label: 'Happy Clients', icon: Heart },
              { number: '24/7', label: 'Support', icon: Clock }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card bg-surface border border-border-light rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <stat.icon className="w-8 h-8 text-accent-orange mx-auto mb-3" />
                <div className="stat-number text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="stat-label text-sm text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="story" className="section story-section">
        <div className="container">
          <div className="mission-vision-grid grid md:grid-cols-2 gap-8">
            <motion.div 
              className="mission-card bg-surface border border-border-light rounded-2xl p-8 relative overflow-hidden"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-spark-gradient"></div>
              <Target className="mission-icon w-12 h-12 text-accent-orange mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-secondary leading-relaxed">
                To create breathtaking pyrotechnic experiences that elevate events, 
                celebrate milestones, and leave lasting memories through innovation, 
                safety, and artistic excellence. We strive to set the standard for 
                quality and creativity in every display.
              </p>
            </motion.div>

            <motion.div 
              className="vision-card bg-surface border border-border-light rounded-2xl p-8 relative overflow-hidden"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-spark-gradient"></div>
              <Sparkles className="vision-icon w-12 h-12 text-accent-gold mb-6" />
              <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-secondary leading-relaxed">
                To become East Africa's leading provider of premium pyrotechnic 
                and stage FX services, setting new standards for creativity, 
                safety, and event spectacle. We envision a future where every 
                celebration is elevated by our innovative displays.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section values-section bg-surface-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-primary">
              Our Core <span className="gradient-text">Values</span>
            </h2>
            <p className="section-subtitle text-secondary text-center max-w-2xl mx-auto mb-12">
              These principles guide every decision we make and every display we create
            </p>
            
            <div className="values-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Shield,
                  title: 'Safety First',
                  description: 'Rigorous safety protocols and licensed pyrotechnicians ensure every show is secure.',
                  color: 'red'
                },
                {
                  icon: Star,
                  title: 'Excellence',
                  description: 'Commitment to delivering exceptional quality in every display and interaction.',
                  color: 'gold'
                },
                {
                  icon: Users,
                  title: 'Collaboration',
                  description: 'Working closely with clients to bring their vision to life.',
                  color: 'blue'
                },
                {
                  icon: Zap,
                  title: 'Innovation',
                  description: 'Pioneering new techniques and technologies in pyrotechnics.',
                  color: 'orange'
                },
                {
                  icon: CheckCircle,
                  title: 'Reliability',
                  description: 'On-time delivery and flawless execution for every event.',
                  color: 'green'
                },
                {
                  icon: Heart,
                  title: 'Passion',
                  description: 'Artistic designs that tell stories and create emotional impact.',
                  color: 'pink'
                }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  className="value-card bg-surface border border-border-light rounded-xl p-6 transition-all duration-300 hover:border-accent-orange hover:shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className={`value-icon-wrapper w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    value.color === 'red' ? 'bg-red-500/10' :
                    value.color === 'gold' ? 'bg-yellow-500/10' :
                    value.color === 'blue' ? 'bg-blue-500/10' :
                    value.color === 'orange' ? 'bg-orange-500/10' :
                    value.color === 'green' ? 'bg-green-500/10' :
                    'bg-pink-500/10'
                  }`}>
                    <value.icon className={`w-6 h-6 ${
                      value.color === 'red' ? 'text-red-500' :
                      value.color === 'gold' ? 'text-yellow-500' :
                      value.color === 'blue' ? 'text-blue-500' :
                      value.color === 'orange' ? 'text-orange-500' :
                      value.color === 'green' ? 'text-green-500' :
                      'text-pink-500'
                    }`} />
                  </div>
                  <h4 className="text-xl font-semibold text-primary mb-3">{value.title}</h4>
                  <p className="text-secondary">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="section timeline-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-primary">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="section-subtitle text-secondary text-center max-w-2xl mx-auto mb-12">
              From humble beginnings to becoming a leader in pyrotechnic displays
            </p>
            
            <div className="timeline relative">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} mb-12`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="timeline-content bg-surface border border-border-light rounded-xl p-6 max-w-md">
                    <div className="year-badge bg-spark-gradient text-text-inverse px-4 py-1 rounded-full text-sm font-semibold inline-block mb-3">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-2">{milestone.title}</h3>
                    <p className="text-secondary">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section team-section bg-surface-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-primary">
              Meet Our <span className="gradient-text">Experts</span>
            </h2>
            <p className="section-subtitle text-secondary text-center max-w-2xl mx-auto mb-12">
              Our team of licensed pyrotechnicians and event specialists bring years 
              of experience and passion to every project.
            </p>
            
            <div className="team-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: 'Alex Maina',
                  role: 'Lead Pyrotechnician',
                  experience: '12+ years',
                  specialty: 'Large-scale displays',
                  quote: 'Every firework tells a story.',
                  certifications: ['Licensed Pyro', 'ISO Certified', 'Safety First']
                },
                {
                  name: 'Dorcas Wanjiru',
                  role: 'Creative Director',
                  experience: '8+ years',
                  specialty: 'Artistic design',
                  quote: 'Creativity meets precision.',
                  certifications: ['Design Expert', 'Event Planner', 'Color Theory']
                },
                {
                  name: 'James Omondi',
                  role: 'Safety Officer',
                  experience: '15+ years',
                  specialty: 'Risk management',
                  quote: 'Safety is our top priority.',
                  certifications: ['Safety Certified', 'Risk Assessment', 'Emergency Response']
                },
                {
                  name: 'Sarah Atieno',
                  role: 'Client Relations',
                  experience: '6+ years',
                  specialty: 'Event planning',
                  quote: 'Your vision, our mission.',
                  certifications: ['Client Management', 'Event Coordination', 'Budget Planning']
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="team-card bg-surface border border-border-light rounded-xl p-6 text-center group hover:border-accent-orange transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="team-avatar mb-4">
                    <div className="avatar-placeholder w-20 h-20 rounded-full bg-spark-gradient flex items-center justify-center text-2xl font-bold text-text-inverse mx-auto">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                  <p className="team-role text-accent-orange font-semibold mb-3">{member.role}</p>
                  
                  <blockquote className="text-secondary italic mb-4 text-sm">
                    "{member.quote}"
                  </blockquote>
                  
                  <div className="team-details space-y-2 text-sm">
                    <p className="flex items-center justify-center gap-2">
                      <Clock size={14} className="text-secondary" />
                      <strong className="text-primary">Experience:</strong> {member.experience}
                    </p>
                    <p className="flex items-center justify-center gap-2">
                      <Sparkles size={14} className="text-secondary" />
                      <strong className="text-primary">Specialty:</strong> {member.specialty}
                    </p>
                  </div>
                  
                  <div className="certifications flex flex-wrap gap-2 justify-center mt-4 pt-4 border-t border-border-light">
                    {member.certifications.map((cert, idx) => (
                      <span key={idx} className="px-2 py-1 bg-surface-alt text-xs text-secondary rounded">
                        {cert}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section bg-surface">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="cta-title text-4xl font-bold mb-6 text-primary">
              Ready to Create Something Spectacular?
            </h2>
            <p className="cta-subtitle text-xl text-secondary max-w-2xl mx-auto mb-8">
              Partner with IGNUX for your next event. Let's discuss how we can make it unforgettable.
            </p>
            <div className="cta-buttons flex gap-4 justify-center flex-wrap">
              <CTAButton 
                text="Contact Us Today" 
                variant="primary" 
                size="large"
                href="/contact"
                icon="message"
              />
              <CTAButton 
                text="View Our Work" 
                variant="outline"
                size="large"
                href="/portfolio"
                icon="eye"
              />
              <CTAButton 
                text="Get Quote" 
                variant="secondary"
                size="large"
                href="/pricing"
                icon="quote"
              />
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;