import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialsPreview = () => {
  const testimonials = [
    {
      name: 'Sarah & David',
      event: 'Wedding',
      text: 'Our wedding finale was absolutely magical! IGNUX made our special day unforgettable.',
      rating: 5
    },
    {
      name: 'TechCorp Kenya',
      event: 'Product Launch',
      text: 'The brand-colored fireworks were a hit! Professional from start to finish.',
      rating: 5
    },
    {
      name: 'Festival Organizers',
      event: 'Music Festival',
      text: '30,000 people cheered! The synchronized show was spectacular.',
      rating: 5
    }
  ];

  return (
    <section className="section testimonials-preview">
      <div className="container">
        <h2 className="section-title">
          Client <span className="gradient-text">Testimonials</span>
        </h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Quote className="quote-icon" />
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="star-icon" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <strong>{testimonial.name}</strong>
                <span>{testimonial.event}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsPreview;