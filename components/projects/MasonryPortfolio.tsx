'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// TypeScript Interfaces
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover: string;
  author: string;
  date: string;
  tags: string[];
  readingTime: number;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  height?: number;
}

interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  articles: number;
  followers: number;
  expertise: string[];
  social: {
    twitter: string;
    github: string;
    linkedin: string;
  };
}

interface Metric {
  id: string;
  articleId: string;
  views: number[];
  likes: number[];
  comments: number[];
  shares: number[];
  dates: string[];
}

interface UserPreferences {
  readingHistory: string[];
  savedArticles: string[];
  preferredTags: string[];
  readingTime: number;
  darkMode: boolean;
}

// Mock Data
const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    bio: 'Senior technical writer specializing in cloud infrastructure and DevOps practices with 8+ years of experience in the field.',
    articles: 23,
    followers: 2756,
    expertise: ['Cloud Computing', 'AWS', 'DevOps', 'Kubernetes'],
    social: {
      twitter: 'alexmorgan',
      github: 'alexmorgan',
      linkedin: 'alexmorgan',
    },
  },
  {
    id: '2',
    name: 'Jamie Chen',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    bio: 'Full-stack developer who loves explaining complex programming concepts in simple terms. Open source contributor.',
    articles: 42,
    followers: 4382,
    expertise: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    social: {
      twitter: 'jamiechen',
      github: 'jamiechen',
      linkedin: 'jamiechen',
    },
  },
  {
    id: '3',
    name: 'Taylor Williams',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    bio: 'UX researcher and technical writer focused on accessibility and inclusive design in tech products.',
    articles: 17,
    followers: 1876,
    expertise: ['UX Design', 'Accessibility', 'WCAG', 'User Research'],
    social: {
      twitter: 'taylorwilliams',
      github: 'taylorwilliams',
      linkedin: 'taylorwilliams',
    },
  },
];

const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Building Scalable Microservices with Node.js and Docker',
    excerpt: 'A comprehensive guide to architecting, building, and deploying microservices using Node.js and Docker containers.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1591267990532-e5bdb1b0ceb8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '1',
    date: '2025-04-15',
    tags: ['Microservices', 'Node.js', 'Docker', 'DevOps'],
    readingTime: 12,
    views: 4582,
    likes: 342,
    comments: 78,
    featured: true,
  },
  {
    id: '2',
    title: 'TypeScript Best Practices for Large-Scale Applications',
    excerpt: 'Learn how to effectively use TypeScript features to manage complexity in enterprise applications.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '2',
    date: '2025-04-12',
    tags: ['TypeScript', 'JavaScript', 'Software Architecture'],
    readingTime: 9,
    views: 3241,
    likes: 289,
    comments: 42,
    featured: true,
  },
  {
    id: '3',
    title: 'Implementing Accessibility in React Applications',
    excerpt: 'A practical guide to creating inclusive React applications that follow WCAG guidelines.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1615493936255-91a94f95a10c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '3',
    date: '2025-04-08',
    tags: ['Accessibility', 'React', 'WCAG', 'Frontend'],
    readingTime: 11,
    views: 2867,
    likes: 254,
    comments: 31,
    featured: false,
  },
  {
    id: '4',
    title: 'Advanced Git Workflows for Technical Teams',
    excerpt: 'Discover how to optimize collaboration and code quality with advanced Git strategies.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1603792907191-89e55f70099a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '1',
    date: '2025-04-03',
    tags: ['Git', 'DevOps', 'Collaboration'],
    readingTime: 8,
    views: 3452,
    likes: 198,
    comments: 47,
    featured: false,
  },
  {
    id: '5',
    title: 'Building Performant Web Applications with Next.js',
    excerpt: 'Learn how to leverage Next.js features to create lightning-fast web experiences.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '2',
    date: '2025-03-28',
    tags: ['Next.js', 'React', 'Performance', 'Web Development'],
    readingTime: 13,
    views: 5129,
    likes: 421,
    comments: 89,
    featured: true,
  },
  {
    id: '6',
    title: 'Introduction to Kubernetes for Developers',
    excerpt: 'A beginner-friendly guide to understanding and working with Kubernetes for application deployment.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '1',
    date: '2025-03-22',
    tags: ['Kubernetes', 'Docker', 'DevOps', 'Cloud'],
    readingTime: 14,
    views: 3897,
    likes: 312,
    comments: 65,
    featured: false,
  },
  {
    id: '7',
    title: 'Mastering CSS Grid and Flexbox',
    excerpt: 'Deep dive into modern CSS layout techniques for responsive web design.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '3',
    date: '2025-03-18',
    tags: ['CSS', 'Responsive Design', 'Frontend'],
    readingTime: 10,
    views: 4218,
    likes: 367,
    comments: 54,
    featured: false,
  },
  {
    id: '8',
    title: 'GraphQL API Design Principles',
    excerpt: 'Best practices for designing scalable and efficient GraphQL APIs.',
    content: '...',
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    author: '2',
    date: '2025-03-12',
    tags: ['GraphQL', 'API Design', 'Backend'],
    readingTime: 11,
    views: 3654,
    likes: 278,
    comments: 46,
    featured: false,
  },
];

