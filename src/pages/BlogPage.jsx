import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { 
  Calendar, 
  User, 
  Clock, 
  Tag,
  Search,
  ArrowRight
} from 'lucide-react';

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'safety', label: 'Safety Tips' },
    { id: 'trends', label: 'Event Trends' },
    { id: 'planning', label: 'Event Planning' },
    { id: 'behind-scenes', label: 'Behind the Scenes' }
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
      image: '/images/blog/safety-guide.jpg'
    },
    {
      id: 2,
      title: 'Top Wedding Trends for 2024: Incorporating Pyrotechnics',
      excerpt: 'How modern couples are using fireworks to create unforgettable wedding moments.',
      category: 'trends',
      date: 'Jan 10, 2024',
      author: 'Dorcas Wanjiru',
      readTime: '4 min read',
      image: '/images/blog/wedding-trends.jpg'
    },
    {
      id: 3,
      title: 'Behind the Scenes: Planning a Major Festival Display',
      excerpt: 'A look at what goes into planning and executing large-scale festival fireworks.',
      category: 'behind-scenes',
      date: 'Dec 28, 2023',
      author: 'Alex Maina',
      readTime: '7 min read',
      image: '/images/blog/festival-planning.jpg'
    },
    {
      id: 4,
      title: 'Budgeting for Your Event: Pyrotechnics Cost Breakdown',
      excerpt: 'Understanding the costs involved in fireworks displays and how to plan your budget.',
      category: 'planning',
      date: 'Dec 20, 2023',
      author: 'Sarah Atieno',
      readTime: '6 min read',
      image: '/images/blog/budget-guide.jpg'
    },
    {
      id: 5,
      title: 'Indoor Pyrotechnics: Safe Effects for Venue Celebrations',
      excerpt: 'How to safely incorporate pyrotechnics in indoor venues for corporate events and parties.',
      category: 'safety',
      date: 'Dec 15, 2023',
      author: 'James Omondi',
      readTime: '5 min read',
      image: '/images/blog/indoor-pyro.jpg'
    },
    {
      id: 6,
      title: 'Music Synchronization: Timing Fireworks to Your Soundtrack',
      excerpt: 'The art and technology behind perfectly timed fireworks displays.',
      category: 'behind-scenes',
      date: 'Dec 10, 2023',
      author: 'Alex Maina',
      readTime: '4 min read',
      image: '/images/blog/music-sync.jpg'
    }
  ];

  const featuredArticle = articles[0];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Blog | IGNUX - Insights & Tips</title>
        <meta name="description" content="Expert insights on fireworks safety, event trends, and behind-the-scenes looks at pyrotechnic displays." />
      </Helmet>

      {/* Hero */}
      <section className="blog-hero">
        <div className="container">
          <h1 className="section-title">
            IGNUX <span className="gradient-text">Insights</span>
          </h1>
          <p className="section-subtitle">
            Expert tips, trends, and behind-the-scenes looks at the world of pyrotechnics.
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section blog-filters">
        <div className="container">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search articles..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
      </section>

      {/* Featured Article */}
      <section className="section featured-article">
        <div className="container">
          <div className="featured-card">
            <div className="featured-image">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <div className="featured-badge">Featured</div>
            </div>
            <div className="featured-content">
              <div className="article-meta">
                <span className="meta-item">
                  <Tag size={16} />
                  {featuredArticle.category}
                </span>
                <span className="meta-item">
                  <Calendar size={16} />
                  {featuredArticle.date}
                </span>
                <span className="meta-item">
                  <User size={16} />
                  {featuredArticle.author}
                </span>
                <span className="meta-item">
                  <Clock size={16} />
                  {featuredArticle.readTime}
                </span>
              </div>
              <h2>{featuredArticle.title}</h2>
              <p>{featuredArticle.excerpt}</p>
              <button className="read-more-button">
                Read Full Article
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">
            Latest <span className="gradient-text">Articles</span>
          </h2>
          <div className="articles-grid">
            {filteredArticles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-image">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                  <div className="article-category">{article.category}</div>
                </div>
                <div className="article-content">
                  <div className="article-meta">
                    <span className="meta-item">
                      <Calendar size={14} />
                      {article.date}
                    </span>
                    <span className="meta-item">
                      <Clock size={14} />
                      {article.readTime}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <div className="article-footer">
                    <span className="author">
                      <User size={14} />
                      {article.author}
                    </span>
                    <button className="read-button">
                      Read More
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-card">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest articles, tips, and special offers.</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="newsletter-input"
              />
              <button className="newsletter-button">Subscribe</button>
            </div>
            <p className="newsletter-note">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPage;