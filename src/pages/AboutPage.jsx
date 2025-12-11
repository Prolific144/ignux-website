import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Sparkles, 
  Users, 
  Target,
  Award,
  Clock,
  Star
} from 'lucide-react';
import CTAButton from '../components/Shared/CTAButton';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About Us | IGNUX - Igniting Experiences</title>
        <meta name="description" content="Learn about IGNUX - Kenya's premier fireworks and stage FX company. Our mission, values, and commitment to safety and excellence." />
      </Helmet>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="about-hero-content"
          >
            <h1 className="about-title">
              Igniting <span className="gradient-text">Extraordinary</span> Moments
            </h1>
            <p className="about-subtitle">
              We transform events into unforgettable experiences through spectacular 
              fireworks displays and innovative stage FX.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section">
        <div className="container">
          <div className="mission-vision-grid">
            <motion.div 
              className="mission-card"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Target className="mission-icon" />
              <h3>Our Mission</h3>
              <p>
                To create breathtaking pyrotechnic experiences that elevate events, 
                celebrate milestones, and leave lasting memories through innovation, 
                safety, and artistic excellence.
              </p>
            </motion.div>

            <motion.div 
              className="vision-card"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Sparkles className="vision-icon" />
              <h3>Our Vision</h3>
              <p>
                To become East Africa's leading provider of premium pyrotechnic 
                and stage FX services, setting new standards for creativity, 
                safety, and event spectacle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section values-section">
        <div className="container">
          <h2 className="section-title">
            Our Core <span className="gradient-text">Values</span>
          </h2>
          <div className="values-grid">
            {[
              {
                icon: Shield,
                title: 'Safety First',
                description: 'Rigorous safety protocols and licensed pyrotechnicians ensure every show is secure.'
              },
              {
                icon: Star,
                title: 'Excellence',
                description: 'Commitment to delivering exceptional quality in every display and interaction.'
              },
              {
                icon: Users,
                title: 'Collaboration',
                description: 'Working closely with clients to bring their vision to life.'
              },
              {
                icon: Award,
                title: 'Innovation',
                description: 'Pioneering new techniques and technologies in pyrotechnics.'
              },
              {
                icon: Clock,
                title: 'Reliability',
                description: 'On-time delivery and flawless execution for every event.'
              },
              {
                icon: Sparkles,
                title: 'Creativity',
                description: 'Artistic designs that tell stories and create emotional impact.'
              }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className="value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="value-icon-wrapper">
                  <value.icon className="value-icon" />
                </div>
                <h4>{value.title}</h4>
                <p>{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section team-section">
        <div className="container">
          <h2 className="section-title">
            Meet Our <span className="gradient-text">Experts</span>
          </h2>
          <p className="section-subtitle">
            Our team of licensed pyrotechnicians and event specialists bring years 
            of experience and passion to every project.
          </p>
          <div className="team-grid">
            {[
              {
                name: 'Alex Maina',
                role: 'Lead Pyrotechnician',
                experience: '12+ years',
                specialty: 'Large-scale displays'
              },
              {
                name: 'Dorcas Wanjiru',
                role: 'Creative Director',
                experience: '8+ years',
                specialty: 'Artistic design'
              },
              {
                name: 'James Omondi',
                role: 'Safety Officer',
                experience: '15+ years',
                specialty: 'Risk management'
              },
              {
                name: 'Sarah Atieno',
                role: 'Client Relations',
                experience: '6+ years',
                specialty: 'Event planning'
              }
            ].map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-avatar">
                  <div className="avatar-placeholder">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
                <h3>{member.name}</h3>
                <p className="team-role">{member.role}</p>
                <div className="team-details">
                  <p><strong>Experience:</strong> {member.experience}</p>
                  <p><strong>Specialty:</strong> {member.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">
            Ready to Create Something Spectacular?
          </h2>
          <p className="cta-subtitle">
            Partner with IGNUX for your next event. Let's discuss how we can make it unforgettable.
          </p>
          <div className="cta-buttons">
            <CTAButton 
              text="Contact Us Today" 
              variant="primary" 
              size="large"
              href="/contact"
            />
            <CTAButton 
              text="View Our Work" 
              variant="outline"
              size="large"
              href="/portfolio"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;