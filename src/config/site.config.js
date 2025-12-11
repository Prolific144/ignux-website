// src/config/site.config.js
export const siteConfig = {
  company: {
    name: 'IGNUX',
    tagline: 'Igniting Experiences',
    
    contact: {
      phone: '+254750077424',
      phoneDisplay: '+254 750 077 424',
      email: 'info@ignux.com',
      address: 'Nairobi, Kenya',
      whatsapp: '+254750077424',
      businessHours: {
        weekdays: '8:00 AM - 6:00 PM',
        saturday: '9:00 AM - 4:00 PM',
        emergency: '24/7'
      }
    },
    
    social: {
      instagram: 'https://instagram.com/ignux',
      youtube: 'https://youtube.com/ignux',
      facebook: 'https://facebook.com/ignux',
      tiktok: 'https://tiktok.com/@ignux'
    }
  },

  services: {
    categories: ['weddings', 'corporate', 'festivals', 'private'],
    
    list: [
      {
        category: 'weddings',
        title: 'Wedding Pyrotechnics',
        description: 'Create magical moments with breathtaking fireworks displays for your special day.',
        features: ['Grand finale displays', 'Sparkler send-offs', 'Indoor pyrotechnics', 'Custom colors'],
        startingPrice: '150,000'
      },
      {
        category: 'corporate',
        title: 'Corporate Events',
        description: 'Make your product launches, galas, and celebrations unforgettable.',
        features: ['Brand-colored displays', 'Synchronized shows', 'Stage pyro effects', 'LED wall integration'],
        startingPrice: '250,000'
      },
      {
        category: 'festivals',
        title: 'Festivals & Concerts',
        description: 'Large-scale pyrotechnic shows that wow crowds and create viral moments.',
        features: ['High-altitude shells', 'Synchronized to music', 'Multi-point firing', 'Professional planning'],
        startingPrice: '500,000'
      }
    ]
  },

  content: {
    imagePaths: {
      portfolio: '/images/portfolio/',
      blog: '/images/blog/',
      gallery: '/images/gallery/',
      default: '/images/default/'
    },
    
    videoPaths: {
      portfolio: '/videos/portfolio/',
      highlights: '/videos/highlights/'
    }
  }
};