const mockMetrics: Metric[] = [
  {
    id: '1',
    articleId: '1',
    views: [210, 342, 415, 389, 452, 513, 578, 624, 547, 512],
    likes: [23, 45, 67, 52, 48, 61, 72, 58, 43, 36],
    comments: [5, 12, 14, 9, 7, 10, 15, 12, 8, 6],
    shares: [12, 23, 31, 25, 19, 28, 36, 29, 22, 18],
    dates: [
      '2025-04-06', '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10',
      '2025-04-11', '2025-04-12', '2025-04-13', '2025-04-14', '2025-04-15'
    ],
  },
  {
    id: '2',
    articleId: '2',
    views: [180, 220, 310, 290, 340, 380, 420, 390, 410, 430],
    likes: [18, 25, 42, 38, 45, 52, 60, 48, 50, 56],
    comments: [4, 7, 9, 8, 10, 12, 14, 11, 9, 13],
    shares: [8, 12, 18, 15, 20, 22, 25, 18, 21, 24],
    dates: [
      '2025-04-06', '2025-04-07', '2025-04-08', '2025-04-09', '2025-04-10',
      '2025-04-11', '2025-04-12', '2025-04-13', '2025-04-14', '2025-04-15'
    ],
  },
];

// Utility Functions
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const getRecommendations = (
  articles: Article[],
  userPrefs: UserPreferences
): Article[] => {
  // Simple recommendation algorithm based on tags
  const recommendedArticles = articles
    .filter(article => !userPrefs.readingHistory.includes(article.id))
    .sort((a, b) => {
      const aMatchCount = a.tags.filter(tag => 
        userPrefs.preferredTags.includes(tag)).length;
      const bMatchCount = b.tags.filter(tag => 
        userPrefs.preferredTags.includes(tag)).length;
      return bMatchCount - aMatchCount;
    })
    .slice(0, 3);
  
  return recommendedArticles;
};

