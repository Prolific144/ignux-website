import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag,
  Search,
  ArrowRight,
  Sparkles,
  Mail,
  TrendingUp
} from 'lucide-react';
import CTAButton from '../components/Shared/CTAButton';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Articles', icon: Sparkles },
    { id: 'safety', label: 'Safety Tips', icon: 'shield' },
    { id: 'trends', label: 'Event Trends', icon: TrendingUp },
    { id: 'planning', label: 'Event Planning', icon: 'calendar' },
    { id: 'behind-scenes', label: 'Behind the Scenes', icon: 'users' }
  ];

  const articles = [
    {
      id: 1,
      title: 'Fireworks Safety: A Complete Guide for Event Planners',
      excerpt: 'Essential safety protocols every event organizer should know when planning fireworks displays.',
      category: 'safety',
      date: 'Jan 15, 2024',
      author: 'James Omondi',
      readTime: '5 min read',
      image: '/images/blog/safety-guide.jpg',
      tags: ['Safety', 'Planning', 'Professional']
    },
    {
      id: 2,
      title: 'Top Wedding Trends for 2024: Incorporating Pyrotechnics',
      excerpt: 'How modern couples are using fireworks to create unforgettable wedding moments.',
      category: 'trends',
      date: 'Jan 10, 2024',
      author: 'Dorcas Wanjiru',
      readTime: '4 min read',
      image: '/images/blog/wedding-trends.jpg',
      tags: ['Wedding', 'Trends', 'Romantic']
    },
    {
      id: 3,
      title: 'Behind the Scenes: Planning a Major Festival Display',
      excerpt: 'A look at what goes into planning and executing large-scale festival fireworks.',
      category: 'behind-scenes',
      date: 'Dec 28, 2023',
      author: 'Alex Maina',
      readTime: '7 min read',
      image: '/images/blog/festival-planning.jpg',
      tags: ['Festival', 'Behind Scenes', 'Production']
    },
    {
      id: 4,
      title: 'Budgeting for Your Event: Pyrotechnics Cost Breakdown',
      excerpt: 'Understanding the costs involved in fireworks displays and how to plan your budget.',
      category: 'planning',
      date: 'Dec 20, 2023',
      author: 'Sarah Atieno',
      readTime: '6 min read',
      image: '/images/blog/budget-guide.jpg',
      tags: ['Budget', 'Planning', 'Cost']
    },
    {
      id: 5,
      title: 'Indoor Pyrotechnics: Safe Effects for Venue Celebrations',
      excerpt: 'How to safely incorporate pyrotechnics in indoor venues for corporate events and parties.',
      category: 'safety',
      date: 'Dec 15, 2023',
      author: 'James Omondi',
      readTime: '5 min read',
      image: '/images/blog/indoor-pyro.jpg',
      tags: ['Indoor', 'Safety', 'Corporate']
    },
    {
      id: 6,
      title: 'Music Synchronization: Timing Fireworks to Your Soundtrack',
      excerpt: 'The art and technology behind perfectly timed fireworks displays.',
      category: 'behind-scenes',
      date: 'Dec 10, 2023',
      author: 'Alex Maina',
      readTime: '4 min read',
      image: '/images/blog/music-sync.jpg',
      tags: ['Music', 'Technology', 'Synchronization']
    }
  ];

  const featuredArticle = articles[0];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>Blog | IGNUX - Insights & Tips</title>
        <meta name="description" content="Expert insights on fireworks safety, event trends, and behind-the-scenes looks at pyrotechnic displays." />
      </Helmet>

      {/* Hero */}
      <section className="blog-hero bg-surface">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="section-title text-primary">
              IGNUX <span className="gradient-text">Insights</span>
            </h1>
            <p className="section-subtitle text-secondary max-w-3xl mx-auto mb-8">
              Expert tips, trends, and behind-the-scenes looks at the world of pyrotechnics.
            </p>
            <div className="stats-bar flex justify-center gap-8">
              <div className="stat-item">
                <div className="stat-number text-3xl font-bold text-accent">50+</div>
                <div className="stat-label text-sm text-secondary">Articles Published</div>
              </div>
              <div className="stat-divider w-px h-12 bg-border" />
              <div className="stat-item">
                <div className="stat-number text-3xl font-bold text-accent">10K+</div>
                <div className="stat-label text-sm text-secondary">Monthly Readers</div>
              </div>
              <div className="stat-divider w-px h-12 bg-border" />
              <div className="stat-item">
                <div className="stat-number text-3xl font-bold text-accent">4</div>
                <div className="stat-label text-sm text-secondary">Expert Writers</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section blog-filters bg-surface-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="search-container relative max-w-2xl mx-auto mb-8">
              <Search className="search-icon absolute left-4 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
              <input
                type="text"
                placeholder="Search articles by title, content, or tags..."
                className="search-input w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-primary placeholder-text-tertiary transition-all duration-200 focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="loading-spinner w-5 h-5 border-2 border-border border-t-accent-orange rounded-full animate-spin" />
                </div>
              )}
            </div>

            <div className="category-filters flex flex-wrap justify-center gap-2">
              {categories.map(category => {
                const Icon = category.icon === 'shield' ? 'shield' : 
                            category.icon === 'calendar' ? 'calendar' : 
                            category.icon === 'users' ? 'users' : 
                            category.icon;
                return (
                  <button
                    key={category.id}
                    className={`category-filter px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                      selectedCategory === category.id 
                        ? 'bg-accent-orange text-text-inverse border-accent-orange shadow-lg' 
                        : 'bg-surface border-border text-secondary hover:bg-surface-alt hover:text-primary'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {typeof Icon === 'function' && <Icon size={16} />}
                    {category.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="section featured-article">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="featured-card bg-surface border border-border rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="featured-image relative h-full min-h-[400px]">
                  <img 
                    src={featuredArticle.image} 
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                  <div className="featured-badge absolute top-4 left-4 bg-spark-gradient text-text-inverse px-4 py-2 rounded-full text-sm font-semibold">
                    Featured Article
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="flex flex-wrap gap-3">
                      {featuredArticle.tags.map((tag, idx) => (
                        <span key={idx} className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="featured-content p-8 flex flex-col justify-center">
                  <div className="article-meta flex flex-wrap gap-4 mb-4 text-sm text-secondary">
                    <span className="meta-item flex items-center gap-2">
                      <Tag size={14} />
                      <span className="capitalize">{featuredArticle.category.replace('-', ' ')}</span>
                    </span>
                    <span className="meta-item flex items-center gap-2">
                      <Calendar size={14} />
                      {featuredArticle.date}
                    </span>
                    <span className="meta-item flex items-center gap-2">
                      <User size={14} />
                      {featuredArticle.author}
                    </span>
                    <span className="meta-item flex items-center gap-2">
                      <Clock size={14} />
                      {featuredArticle.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-primary mb-4 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-lg text-secondary mb-6 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  
                  <CTAButton
                    text="Read Full Article"
                    variant="primary"
                    size="large"
                    href={`/blog/${featuredArticle.id}`}
                    icon="arrow"
                    className="self-start"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section articles-section bg-surface-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title text-primary">
              Latest <span className="gradient-text">Articles</span>
            </h2>
            <p className="section-subtitle text-secondary text-center max-w-2xl mx-auto mb-12">
              Explore our collection of expert insights and practical guides
            </p>
            
            {filteredArticles.length === 0 ? (
              <div className="no-results text-center py-12">
                <Search size={48} className="mx-auto mb-4 text-text-tertiary" />
                <h3 className="text-xl font-semibold text-primary mb-2">No articles found</h3>
                <p className="text-secondary">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="articles-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article.id}
                    className="article-card bg-surface border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-accent-orange transition-all duration-300 group"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="article-image relative h-48 overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <div className="article-category absolute top-3 left-3 bg-surface text-primary text-xs font-semibold px-3 py-1 rounded-full capitalize">
                        {article.category.replace('-', ' ')}
                      </div>
                    </div>
                    
                    <div className="article-content p-6">
                      <div className="article-meta flex gap-4 mb-3 text-sm text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {article.readTime}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-primary mb-3 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-secondary mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="tags flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-surface-alt text-xs text-secondary rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="article-footer flex justify-between items-center pt-4 border-t border-border-light">
                        <span className="author flex items-center gap-2 text-sm text-secondary">
                          <User size={14} />
                          {article.author}
                        </span>
                        <CTAButton
                          text="Read More"
                          variant="text"
                          size="small"
                          href={`/blog/${article.id}`}
                          icon="arrow"
                          className="text-accent-orange hover:text-accent-gold"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="newsletter-card bg-surface border border-border rounded-2xl p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-spark-gradient"></div>
              <Sparkles className="absolute -top-4 -right-4 w-24 h-24 text-accent-gold/10" />
              
              <h2 className="text-3xl font-bold text-primary mb-4">Stay Updated</h2>
              <p className="text-lg text-secondary max-w-2xl mx-auto mb-8">
                Subscribe to our newsletter for the latest articles, tips, and exclusive offers. 
                Join 5,000+ event professionals who read our insights.
              </p>
              
              <div className="newsletter-form max-w-md mx-auto flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" size={20} />
                  <input 
                    type="email" 
                    placeholder="Enter your email address"
                    className="newsletter-input w-full pl-10 pr-4 py-3 bg-surface-alt border border-border rounded-lg text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-orange focus:ring-2 focus:ring-accent-orange/20"
                  />
                </div>
                <CTAButton
                  text="Subscribe"
                  variant="primary"
                  size="medium"
                  onClick={() => console.log('Subscribe clicked')}
                  icon="mail"
                />
              </div>
              
              <p className="newsletter-note text-sm text-text-tertiary mt-6">
                We respect your privacy. Unsubscribe at any time. No spam, ever.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;