// Main Component
export default function MasonryPortfolioExport() {
  // State
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [authors, setAuthors] = useState<Author[]>(mockAuthors);
  const [metrics, setMetrics] = useState<Metric[]>(mockMetrics);
  const [activeTag, setActiveTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [showMetrics, setShowMetrics] = useState<boolean>(false);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [savedArticles, setSavedArticles] = useState<string[]>(['1', '5']);
  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<string>('');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    readingHistory: ['3', '6'],
    savedArticles: ['1', '5'],
    preferredTags: ['TypeScript', 'React', 'DevOps'],
    readingTime: 10,
    darkMode: false,
  });
  
  // Masonry Layout Implementation
  const masonryRef = useRef<HTMLDivElement>(null);
  const [columnCount, setColumnCount] = useState(3);

  // Calculate column count based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumnCount(1);
      } else if (window.innerWidth < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter articles by tag and search query
  const filteredArticles = articles.filter(article => {
    const matchesTag = activeTag === 'All' || article.tags.includes(activeTag);
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  // Get all unique tags
  const allTags = ['All', ...Array.from(new Set(articles.flatMap(article => article.tags)))];

  // Get recommendations based on user preferences
  const recommendedArticles = getRecommendations(articles, userPreferences);

  // Toggle save article
  const toggleSaveArticle = (articleId: string) => {
    setSavedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId) 
        : [...prev, articleId]
    );
    
    // Update user preferences
    setUserPreferences(prev => ({
      ...prev,
      savedArticles: prev.savedArticles.includes(articleId)
        ? prev.savedArticles.filter(id => id !== articleId)
        : [...prev.savedArticles, articleId]
    }));
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setUserPreferences(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
  };
  
  // Simulate offline capability
  const toggleOfflineMode = () => {
    setIsOfflineMode(!isOfflineMode);
    
    // Show notification
    if (!isOfflineMode) {
      setTimeout(() => {
        alert("Articles cached for offline reading. You can now read these articles without an internet connection.");
      }, 500);
    }
  };

  // View article
  const viewArticle = (article: Article) => {
    setSelectedArticle(article);
    setUserPreferences(prev => ({
      ...prev,
      readingHistory: [...prev.readingHistory, article.id]
    }));
    
    // Simulate view count increase
    setArticles(prev => 
      prev.map(a => 
        a.id === article.id 
          ? { ...a, views: a.views + 1 } 
          : a
      )
    );
  };

  // View author
  const viewAuthor = (authorId: string) => {
    const author = authors.find(a => a.id === authorId);
    if (author) {
      setSelectedAuthor(author);
    }
  };

  // Follow author
  const toggleFollowAuthor = (authorId: string) => {
    setAuthors(prev => 
      prev.map(author => 
        author.id === authorId 
          ? { ...author, followers: author.followers + 1 } 
          : author
      )
    );
  };

  // Toggle like article
  const toggleLikeArticle = (articleId: string) => {
    setArticles(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, likes: article.likes + 1 } 
          : article
      )
    );
    
    // Update metrics if available
    if (selectedArticle) {
      setMetrics(prev => 
        prev.map(metric => 
          metric.articleId === articleId 
            ? { 
                ...metric, 
                likes: metric.likes.map((count, i) => 
                  i === metric.likes.length - 1 ? count + 1 : count
                ) 
              } 
            : metric
        )
      );
    }
  };

  // Close modals
  const closeModals = () => {
    setSelectedArticle(null);
    setSelectedAuthor(null);
    setShowMetrics(false);
    setShowShareModal(false);
  };

  // Add a new article (mock functionality)
  const addNewArticle = () => {
    setIsEditorOpen(true);
    setEditorContent('');
  };
  
  // Save article from editor
  const saveArticle = () => {
    if (editorContent.trim().length < 10) {
      alert("Please add more content to your article before saving.");
      return;
    }
    
    const newArticle: Article = {
      id: (articles.length + 1).toString(),
      title: "My New Article",
      excerpt: editorContent.substring(0, 150) + "...",
      content: editorContent,
      cover: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      author: '1', // Default to first author
      date: new Date().toISOString().split('T')[0],
      tags: ['Draft'],
      readingTime: calculateReadingTime(editorContent),
      views: 0,
      likes: 0,
      comments: 0,
      featured: false,
    };
    
    setArticles([newArticle, ...articles]);
    setIsEditorOpen(false);
    setEditorContent('');
    
    // Show confirmation
    setTimeout(() => {
      alert("Article saved successfully!");
    }, 300);
  };
  
  // Dismiss notification
  const dismissNotifications = () => {
    setNotificationCount(0);
    setShowNotifications(false);
  };
  
  // Share article
  const shareArticle = () => {
    setShowShareModal(true);
  };
  
  // Handle share on platform
  const handleShare = (platform: string) => {
    alert(`Article shared on ${platform}!`);
    setShowShareModal(false);
  };

  // Component for article card
  const ArticleCard = ({ article }: { article: Article }) => {
    const authorData = authors.find(a => a.id === article.author);
    const isSaved = savedArticles.includes(article.id);
    
    return (
      <motion.div 
        className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-lg overflow-hidden mb-6 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative">
          <img 
            src={article.cover} 
            alt={article.title} 
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 right-3 flex space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveArticle(article.id);
              }}
              className={`p-2 rounded-full ${isSaved ? 'bg-coral-500 text-white' : 'bg-white text-gray-700'} transition-colors duration-300 hover:shadow-md transform hover:scale-105`}
              aria-label={isSaved ? "Remove from saved articles" : "Save article"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
          {article.featured && (
            <div className="absolute top-3 left-3 bg-teal-600 text-white px-3 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-center text-sm mb-2">
            <span className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>{article.readingTime} min read</span>
            </span>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>{article.date}</span>
          </div>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>{article.title}</h3>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 line-clamp-3`}>{article.excerpt}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map(tag => (
              <span 
                key={tag} 
                className={`px-3 py-1 ${darkMode ? 'bg-teal-900 text-teal-100' : 'bg-teal-50 text-teal-700'} text-xs font-medium rounded-full cursor-pointer transition-colors duration-200 hover:bg-teal-100 hover:text-teal-800`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTag(tag);
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center cursor-pointer" 
              onClick={(e) => {
                e.stopPropagation();
                viewAuthor(article.author);
              }}
            >
              <img 
                src={authorData?.avatar} 
                alt={authorData?.name} 
                className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-teal-500"
              />
              <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{authorData?.name}</span>
            </div>
            <div className="flex space-x-3 text-sm">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>{formatNumber(article.views)}</span>
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>{formatNumber(article.likes)}</span>
              </span>
            </div>
          </div>
          <button 
            onClick={() => viewArticle(article)}
            className="mt-4 w-full py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 transform hover:translate-y-[-2px] font-medium"
            aria-label="Read article"
          >
            Read Article
          </button>
        </div>
      </motion.div>
    );
  };

  // Masonry grid component
  const MasonryGrid = () => {
    // Create columns
    const columns: Article[][] = Array.from({ length: columnCount }, () => []);
    
    // Distribute articles to columns
    filteredArticles.forEach((article, index) => {
      const columnIndex = index % columnCount;
      columns[columnIndex].push(article);
    });
    
    return (
      <div 
        ref={masonryRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col">
            {column.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Mobile list view
  const MobileListView = () => {
    return (
      <div className="flex flex-col space-y-6">
        {filteredArticles.map(article => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    );
  };

  // Article Detail Modal
  const ArticleDetailModal = () => {
    if (!selectedArticle) return null;
    
    const authorData = authors.find(a => a.id === selectedArticle.author);
    const isSaved = savedArticles.includes(selectedArticle.id);
    const articleMetric = metrics.find(m => m.articleId === selectedArticle.id);
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModals}
      >
        <motion.div 
          className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] w-full max-w-4xl`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img 
              src={selectedArticle.cover} 
              alt={selectedArticle.title} 
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
            <button 
              onClick={closeModals}
              className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 transform hover:scale-110"
              aria-label="Close article"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button 
                onClick={() => toggleSaveArticle(selectedArticle.id)}
                className={`p-2.5 rounded-full ${isSaved ? 'bg-coral-500 text-white' : 'bg-white text-gray-700'} transition-colors duration-300 hover:shadow-lg transform hover:scale-105`}
                aria-label={isSaved ? "Remove from saved articles" : "Save article"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
              <button
                onClick={shareArticle}
                className="p-2.5 rounded-full bg-white text-gray-700 hover:text-teal-600 transition-colors duration-300 hover:shadow-lg transform hover:scale-105"
                aria-label="Share article"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6">
              <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{selectedArticle.title}</h2>
              <div className="flex items-center text-sm text-white">
                <span className="flex items-center mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {selectedArticle.readingTime} min read
                </span>
                <span>{selectedArticle.date}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center mb-6">
              <img 
                src={authorData?.avatar} 
                alt={authorData?.name} 
                className="w-12 h-12 rounded-full mr-4 object-cover cursor-pointer border-2 border-teal-500"
                onClick={() => viewAuthor(selectedArticle.author)}
              />
              <div>
                <h4 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{authorData?.name}</h4>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Published on {selectedArticle.date}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedArticle.tags.map(tag => (
                <span 
                  key={tag} 
                  className={`px-3 py-1 ${darkMode ? 'bg-teal-900 text-teal-100' : 'bg-teal-50 text-teal-700'} text-xs font-medium rounded-full cursor-pointer transition-colors duration-200 hover:bg-teal-100 hover:text-teal-800`}
                  onClick={() => {
                    setActiveTag(tag);
                    closeModals();
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className={`prose prose-lg max-w-none ${darkMode ? 'text-gray-300 prose-invert' : 'text-gray-700'} mb-8`}>
              <p className="text-lg font-medium mb-4">
                {selectedArticle.excerpt}
              </p>
              <h3>Introduction</h3>
              <p>
                In the rapidly evolving landscape of technology, keeping up with best practices and emerging trends is essential. This article explores the key concepts and implementation strategies for modern technical solutions.
              </p>
              <p>
                We'll dive deep into architectural considerations, performance optimizations, and real-world applications that demonstrate the principles in action.
              </p>
              <h3>Core Concepts</h3>
              <p>
                Understanding the fundamental principles is crucial before diving into implementation details. Let's explore the key concepts that form the foundation of this topic.
              </p>
              <p>
                By mastering these concepts, you'll be better equipped to tackle complex problems and design elegant solutions that scale effectively with your business needs.
              </p>
              <div className="bg-teal-50 p-4 rounded-lg border-l-4 border-teal-500 my-6">
                <p className="text-teal-900 font-medium">Pro Tip</p>
                <p className="text-teal-800">When applying these concepts in your own projects, start with a small proof of concept before scaling up to your full implementation.</p>
              </div>
              <h3>Implementation Strategies</h3>
              <p>
                With a solid understanding of the core concepts, we can now explore various implementation approaches and best practices that will help you succeed in your projects.
              </p>
              <p>
                These strategies have been tested in production environments and have proven to be effective across different scales and use cases.
              </p>
              <h3>Conclusion</h3>
              <p>
                The landscape continues to evolve, but the principles discussed in this article provide a solid foundation for building robust, scalable, and maintainable solutions.
              </p>
            </div>
            <div className={`flex flex-wrap justify-between items-center border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-6`}>
              <div className="flex space-x-4 mb-4 sm:mb-0">
                <button 
                  className={`flex items-center space-x-1 ${darkMode ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}
                  onClick={() => toggleLikeArticle(selectedArticle.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Like ({formatNumber(selectedArticle.likes)})</span>
                </button>
                <button className={`flex items-center space-x-1 ${darkMode ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>Comment ({formatNumber(selectedArticle.comments)})</span>
                </button>
                <button 
                  className={`flex items-center space-x-1 ${darkMode ? 'text-gray-300 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'} transition-colors`}
                  onClick={shareArticle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span>Share</span>
                </button>
              </div>
              <div>
                <button 
                  onClick={() => setShowMetrics(true)}
                  className="py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 transform hover:scale-105"
                >
                  View Metrics
                </button>
              </div>
            </div>
            
            {/* Related Articles */}
            <div className="mt-10">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles
                  .filter(article => 
                    article.id !== selectedArticle.id && 
                    article.tags.some(tag => selectedArticle.tags.includes(tag))
                  )
                  .slice(0, 2)
                  .map(article => (
                    <div 
                      key={article.id}
                      className={`flex ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg overflow-hidden cursor-pointer transition-colors duration-200`}
                      onClick={() => {
                        setSelectedArticle(article);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <img 
                        src={article.cover} 
                        alt={article.title}
                        className="w-20 h-20 object-cover"
                      />
                      <div className="p-3">
                        <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-1 text-sm line-clamp-2`}>{article.title}</h4>
                        <div className="flex items-center">
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} flex items-center`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {article.readingTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Author Profile Modal
  const AuthorProfileModal = () => {
    if (!selectedAuthor) return null;
    
    const authorArticles = articles.filter(article => article.author === selectedAuthor.id);
    const isFollowing = false; // This would be controlled by a state in a real app
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModals}
      >
        <motion.div 
          className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] w-full max-w-3xl`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={closeModals}
            className="absolute top-4 right-4 bg-white p-2 rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 transform hover:scale-110 z-10"
            aria-label="Close author profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="relative bg-gradient-to-r from-teal-600 to-teal-800 h-48">
            <div className="absolute -bottom-16 left-6 p-1.5 bg-white rounded-full shadow-xl">
              <img 
                src={selectedAuthor.avatar} 
                alt={selectedAuthor.name} 
                className="w-32 h-32 rounded-full object-cover"
              />
            </div>
          </div>
          <div className="pt-20 px-6 pb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAuthor.name}</h2>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedAuthor.expertise.join(', ')}</p>
              </div>
              <button 
                className={`py-2 px-4 ${isFollowing ? 'bg-gray-200 text-gray-800' : 'bg-teal-600 text-white hover:bg-teal-700'} rounded-lg transition-colors duration-300 transform hover:scale-105`}
                onClick={() => toggleFollowAuthor(selectedAuthor.id)}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
            <div className="flex space-x-6 mb-6">
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedAuthor.articles}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Articles</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatNumber(selectedAuthor.followers)}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Followers</p>
              </div>
              <div className="text-center">
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatNumber(authorArticles.reduce((sum, article) => sum + article.views, 0))}</p>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Views</p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>About</h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{selectedAuthor.bio}</p>
            </div>
            <div className="flex space-x-4 mb-8">
              <a 
                href={`https://twitter.com/${selectedAuthor.social.twitter}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-600 transition-colors duration-200 transform hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a 
                href={`https://github.com/${selectedAuthor.social.github}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`${darkMode ? 'text-gray-200' : 'text-gray-900'} hover:text-gray-700 transition-colors duration-200 transform hover:scale-110`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a 
                href={`https://linkedin.com/in/${selectedAuthor.social.linkedin}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-700 hover:text-blue-900 transition-colors duration-200 transform hover:scale-110"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Articles</h3>
              <div className="space-y-4">
                {authorArticles.slice(0, 3).map(article => (
                  <div 
                    key={article.id} 
                    className={`flex cursor-pointer ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} p-3 rounded-lg transition-colors duration-200`}
                    onClick={() => {
                      setSelectedAuthor(null);
                      viewArticle(article);
                    }}
                  >
                    <img 
                      src={article.cover} 
                      alt={article.title} 
                      className="w-20 h-20 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <h4 className={`${darkMode ? 'text-white' : 'text-gray-900'} font-medium mb-1`}>{article.title}</h4>
                      <div className="flex items-center text-sm">
                        <span className={`flex items-center mr-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {article.readingTime} min read
                        </span>
                        <span className={`flex items-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {formatNumber(article.views)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {authorArticles.length > 3 && (
                <button 
                  className={`mt-4 text-teal-600 hover:text-teal-800 font-medium transition-colors duration-200`}
                  onClick={() => {
                    closeModals();
                    setActiveTag('All');
                    // This would filter articles by author in a real implementation
                  }}
                >
                  View all articles by {selectedAuthor.name} →
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Metrics Dashboard Modal
  const MetricsDashboardModal = () => {
    if (!showMetrics) return null;
    
    const article = selectedArticle;
    const articleMetrics = metrics.find(m => m.articleId === article?.id);
    
    if (!article || !articleMetrics) return null;
    
    // Calculate totals
    const totalViews = articleMetrics.views.reduce((sum, v) => sum + v, 0);
    const totalLikes = articleMetrics.likes.reduce((sum, l) => sum + l, 0);
    const totalComments = articleMetrics.comments.reduce((sum, c) => sum + c, 0);
    const totalShares = articleMetrics.shares.reduce((sum, s) => sum + s, 0);
    
    // Calculate engagement rate
    const engagementRate = (((totalLikes + totalComments + totalShares) / totalViews) * 100).toFixed(1);
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeModals}
      >
        <motion.div 
          className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] w-full max-w-5xl`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Article Performance Metrics</h2>
              <button 
                onClick={closeModals}
                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                aria-label="Close metrics"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h3 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>{article.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-teal-50 to-teal-100'} p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300`}>
                <div className="flex items-center mb-2">
                  <div className="p-2.5 rounded-full bg-teal-500 text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h4 className={`${darkMode ? 'text-gray-100' : 'text-gray-700'} font-medium`}>Total Views</h4>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatNumber(totalViews)}</p>
                <p className="text-teal-600 mt-2 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  12.4% from last week
                </p>
              </div>
              <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-coral-50 to-coral-100'} p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300`}>
                <div className="flex items-center mb-2">
                  <div className="p-2.5 rounded-full bg-coral-500 text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className={`${darkMode ? 'text-gray-100' : 'text-gray-700'} font-medium`}>Likes</h4>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatNumber(totalLikes)}</p>
                <p className="text-coral-600 mt-2 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  8.7% from last week
                </p>
              </div>
              <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-blue-50 to-blue-100'} p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300`}>
                <div className="flex items-center mb-2">
                  <div className="p-2.5 rounded-full bg-blue-500 text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h4 className={`${darkMode ? 'text-gray-100' : 'text-gray-700'} font-medium`}>Comments</h4>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formatNumber(totalComments)}</p>
                <p className="text-blue-600 mt-2 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  15.2% from last week
                </p>
              </div>
              <div className={`${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700' : 'bg-gradient-to-br from-purple-50 to-purple-100'} p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300`}>
                <div className="flex items-center mb-2">
                  <div className="p-2.5 rounded-full bg-purple-500 text-white mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </div>
                  <h4 className={`${darkMode ? 'text-gray-100' : 'text-gray-700'} font-medium`}>Engagement Rate</h4>
                </div>
                <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{engagementRate}%</p>
                <p className="text-purple-600 mt-2 text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  5.3% from last week
                </p>
              </div>
            </div>
            <div className="mb-8">
              <h4 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Daily Performance</h4>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} rounded-xl p-4 h-64 flex items-end shadow-sm`}>
                <div className="w-full flex h-52 justify-between items-end">
                  {articleMetrics.dates.map((date, i) => (
                    <div key={date} className="flex flex-col items-center group">
                      <div className="absolute -mt-24 p-2 bg-black bg-opacity-75 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <p>{date}</p>
                        <p>Views: {articleMetrics.views[i]}</p>
                        <p>Likes: {articleMetrics.likes[i]}</p>
                        <p>Comments: {articleMetrics.comments[i]}</p>
                      </div>
                      <div className="flex space-x-1">
                        <div 
                          className="bg-teal-500 rounded-t w-2.5 transition-all duration-300 hover:bg-teal-400"
                          style={{ height: `${(articleMetrics.views[i] / Math.max(...articleMetrics.views)) * 150}px` }}
                        ></div>
                        <div 
                          className="bg-coral-500 rounded-t w-2.5 transition-all duration-300 hover:bg-coral-400"
                          style={{ height: `${(articleMetrics.likes[i] / Math.max(...articleMetrics.likes)) * 150}px` }}
                        ></div>
                        <div 
                          className="bg-blue-500 rounded-t w-2.5 transition-all duration-300 hover:bg-blue-400"
                          style={{ height: `${(articleMetrics.comments[i] / Math.max(...articleMetrics.comments)) * 150}px` }}
                        ></div>
                      </div>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 rotate-45 origin-left`}>{date.slice(-5)}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Views</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-coral-500 rounded-full mr-2"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Likes</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comments</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-4`}>Detailed Analytics</h4>
              <div className="overflow-x-auto">
                <table className={`w-full min-w-full divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'} rounded-lg overflow-hidden`}>
                  <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
                    <tr>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Date</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Views</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Likes</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Comments</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Shares</th>
                      <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>Engagement</th>
                    </tr>
                  </thead>
                  <tbody className={`${darkMode ? 'bg-gray-900' : 'bg-white'} divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                    {articleMetrics.dates.map((date, i) => {
                      const dailyEngagement = (((articleMetrics.likes[i] + articleMetrics.comments[i] + articleMetrics.shares[i]) / articleMetrics.views[i]) * 100).toFixed(1);
                      
                      return (
                        <tr key={date} className={darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{date}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{articleMetrics.views[i]}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{articleMetrics.likes[i]}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{articleMetrics.comments[i]}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{articleMetrics.shares[i]}</td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{dailyEngagement}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3 mt-6">
              <button className={`py-2 px-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} rounded-lg transition-colors duration-300`}>
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Data
                </span>
              </button>
              <button className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-300">
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share Report
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Article Editor Modal
  const ArticleEditorModal = () => {
    if (!isEditorOpen) return null;
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsEditorOpen(false)}
      >
        <motion.div 
          className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl overflow-y-auto max-h-[90vh] w-full max-w-4xl`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Write New Article</h2>
              <button 
                onClick={() => setIsEditorOpen(false)}
                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-800' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                aria-label="Close editor"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Enter article title"
                  className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:ring-teal-500 focus:border-teal-500`}
                />
              </div>
              <div>
                <label htmlFor="tags" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  id="tags"
                  placeholder="e.g. JavaScript, React, Web Development"
                  className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:ring-teal-500 focus:border-teal-500`}
                />
              </div>
              <div>
                <label htmlFor="cover" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="cover"
                  placeholder="Enter image URL or upload"
                  className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:ring-teal-500 focus:border-teal-500`}
                />
              </div>
              <div>
                <label htmlFor="content" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Content
                </label>
                <textarea
                  id="content"
                  rows={10}
                  placeholder="Write your article here..."
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:ring-teal-500 focus:border-teal-500`}
                ></textarea>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="featured"
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="featured" className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Mark as featured
                </label>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button 
                onClick={() => setIsEditorOpen(false)}
                className={`py-2 px-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-100' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'} transition-colors duration-300`}
              >
                Cancel
              </button>
              <button 
                onClick={saveArticle}
                className="py-2 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-300"
              >
                Publish Article
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Share Modal
  const ShareModal = () => {
    if (!showShareModal) return null;
    
    return (
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setShowShareModal(false)}
      >
        <motion.div 
          className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-2xl overflow-hidden max-w-md w-full`}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Share Article</h3>
              <button 
                onClick={() => setShowShareModal(false)}
className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Share this article with your network
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleShare('Twitter')}
            className="flex items-center justify-center py-3 px-4 bg-blue-400 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
            Twitter
          </button>
          <button 
            onClick={() => handleShare('Facebook')}
            className="flex items-center justify-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
            Facebook
          </button>
          <button 
            onClick={() => handleShare('LinkedIn')}
            className="flex items-center justify-center py-3 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            LinkedIn
          </button>
          <button 
            onClick={() => handleShare('Email')}
            className="flex items-center justify-center py-3 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email
          </button>
        </div>
        
        <div className="mt-6">
          <p className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Or copy link</p>
          <div className="flex">
            <input 
              type="text" 
              readOnly 
              value="https://techwrite.io/articles/building-microservices" 
              className={`flex-grow px-3 py-2 text-sm rounded-l-lg ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-gray-100 text-gray-800 border-gray-200'} border`}
            />
            <button 
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-r-lg transition-colors duration-200"
              onClick={() => {
                navigator.clipboard.writeText("https://techwrite.io/articles/building-microservices");
                alert("Link copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
  };
  const NotificationPanel = () => {
if (!showNotifications) return null;
return (
  <motion.div 
    className="absolute right-0 top-16 w-80 mt-2 mr-4 bg-white rounded-xl shadow-xl z-40 overflow-hidden"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
  >
    <div className="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-800">Notifications</h3>
      <button 
        onClick={dismissNotifications}
        className="text-gray-500 hover:text-gray-700"
      >
        Mark all as read
      </button>
    </div>
    <div className="max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex">
          <img 
            src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
            alt="Alex Morgan" 
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="text-sm"><span className="font-medium text-gray-900">Alex Morgan</span> liked your article</p>
            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
          </div>
        </div>
      </div>
      <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex">
          <img 
            src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
            alt="Jamie Chen" 
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <p className="text-sm"><span className="font-medium text-gray-900">Jamie Chen</span> commented on your article</p>
            <p className="text-xs text-gray-600 mt-1">"Great insights! This really helped me understand the concept better."</p>
            <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
          </div>
        </div>
      </div>
      <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
        <div className="flex">
          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <p className="text-sm">Your article <span className="font-medium text-gray-900">TypeScript Best Practices</span> has reached 1,000 views!</p>
            <p className="text-xs text-gray-500 mt-1">Yesterday</p>
          </div>
        </div>
      </div>
    </div>
    <div className="p-3 text-center border-t border-gray-200">
      <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">
        View all notifications
      </button>
    </div>
  </motion.div>
);
  };
  const OfflineModeIndicator = () => {
if (!isOfflineMode) return null;
return (
  <motion.div 
    className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center shadow-lg z-30"
    initial={{ x: -100, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -100, opacity: 0 }}
    transition={{ type: "spring", bounce: 0.4 }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.072m-8.485 8.485a9 9 0 010-12.728m3.536 3.536a5 5 0 010 7.072" />
    </svg>
    Offline Mode
  </motion.div>
);
}
  
  return (
    <div className={min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}}>
{/* Header */}
<header className={${darkMode ? 'bg-gray-800 shadow-gray-800/50' : 'bg-white shadow-sm'} sticky top-0 z-30}>
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="flex justify-between items-center h-16">
<div className="flex items-center">
<div className="flex-shrink-0">
<span className="text-2xl font-bold text-teal-600">TechWrite</span>
</div>
<div className="hidden md:block ml-10">
<div className="flex items-center space-x-4">
<a href="#" className={${darkMode ? 'text-white' : 'text-gray-900'} hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200}>Home</a>
<a href="#" className={${darkMode ? 'text-gray-300' : 'text-gray-500'} hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200}>Explore</a>
<a href="#" className={${darkMode ? 'text-gray-300' : 'text-gray-500'} hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200}>My Articles</a>
<a href="#" className={${darkMode ? 'text-gray-300' : 'text-gray-500'} hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200}>Saved</a>
</div>
</div>
</div>
<div className="hidden md:flex items-center space-x-4">
<button
onClick={toggleDarkMode}
className={p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'} hover:bg-teal-100 hover:text-teal-600 transition-colors duration-200}
aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
>
{darkMode ? (
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>
) : (
<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
</svg>
)}
</button>
<button
onClick={toggleOfflineMode}
className={px-4 py-2 rounded-md text-sm font-medium ${isOfflineMode ? 'bg-yellow-100 text-yellow-800' : ${darkMode ? 'text-gray-300 hover:text-teal-400' : 'text-gray-500 hover:text-teal-600'}} transition-colors duration-200}
>
{isOfflineMode ? 'Online Mode' : 'Offline Mode'}
</button>
<div className="relative">
<button
className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors duration-200"
onClick={() => setShowNotifications(!showNotifications)}
aria-label="Notifications"
>
<svg xmlns="http://www.w3.org/2000/svg" className={h-6 w-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}} fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
</svg>
{notificationCount > 0 && (
<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-coral-500 rounded-full">{notificationCount}</span>
)}
</button>
<AnimatePresence>
{showNotifications && <NotificationPanel />}
</AnimatePresence>
</div>
<button 
             onClick={addNewArticle}
             className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 transition-colors duration-300 transform hover:scale-105"
           >
New Article
</button>
<div className="relative">
<img 
               src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
               alt="Profile" 
               className="w-9 h-9 rounded-full cursor-pointer object-cover border-2 border-teal-500"
             />
</div>
</div>
<div className="md:hidden">
<button
onClick={() => setIsMenuOpen(!isMenuOpen)}
className={${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-teal-600'}}
aria-label="Open menu"
>
<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
</svg>
</button>
</div>
</div>
</div>
{/* Mobile menu */}
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div 
          className={`md:hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>Home</a>
            <a href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} ${darkMode ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-gray-50 hover:text-teal-600'}`}>Explore</a>
            <a href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} ${darkMode ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-gray-50 hover:text-teal-600'}`}>My Articles</a>
            <a href="#" className={`block px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} ${darkMode ? 'hover:bg-gray-700 hover:text-white' : 'hover:bg-gray-50 hover:text-teal-600'}`}>Saved</a>
            <button 
              onClick={toggleDarkMode}
              className={`flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'}`}
            >
              {darkMode ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </>
              )}
            </button>
            <button 
              onClick={toggleOfflineMode}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center ${isOfflineMode ? 'bg-yellow-100 text-yellow-800' : `${darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-teal-600'}`}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m-3.536-3.536a5 5 0 010-7.072m-8.485 8.485a9 9 0 010-12.728m3.536 3.536a5 5 0 010 7.072" />
              </svg>
              {isOfflineMode ? 'Online Mode' : 'Offline Mode'}
            </button>
            <button 
              onClick={addNewArticle}
              className="flex items-center w-full px-3 py-2 bg-teal-600 text-white rounded-md text-base font-medium hover:bg-teal-700 transition-colors duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Article
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </header>

  {/* Main content */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Hero section */}
    <section className="mb-12">
      <div className={`bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl overflow-hidden shadow-xl`}>
        <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16 lg:py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Share Your Technical Knowledge
            </h1>
            <p className="text-teal-100 text-lg mb-6">
              Join a community of technical writers and developers. Share your insights, tutorials, and deep dives with a global audience.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button 
                onClick={addNewArticle}
                className="px-6 py-3 bg-white text-teal-700 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-300 hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Writing
              </motion.button>
              <motion.button 
                className="px-6 py-3 bg-transparent text-white border border-white rounded-lg font-medium hover:bg-white hover:bg-opacity-10 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Articles
              </motion.button>
            </div>
          </div>
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Technical Writing" 
              className="rounded-lg shadow-lg max-w-full h-auto"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Search and filter section */}
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 pr-4 py-2.5 w-full rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
          />
          <div className={`absolute left-3 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div className="flex overflow-x-auto space-x-2 p-1 w-full sm:w-auto">
          {allTags.map(tag => (
            <motion.button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                activeTag === tag 
                  ? 'bg-teal-600 text-white' 
                  : `${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-200'} hover:bg-gray-100 border`
              } transition-colors duration-200`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tag}
            </motion.button>
          ))}
        </div>
      </div>
    </section>

    {/* Recommended articles */}
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Recommended For You</h2>
        <a href="#" className="text-teal-600 hover:text-teal-800 font-medium">View All</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedArticles.map(article => {
          const authorData = authors.find(a => a.id === article.author);
          return (
            <motion.div 
              key={article.id}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img 
                  src={article.cover} 
                  alt={article.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 left-0 bg-teal-600 text-white px-3 py-1 rounded-br-lg text-sm font-medium">
                  Recommended
                </div>
              </div>
              <div className="p-5">
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>{article.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4 line-clamp-3`}>{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={authorData?.avatar} 
                      alt={authorData?.name} 
                      className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-teal-500"
                      onClick={() => viewAuthor(article.author)}
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{authorData?.name}</span>
                  </div>
                  <button 
                    onClick={() => viewArticle(article)}
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>

    {/* Featured articles */}
    <section className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Featured Articles</h2>
        <a href="#" className="text-teal-600 hover:text-teal-800 font-medium">View All</a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {articles.filter(article => article.featured).slice(0, 2).map(article => {
          const authorData = authors.find(a => a.id === article.author);
          return (
            <motion.div 
              key={article.id}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="md:w-2/5">
                <img 
                  src={article.cover} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-3/5 p-6">
                <div className="flex items-center text-sm mb-2">
                  <span className="flex items-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${darkMode ? 'text-teal-400' : 'text-teal-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>{article.readingTime} min read</span>
                  </span>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-500'}>{article.date}</span>
                </div>
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{article.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{article.excerpt}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag} 
                      className={`px-3 py-1 ${darkMode ? 'bg-teal-900 text-teal-100' : 'bg-teal-50 text-teal-700'} text-xs font-medium rounded-full cursor-pointer hover:bg-teal-100 hover:text-teal-800 transition-colors duration-200`}
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <img 
                      src={authorData?.avatar} 
                      alt={authorData?.name} 
                      className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-teal-500"
                      onClick={() => viewAuthor(article.author)}
                    />
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{authorData?.name}</span>
                  </div>
                  <button 
                    onClick={() => viewArticle(article)}
                    className="text-teal-600 hover:text-teal-800 text-sm font-medium transition-colors duration-200"
                  >
                    Read More →
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>

    {/* All articles */}
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>All Articles</h2>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-200'} border hover:bg-gray-50 transition-colors duration-200`}>
            Recent
          </button>
          <button className={`px-4 py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-gray-800 text-gray-300 border-gray-700' : 'bg-white text-gray-700 border-gray-200'} border hover:bg-gray-50 transition-colors duration-200`}>
            Popular
          </button>
        </div>
      </div>
      {columnCount === 1 ? <MobileListView /> : <MasonryGrid />}
      
      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-12 w-12 mx-auto ${darkMode ? 'text-gray-600' : 'text-gray-400'} mb-4`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>No articles found</h3>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Try changing your search or filter criteria</p>
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        <motion.button 
          className={`px-6 py-3 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-gray-300 text-gray-700'} border rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Load More
        </motion.button>
      </div>
    </section>
  </main>

  {/* Footer */}
  <footer className={`${darkMode ? 'bg-gray-900 border-t border-gray-800' : 'bg-gray-800'} text-gray-300 py-12 mt-16`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-4">TechWrite</h3>
          <p className="mb-4">A platform for technical writers to share knowledge, connect with peers, and grow their audience.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Home</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Explore</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Featured</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Categories</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Writers</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Resources</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors duration-200">Style Guide</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Writing Tips</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Publication Process</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Code Examples</a></li>
            <li><a href="#" className="hover:text-white transition-colors duration-200">Tutorials</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Subscribe</h4>
          <p className="mb-4">Get the latest articles and updates delivered to your inbox.</p>
          <form className="flex mb-4">
            <input 
              type="email" 
              placeholder="Your email" 
              className="px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-700 border-gray-600 text-white"
            />
            <button className="bg-teal-600 text-white px-4 py-2 rounded-r-lg hover:bg-teal-700 transition-colors duration-300">
              Subscribe
            </button>
          </form>
          <p className="text-sm text-gray-400">By subscribing, you agree to our Privacy Policy.</p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
        <p>© 2025 TechWrite. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors duration-200">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>

  {/* Modals */}
  <AnimatePresence>
    {selectedArticle && <ArticleDetailModal />}
    {selectedAuthor && <AuthorProfileModal />}
    {showMetrics && <MetricsDashboardModal />}
    {isEditorOpen && <ArticleEditorModal />}
    {showShareModal && <ShareModal />}
  </AnimatePresence>

  {/* Offline Mode Indicator */}
  <AnimatePresence>
    {isOfflineMode && <OfflineModeIndicator />}
  </AnimatePresence>

  {/* CSS Styles */}
  <style jsx global>{`
    /* Custom color definitions for Tailwind classes */
    .bg-teal-50 { background-color: #f0fdfa; }
    .bg-teal-100 { background-color: #ccfbf1; }
    .bg-teal-500 { background-color: #14b8a6; }
    .bg-teal-600 { background-color: #0d9488; }
    .bg-teal-700 { background-color: #0f766e; }
    .bg-teal-800 { background-color: #115e59; }
    .bg-teal-900 { background-color: #134e4a; }
    .text-teal-100 { color: #ccfbf1; }
    .text-teal-400 { color: #2dd4bf; }
    .text-teal-500 { color: #14b8a6; }
    .text-teal-600 { color: #0d9488; }
    .text-teal-700 { color: #0f766e; }
    .text-teal-800 { color: #115e59; }
    
    .bg-coral-50 { background-color: #fff7ed; }
    .bg-coral-100 { background-color: #ffedd5; }
    .bg-coral-500 { background-color: #f97316; }
    .text-coral-500 { color: #f97316; }
    .text-coral-600 { color: #ea580c; }
    
    /* Line clamp utilities */
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }
    
    /* Smooth scrolling */
    html {
      scroll-behavior: smooth;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: ${darkMode ? '#1f2937' : '#f1f1f1'};
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: ${darkMode ? '#4b5563' : '#0d9488'};
      border-radius: 10px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: ${darkMode ? '#6b7280' : '#0f766e'};
    }
    
    /* Better focus styles */
    button:focus, a:focus, input:focus, textarea:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.3);
    }
  `}</style>
</div>
  );}