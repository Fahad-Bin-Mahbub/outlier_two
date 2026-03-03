'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface Document {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
  collaborators: string[];
  mentions: Mention[];
}

interface User {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  cursor?: number;
}

interface Mention {
  id: string;
  userId: string;
  position: number;
  resolved: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'mention' | 'info' | 'success';
  timestamp: Date;
  documentName?: string;
  isRead?: boolean;
}

const mockUsers: User[] = [
  { id: 'user1', name: 'Alex Chen', color: '#E53E3E', isActive: true },
  { id: 'user2', name: 'Sarah Kim', color: '#2D9A93', isActive: true },
  { id: 'user3', name: 'Mike Johnson', color: '#2B6CB0', isActive: true },
  { id: 'user4', name: 'Emma Davis', color: '#68A085', isActive: true },
  { id: 'user5', name: 'David Rodriguez', color: '#7BB899', isActive: true },
  { id: 'user6', name: 'Lisa Wang', color: '#D493A3', isActive: false },
  { id: 'user7', name: 'James Wilson', color: '#B794C7', isActive: true },
  { id: 'user8', name: 'Maria Garcia', color: '#C7B35C', isActive: true },
  { id: 'user9', name: 'Chris Taylor', color: '#CC7A5A', isActive: false },
  { id: 'user10', name: 'Nina Patel', color: '#5FA8CC', isActive: true },
];

const mockDocuments: Document[] = [
  {
    id: 'doc1',
    title: 'Project Roadmap Q2 2025',
    content: '# Project Roadmap Q2 2025\n\n## Key Objectives\n- Launch mobile app beta\n- Implement user feedback\n- Scale infrastructure\n\n@sarah Please review the timeline',
    lastModified: new Date('2025-06-07'),
    collaborators: ['user1', 'user2'],
    mentions: [{ id: 'mention1', userId: 'user2', position: 156, resolved: false }]
  },
  {
    id: 'doc2',
    title: 'Design System Guidelines',
    content: '# Design System Guidelines\n\n## Colors\n- Primary: #667eea\n- Secondary: #764ba2\n\n## Typography\n- Headers: Inter Bold\n- Body: Inter Regular\n\nAll text should be dark and clearly readable with proper contrast ratios.',
    lastModified: new Date('2025-06-06'),
    collaborators: ['user1', 'user3', 'user4'],
    mentions: []
  },
  {
    id: 'doc3',
    title: 'Meeting Notes - Team Sync',
    content: '# Team Sync - June 5, 2025\n\n## Attendees\n- Alex, Sarah, Mike\n\n## Action Items\n- [ ] Update documentation\n- [ ] Review pull requests\n- [x] Deploy staging environment',
    lastModified: new Date('2025-06-05'),
    collaborators: ['user1', 'user2', 'user3'],
    mentions: []
  }
];

const Icons = {
  Edit: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4L18.5 2.5z" />
    </svg>
  ),
  Users: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  At: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12" />
    </svg>
  ),
  Plus: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Trash: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  ),
  ChevronDown: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6,9 12,15 18,9" />
    </svg>
  ),
  ChevronUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="18,15 12,9 6,15" />
    </svg>
  )
};

export default function NoteSharingAppExport() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toastNotifications, setToastNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [documentsCollapsed, setDocumentsCollapsed] = useState(false);
  const [hasOpenedNotificationsModal, setHasOpenedNotificationsModal] = useState(false);
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);
  const [recentNotifications, setRecentNotifications] = useState<Set<string>>(new Set());
  const [dismissingNotifications, setDismissingNotifications] = useState<Set<string>>(new Set());

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveToLocalStorage = useCallback((docs: Document[]) => {
    try {
      localStorage.setItem('collaborative-notes', JSON.stringify(docs));
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, []);

  const loadFromLocalStorage = useCallback((): Document[] => {
    try {
      const stored = localStorage.getItem('collaborative-notes');
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((doc: any) => ({
          ...doc,
          lastModified: new Date(doc.lastModified)
        }));
      }
      return mockDocuments;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return mockDocuments;
    }
  }, []);

  useEffect(() => {
    const storedDocs = loadFromLocalStorage();
    setDocuments(storedDocs);
    if (storedDocs.length > 0) {
      setSelectedDocument(storedDocs[0]);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadFromLocalStorage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notifications-container') && !target.closest('button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showMobilePreview) {
        setShowMobilePreview(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMobilePreview]);

  useEffect(() => {
    const initialBoost = setTimeout(() => {
      setUsers(prevUsers => {
        return prevUsers.map(user => {
          if (user.id === 'user1') return user;
          if (Math.random() < 0.4) {
            return { ...user, isActive: !user.isActive };
          }
          return user;
        });
      });
    }, 2000); 

    const simulateUserActivity = () => {
      setUsers(prevUsers => {
        const updatedUsers = prevUsers.map(user => {
          if (user.id === 'user1') return user;
          
          if (Math.random() < 0.08) {
            const newStatus = !user.isActive;
            
            if (selectedDocument && selectedDocument.collaborators.includes(user.id) && Math.random() < 0.4) {
              const now = Date.now();
              const notificationKey = `${user.id}-${newStatus ? 'joined' : 'left'}-${selectedDocument.id}`;
              
              // Evitar notificaciones duplicadas y muy frecuentes
              if (now - lastNotificationTime > 3000 && !recentNotifications.has(notificationKey)) {
                const activityNotification: Notification = {
                  id: `activity-${now}-${Math.random().toString(36).substring(2, 11)}`,
                  message: `${user.name} ${newStatus ? 'joined' : 'left'} the document`,
                  type: 'info',
                  timestamp: new Date(),
                  documentName: selectedDocument.title,
                  isRead: false
                };
                
                setLastNotificationTime(now);
                setRecentNotifications(prev => new Set(prev.add(notificationKey)));
                setNotifications(prev => [activityNotification, ...prev]);
                setToastNotifications(prev => [activityNotification, ...prev.slice(0, 2)]);
                setHasOpenedNotificationsModal(false);
                
                setTimeout(() => {
                  setRecentNotifications(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(notificationKey);
                    return newSet;
                  });
                }, 5000);
                
                setTimeout(() => {
                  dismissNotification(activityNotification.id);
                }, 3500);
              }
            }
            
            return { ...user, isActive: newStatus };
          }
          return user;
        });
        
        return updatedUsers;
      });
    };

    const interval = setInterval(() => {
      simulateUserActivity();
    }, Math.random() * 8000 + 6000); 

    return () => {
      clearTimeout(initialBoost);
      clearInterval(interval);
    };
  }, [selectedDocument]);

  useEffect(() => {
    const simulateCollaboration = () => {
      setDocuments(prevDocs => {
        return prevDocs.map(doc => {
          if (Math.random() < 0.05) { // Reducida la frecuencia para evitar conflictos
            const activeUsers = users.filter(u => u.isActive && !doc.collaborators.includes(u.id));
            const currentCollaborators = doc.collaborators.filter(id => id !== 'user1'); 
            
            if (Math.random() < 0.6 && activeUsers.length > 0) {
              const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
              return {
                ...doc,
                collaborators: [...doc.collaborators, randomUser.id]
              };
            } else if (currentCollaborators.length > 0) {
              const randomIndex = Math.floor(Math.random() * currentCollaborators.length);
              const userToRemove = currentCollaborators[randomIndex];
              return {
                ...doc,
                collaborators: doc.collaborators.filter(id => id !== userToRemove)
              };
            }
          }
          return doc;
        });
      });
    };

    const interval = setInterval(() => {
      simulateCollaboration();
    }, Math.random() * 15000 + 20000); // Aumentado el intervalo

    return () => clearInterval(interval);
  }, [users]);

  const autoSave = useCallback((updatedDoc: Document) => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      const updatedDocs = documents.map(doc => 
        doc.id === updatedDoc.id ? updatedDoc : doc
      );
      setDocuments(updatedDocs);
      saveToLocalStorage(updatedDocs);
    }, 1000);
  }, [documents, saveToLocalStorage]);

  const handleContentChange = (content: string) => {
    if (!selectedDocument) return;

    const updatedDoc = {
      ...selectedDocument,
      content,
      lastModified: new Date()
    };

    setSelectedDocument(updatedDoc);
    autoSave(updatedDoc);

    const atPosition = content.lastIndexOf('@');
    if (atPosition !== -1 && atPosition === content.length - 1) {
      setMentionPosition(atPosition);
      setShowMentionSuggestions(true);
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const handleMentionSelect = (user: User) => {
    if (!selectedDocument || !editorRef.current) return;

    const content = selectedDocument.content;
    const beforeMention = content.substring(0, mentionPosition);
    const afterMention = content.substring(mentionPosition + 1);
    const newContent = `${beforeMention}@${user.name} ${afterMention}`;

    handleContentChange(newContent);
    setShowMentionSuggestions(false);

    const notification: Notification = {
      id: Date.now().toString(),
      message: `You mentioned ${user.name}`,
      type: 'mention',
      timestamp: new Date(),
      documentName: selectedDocument.title,
      isRead: false
    };
    
    setNotifications(prev => [notification, ...prev]);
    setToastNotifications(prev => [notification, ...prev.slice(0, 2)]);
    setHasOpenedNotificationsModal(false); 

    setTimeout(() => {
      dismissNotification(notification.id);
    }, 3500);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(
          beforeMention.length + user.name.length + 2,
          beforeMention.length + user.name.length + 2
        );
      }
    }, 100);
  };

  const dismissNotification = (notificationId: string) => {
    setDismissingNotifications(prev => new Set(prev.add(notificationId)));
    
    setTimeout(() => {
      setToastNotifications(prev => prev.filter(n => n.id !== notificationId));
      setDismissingNotifications(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    }, 600); 
  };

  const createNewDocument = () => {
    const activeUsers = users.filter(u => u.isActive);
    const randomCollaborators = ['user1']; 
    
    const numAdditionalCollaborators = Math.floor(Math.random() * 3) + 1; 
    const availableUsers = activeUsers.filter(u => u.id !== 'user1');
    
    for (let i = 0; i < Math.min(numAdditionalCollaborators, availableUsers.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableUsers.length);
      const selectedUser = availableUsers.splice(randomIndex, 1)[0];
      randomCollaborators.push(selectedUser.id);
    }

    const newDoc: Document = {
      id: `doc${Date.now()}`,
      title: 'Untitled Document',
      content: '# Untitled Document\n\nStart typing...',
      lastModified: new Date(),
      collaborators: randomCollaborators,
      mentions: []
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    setSelectedDocument(newDoc);
    saveToLocalStorage(updatedDocs);
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [documents, searchTerm]);

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const renderMarkdownPreview = (content: string) => {
    const lines = content.split('\n');
    const elements: any[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('`' + '`' + '`')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockLanguage = line.substring(3).trim();
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${i}`} className="mb-4">
              {codeBlockLanguage && (
                <div className="bg-gray-200 px-3 py-1 text-xs rounded-t-lg border-b" style={{ color: '#2E2E2E' }}>
                  {codeBlockLanguage}
                </div>
              )}
              <pre className={`bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm ${codeBlockLanguage ? 'rounded-t-none' : ''}`}>
                <code style={{ fontFamily: 'Courier Prime, monospace', color: '#2E2E2E' }}>
                  {codeBlockContent.join('\n')}
                </code>
              </pre>
            </div>
          );
          codeBlockContent = [];
          codeBlockLanguage = '';
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      const processInlineCode = (text: string) => {
        const parts = text.split(/(`[^`]+`)/);
        return parts.map((part, partIndex) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code
                key={partIndex}
                className="bg-gray-100 px-1 py-0.5 rounded text-sm text-red-600"
                style={{ fontFamily: 'Courier Prime, monospace' }}
              >
                {part.slice(1, -1)}
              </code>
            );
          }
          return part;
        });
      };

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold mb-4" style={{ color: '#2E2E2E' }}>
            {processInlineCode(line.substring(2))}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-xl font-semibold mb-3" style={{ color: '#2E2E2E' }}>
            {processInlineCode(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-lg font-semibold mb-2" style={{ color: '#2E2E2E' }}>
            {processInlineCode(line.substring(4))}
          </h3>
        );
      } else if (line.startsWith('- [ ]')) {
        elements.push(
          <div key={i} className="flex items-center mb-2">
            <input type="checkbox" className="mr-2 rounded" />
            <span style={{ color: '#2E2E2E' }}>{processInlineCode(line.substring(5))}</span>
          </div>
        );
      } else if (line.startsWith('- [x]')) {
        elements.push(
          <div key={i} className="flex items-center mb-2">
            <input type="checkbox" checked readOnly className="mr-2 rounded" />
            <span className="line-through" style={{ color: '#6D4C41' }}>{processInlineCode(line.substring(5))}</span>
          </div>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="ml-4 mb-1" style={{ color: '#2E2E2E' }}>
            {processInlineCode(line.substring(2))}
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else {
        elements.push(
          <p key={i} className="mb-2" style={{ color: '#2E2E2E' }}>
            {processInlineCode(line)}
          </p>
        );
      }
    }

    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <div key="unclosed-code" className="mb-4">
          {codeBlockLanguage && (
            <div className="bg-gray-200 px-3 py-1 text-xs rounded-t-lg border-b" style={{ color: '#2E2E2E' }}>
              {codeBlockLanguage}
            </div>
          )}
          <pre className={`bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm ${codeBlockLanguage ? 'rounded-t-none' : ''}`}>
            <code style={{ fontFamily: 'Courier Prime, monospace', color: '#2E2E2E' }}>
              {codeBlockContent.join('\n')}
            </code>
          </pre>
        </div>
      );
    }

    return elements;
  };

  return (
    <>
      
      <link
        href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap"
        rel="stylesheet"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50" style={{ fontFamily: 'Courier Prime, monospace', backgroundColor: '#FEFCF9' }}>
      
      <header className="bg-orange-50/90 backdrop-blur-lg border-b border-orange-100 sticky top-0 z-50 animate-slideDown" style={{ backgroundColor: 'rgba(255, 251, 249, 0.9)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 text-white to-red-500 rounded-lg flex items-center justify-center shadow-lg">
              <Icons.Edit />
            </div>
            <h1 className="text-xl font-bold select-none" style={{ color: '#2E2E2E' }}>TeamNotes</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {isOffline && (
              <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                Offline
              </div>
            )}
            
            {lastSaved && (
              <div className="hidden sm:flex items-center text-xs" style={{ color: '#6D4C41' }}>
                <Icons.Check />
                <span className="ml-1">Saved {formatRelativeTime(lastSaved)}</span>
              </div>
            )}
            
            <div className="relative notifications-container">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && !hasOpenedNotificationsModal) {
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                className="p-2 rounded-lg transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-110 transform"
                style={{ 
                  color: '#2E2E2E', 
                  backgroundColor: showNotifications ? '#FFE0B2' : 'transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFE0B2'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = showNotifications ? '#FFE0B2' : 'transparent'}
              >
                <div style={{ width: '20px', height: '20px' }}><Icons.Bell /></div>
                {(!hasOpenedNotificationsModal ? notifications.length > 0 : notifications.filter(n => !n.isRead).length > 0) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: '#FF6B47' }}>
                    {!hasOpenedNotificationsModal ? notifications.length : notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div 
                  className="absolute right-[-13px] top-12 w-80 rounded-lg shadow-xl z-50 animate-fadeInScale"
                  style={{ backgroundColor: '#FEFCF9', border: '1px solid #FFE0B2' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3" style={{ borderBottom: '1px solid #FFE0B2' }}>
                    <h3 className="font-semibold" style={{ color: '#2E2E2E' }}>Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto overflow-x-hidden">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => {
                        const isDismissing = dismissingNotifications.has(notification.id);
                        return (
                        <div 
                          key={notification.id} 
                          className={`border-b border-gray-100 last:border-b-0 transition-all duration-500 ease-out overflow-hidden ${
                            isDismissing 
                              ? 'opacity-0 -translate-x-8 scale-95 max-h-0 py-0 px-0 pointer-events-none' 
                              : 'opacity-100 translate-x-0 scale-100 max-h-96 py-3 px-3'
                          } ${
                            !notification.isRead ? 'hover:bg-orange-50' : 'hover:bg-orange-25'
                          }`}
                          style={{
                            backgroundColor: !notification.isRead ? '#FFF3E0' : 'transparent',
                            transformOrigin: 'left center'
                          }}
                          onClick={() => {
                            if (!notification.isRead) {
                              setNotifications(prev => prev.map(n => 
                                n.id === notification.id ? { ...n, isRead: true } : n
                              ));
                            }
                            setHasOpenedNotificationsModal(true);
                          }}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              notification.type === 'mention' ? 'bg-blue-500' : 
                              notification.type === 'success' ? 'bg-green-500' : 'bg-gray-500'
                            }`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                                {notification.message}
                              </p>
                              {notification.documentName && (
                                <p className="text-xs text-blue-600 mt-1 truncate">
                                  in "{notification.documentName}"
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {formatRelativeTime(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                        </div>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        <div className="flex justify-center mb-2">
                          <Icons.Bell />
                        </div>
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                            setHasOpenedNotificationsModal(true);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200"
                        >
                          Mark all read
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const currentNotifications = [...notifications]; 
                            
                            currentNotifications.forEach((notification, index) => {
                              setTimeout(() => {
                                setDismissingNotifications(prev => new Set(prev.add(notification.id)));
                                
                                setTimeout(() => {
                                  setNotifications(prev => prev.filter(n => n.id !== notification.id));
                                  setToastNotifications(prev => prev.filter(n => n.id !== notification.id));
                                  setDismissingNotifications(prev => {
                                    const newSet = new Set(prev);
                                    newSet.delete(notification.id);
                                    return newSet;
                                  });
                                }, 500); 
                              }, index * 100); 
                            });
                            
                            setHasOpenedNotificationsModal(true);
                            // Keep modal open after clearing notifications
                          }}
                          className="text-xs text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-200"
                          disabled={notifications.length === 0}
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col h-[calc(100vh-73px)]">
        <div className="flex-shrink-0 animate-slideUp" style={{ backgroundColor: '#FEFCF9', borderBottom: '1px solid #FFE0B2' }}>
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold select-none" style={{ color: '#2E2E2E', fontSize: '20px' }}>Documents</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setDocumentsCollapsed(!documentsCollapsed)}
                  className="flex items-center justify-center px-2 py-2 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105 transform"
                  style={{ 
                    backgroundColor: '#FFF8F1',
                    color: '#FF6B47',
                    border: '1px solid #FFE0B2',
                    height: '40px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFE0B2';
                    e.currentTarget.style.borderColor = '#FF6B47';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF8F1';
                    e.currentTarget.style.borderColor = '#FFE0B2';
                  }}
                >
                  {documentsCollapsed ? <Icons.ChevronDown /> : <Icons.ChevronUp />}
                </button>
                <button
                  onClick={() => {
                    createNewDocument();
                    const notification: Notification = {
                      id: `new-doc-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                      message: 'New document created',
                      type: 'success',
                      timestamp: new Date(),
                      isRead: false
                    };
                    
                    setNotifications(prev => [notification, ...prev]);
                    setToastNotifications(prev => [notification, ...prev.slice(0, 2)]);
                    setHasOpenedNotificationsModal(false);
                    
                    setTimeout(() => {
                      dismissNotification(notification.id);
                    }, 3500);
                  }}
                  className="flex items-center justify-center sm:space-x-2 px-3 py-2 text-white rounded-lg hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md transform cursor-pointer"
                  style={{ backgroundColor: '#FF6B47', height: '40px' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF5722'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B47'}
                >
                  <Icons.Plus />
                  <span className="hidden sm:inline">New</span>
                </button>
              </div>
            </div>

            <div className={`relative transition-all duration-300 ease-in-out ${
              documentsCollapsed ? 'max-h-0 opacity-0 overflow-hidden mb-0' : 'max-h-16 opacity-100 mb-3'
            }`}>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 rounded-lg transition-all duration-200"
                style={{ 
                  border: '1px solid #FFE0B2',
                  backgroundColor: '#FFF8F1',
                  color: '#2E2E2E'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#FF6B47';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 107, 71, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#FFE0B2';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" style={{ color: '#6D4C41' }}>
                <Icons.Search />
              </div>
            </div>

            <div className={`space-y-2 overflow-y-auto overflow-x-hidden px-1 transition-all duration-300 ease-in-out ${
              documentsCollapsed ? 'max-h-0 opacity-0 py-0' : 'max-h-48 opacity-100 py-1'
            }`}>
              {filteredDocuments.length === 0 && documents.length === 0 ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-3 rounded-lg bg-gray-50 animate-fadeInUp" style={{ animationDelay: `${i * 150}ms` }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded shimmer mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded shimmer w-3/4"></div>
                        </div>
                        <div className="flex flex-col items-end ml-3">
                          <div className="h-3 bg-gray-200 rounded shimmer w-12 mb-1"></div>
                          <div className="flex -space-x-1">
                            <div className="w-6 h-6 bg-gray-200 rounded-full shimmer"></div>
                            <div className="w-6 h-6 bg-gray-200 rounded-full shimmer"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="text-center py-8 animate-fadeInUp">
                  <p className="text-sm text-gray-500">No documents match your search</p>
                </div>
              ) : (
                filteredDocuments.map((doc, index) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocument(doc)}
                  className="p-3 rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md animate-fadeInUp border-2"
                  style={{
                    backgroundColor: selectedDocument?.id === doc.id ? '#FFF3E0' : '#F5F3F0',
                    borderColor: selectedDocument?.id === doc.id ? '#FFE0B2' : 'transparent',
                    animationDelay: `${index * 100}ms`
                  }}
                  onMouseEnter={(e) => {
                    if (selectedDocument?.id !== doc.id) {
                      e.currentTarget.style.backgroundColor = '#FFF8F1';
                      e.currentTarget.style.borderColor = '#FFE0B2';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedDocument?.id !== doc.id) {
                      e.currentTarget.style.backgroundColor = '#F5F3F0';
                      e.currentTarget.style.borderColor = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate" style={{ color: '#2E2E2E' }}>
                        {doc.title.length > 26 ? `${doc.title.substring(0, 26)}...` : doc.title}
                      </h3>
                      <p className="text-sm mt-1 line-clamp-2" style={{ color: '#6D4C41' }}>
                        {doc.content.replace(/[#*-]/g, '').substring(0, 60)}...
                      </p>
                    </div>
                    <div className="flex flex-col items-end ml-3">
                      <div className="flex items-center text-xs mb-1" style={{ color: '#A1887F' }}>
                        <Icons.Clock />
                        <span className="ml-1">{formatRelativeTime(doc.lastModified)}</span>
                      </div>
                      <div className="flex space-x-0.5">
                        {doc.collaborators.slice(0, 3).map((userId) => {
                          const user = users.find(u => u.id === userId);
                          return user ? (
                            <div
                              key={userId}
                              className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-xs font-medium text-white"
                              style={{ backgroundColor: user.color }}
                              title={user.name}
                            >
                              {user.name.charAt(0)}
                            </div>
                          ) : null;
                        })}
                        {doc.collaborators.length > 3 && (
                          <div className="w-5 h-5 bg-gray-300 rounded-full border border-white flex items-center justify-center text-xs font-medium text-gray-600">
                            +{doc.collaborators.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>

        {selectedDocument && (
          <div className="flex-1 bg-white relative animate-fadeIn">
            <div className="border-b border-gray-200 p-4">
              <input
                type="text"
                value={selectedDocument.title}
                onChange={(e) => {
                  const newTitle = e.target.value.length > 26 ? e.target.value.substring(0, 26) : e.target.value;
                  const updatedDoc = { ...selectedDocument, title: newTitle };
                  setSelectedDocument(updatedDoc);
                  autoSave(updatedDoc);
                  
                  if (newTitle !== selectedDocument.title && newTitle.trim() !== '' && newTitle !== 'Untitled Document') {
                    const notification: Notification = {
                      id: `rename-doc-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
                      message: `Document renamed to "${newTitle}"`,
                      type: 'info',
                      timestamp: new Date(),
                      isRead: false
                    };
                    
                    setNotifications(prev => [notification, ...prev]);
                    setToastNotifications(prev => [notification, ...prev.slice(0, 2)]);
                    setHasOpenedNotificationsModal(false);
                    
                    setTimeout(() => {
                      dismissNotification(notification.id);
                    }, 3500);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="text-xl font-semibold text-gray-800 bg-transparent border border-transparent hover:border-gray-300 focus:border-blue-400 outline-none w-full transition-all duration-200 rounded px-2 py-1 -mx-2 -my-1"
                placeholder="Document title..."
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <div style={{ color: '#2E2E2E' }}><Icons.Users /></div>
                  <div className="flex space-x-1.5">
                    {selectedDocument.collaborators.slice(0, 1).map((userId) => {
                      const user = users.find(u => u.id === userId);
                      return user ? (
                        <div
                          key={userId}
                          className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white relative transition-all duration-500 hover:scale-110 transform cursor-pointer ${
                            user.isActive ? 'ring-2 ring-green-400 shadow-lg' : 'opacity-70 ring-1 ring-gray-300'
                          }`}
                          style={{ 
                            backgroundColor: user.isActive ? user.color : '#6D4C41',
                            transform: user.isActive ? 'scale(1)' : 'scale(0.9)'
                          }}
                          title={`${user.name} ${user.isActive ? '(Active)' : '(Offline)'}`}
                          onClick={() => setShowParticipantsModal(true)}
                        >
                          {user.name.charAt(0)}
                          {user.isActive && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full border border-white animate-pulse"></div>
                          )}
                          {!user.isActive && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-gray-400 rounded-full border border-white"></div>
                          )}
                        </div>
                      ) : null;
                    })}
                    {selectedDocument.collaborators.length > 1 && (
                      <div 
                        className="w-2 h-2 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white cursor-pointer hover:scale-110 transform transition-all duration-200"
                        onClick={() => setShowParticipantsModal(true)}
                        title={`View all ${selectedDocument.collaborators.length} participants`}
                      >
                        +{selectedDocument.collaborators.length - 1}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-xs text-gray-500">
                    {selectedDocument.content.split(' ').length} words
                  </div>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(selectedDocument.id)}
                    className="hidden lg:flex items-center justify-center p-2 rounded-lg transition-all duration-200 hover:scale-110 transform cursor-pointer"
                    style={{ 
                      backgroundColor: '#FFF8F1',
                      color: '#FF6B47',
                      border: '1px solid #FFE0B2',
                      width: '40px',
                      height: '40px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFE0B2';
                      e.currentTarget.style.borderColor = '#FF6B47';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFF8F1';
                      e.currentTarget.style.borderColor = '#FFE0B2';
                    }}
                    title="Delete document"
                  >
                    <Icons.Trash />
                  </button>
                  
                  <button
                    onClick={() => setShowMobilePreview(true)}
                    className="lg:hidden flex items-center space-x-1 px-3 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 transform text-sm cursor-pointer"
                    style={{ backgroundColor: '#FF6B47' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF5722'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B47'}
                    title="Preview document"
                  >
                    <Icons.Eye />
                    <span>Preview</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 h-[calc(100%-120px)]">
              <div className="relative border-r border-gray-200">
                <textarea
                  ref={editorRef}
                  value={selectedDocument.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="w-full h-full p-4 resize-none outline-none"
                  placeholder="Start typing your markdown..."
                  style={{ fontSize: '15px', lineHeight: '1.6', fontFamily: 'Courier Prime, monospace', color: '#2E2E2E' }}
                />
                
                {showMentionSuggestions && (
                  <div className="absolute bottom-4 left-4 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-64 animate-fadeInScale">
                    <div className="p-2">
                      <div className="text-xs mb-2" style={{ color: '#2E2E2E' }}>Mention someone:</div>
                      {users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleMentionSelect(user)}
                          className="w-full flex items-center space-x-2 p-2 hover:bg-gray-50 rounded text-left transition-all duration-150 hover:scale-[1.02] transform"
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <span className="text-sm" style={{ color: '#2E2E2E' }}>{user.name}</span>
                          {user.isActive && (
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="hidden lg:block bg-gray-50 overflow-y-auto">
                <div className="p-4">
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="max-w-none break-words overflow-wrap-anywhere">
                      {renderMarkdownPreview(selectedDocument.content)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!selectedDocument && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center animate-fadeInUp">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Icons.Edit />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No document selected</h3>
              <p className="text-gray-500 mb-4">Choose a document from the list above to start editing</p>
              <button
                onClick={createNewDocument}
                className="px-4 py-2 text-white rounded-lg hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg transform cursor-pointer"
                style={{ backgroundColor: '#FF6B47' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF5722'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B47'}
              >
                Create New Document
              </button>
            </div>
          </div>
        )}
      </div>

      {showMobilePreview && selectedDocument && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 animate-fadeIn"
            onClick={() => setShowMobilePreview(false)}
          ></div>
          
          <div className="relative h-full flex flex-col animate-slideUp">
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800">Preview</h3>
                <p className="text-sm text-gray-500 truncate">{selectedDocument.title}</p>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <button
                  onClick={() => setShowDeleteConfirm(selectedDocument.id)}
                  className="p-2 rounded-lg transition-all duration-200 hover:scale-110 transform cursor-pointer flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#FFF8F1',
                    color: '#FF6B47',
                    border: '1px solid #FFE0B2'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFE0B2';
                    e.currentTarget.style.borderColor = '#FF6B47';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#FFF8F1';
                    e.currentTarget.style.borderColor = '#FFE0B2';
                  }}
                >
                  <Icons.Trash />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <div className="bg-white rounded-lg p-6 shadow-sm min-h-full">
                  <div className="max-w-none break-words overflow-wrap-anywhere">
                    {renderMarkdownPreview(selectedDocument.content)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white px-4 py-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {selectedDocument.content.split(' ').length} words
                </div>
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="px-4 py-2 text-white rounded-lg hover:scale-105 transition-all duration-200 transform cursor-pointer"
                  style={{ backgroundColor: '#FF6B47' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF5722'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B47'}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toastNotifications.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 space-y-2">
          {toastNotifications.slice(0, 3).map((notification, index) => {
            const isDismissing = dismissingNotifications.has(notification.id);
            return (
              <div
                key={notification.id}
                className={`px-4 py-3 rounded-lg shadow-lg transform text-center ${
                  isDismissing 
                    ? 'animate-fadeOutDown pointer-events-none' 
                    : 'opacity-100 translate-y-0 scale-100 animate-slideInUp transition-all duration-200'
                }`}
                style={{
                  backgroundColor: '#FFF8F1',
                  color: '#6D4C41',
                  border: '1px solid #FFE0B2',
                  animationDelay: isDismissing ? '0ms' : `${index * 200}ms`,
                  transformOrigin: 'bottom center',
                  width: window.innerWidth <= 768 ? '80vw' : 'auto',
                  minWidth: window.innerWidth > 768 ? '300px' : 'auto'
                }}
              >
                <div className="flex items-center justify-center">
                  <span className="text-sm font-medium text-center">
                    {notification.message.replace(/@\s+/g, '@')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && selectedDocument && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 animate-fadeIn"
            onClick={() => setShowParticipantsModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fadeInScale">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: '#2E2E2E' }}>
                  Document Participants
                </h3>
                <button
                  onClick={() => setShowParticipantsModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Icons.X />
                </button>
              </div>
              
              <div className="space-y-3">
                {selectedDocument.collaborators.map((userId) => {
                  const user = users.find(u => u.id === userId);
                  return user ? (
                    <div key={userId} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white relative ${
                          user.isActive ? 'ring-2 ring-green-400' : 'opacity-70'
                        }`}
                        style={{ backgroundColor: user.isActive ? user.color : '#6D4C41' }}
                      >
                        {user.name.charAt(0)}
                        {user.isActive && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#2E2E2E' }}>{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.isActive ? 'Active now' : 'Offline'}
                        </p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 animate-fadeIn"
            onClick={() => setShowDeleteConfirm(null)}
          ></div>
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 animate-fadeInScale">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 rounded-full" style={{ backgroundColor: '#FFE0B2' }}>
                  <span style={{ color: '#FF6B47' }}>
                    <Icons.Trash />
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold" style={{ color: '#2E2E2E' }}>
                    Delete Document
                  </h3>
                  <p className="text-sm text-gray-500">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "<strong>{documents.find(d => d.id === showDeleteConfirm)?.title}</strong>"?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const updatedDocs = documents.filter(d => d.id !== showDeleteConfirm);
                    setDocuments(updatedDocs);
                    saveToLocalStorage(updatedDocs);
                    
                    if (selectedDocument?.id === showDeleteConfirm) {
                      setSelectedDocument(updatedDocs.length > 0 ? updatedDocs[0] : null);
                    }
                    
                    setShowDeleteConfirm(null);
                    setShowMobilePreview(false);
                  }}
                  className="flex-1 px-4 py-2 text-white rounded-lg transition-all duration-200 hover:scale-105 transform cursor-pointer"
                  style={{ backgroundColor: '#FF6B47' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FF5722'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6B47'}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media (max-width: 1024px) {
          .grid-cols-2 {
            grid-template-columns: 1fr;
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        @media (max-width: 768px) {
          button, .cursor-pointer {
            min-height: 44px;
            min-width: 44px;
          }
        }
        
        * {
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }
        
        button:focus, input:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
        
        textarea:focus {
          outline: none;
          box-shadow: inset 0 0 0 2px #3b82f6;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeOutRight {
          0% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
            filter: blur(0px);
          }
          50% {
            opacity: 0.5;
            transform: translateX(50px) translateY(5px) scale(0.9);
            filter: blur(1px);
          }
          100% {
            opacity: 0;
            transform: translateX(150px) translateY(10px) scale(0.7);
            filter: blur(3px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0, -30px, 0);
          }
          70% {
            transform: translate3d(0, -15px, 0);
          }
          90% {
            transform: translate3d(0, -4px, 0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out;
        }
        
        .animate-slideDown {
          animation: slideDown 0.8s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
        }
        
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        
        .animate-fadeOutRight {
          animation: fadeOutRight 0.5s ease-out forwards;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.4s ease-out;
        }
        
        .animate-fadeOutDown {
          animation: fadeOutDown 0.4s ease-out forwards;
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeOutDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(100px);
          }
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200px 0;
          }
          100% {
            background-position: calc(200px + 100%) 0;
          }
        }
        
        .shimmer {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200px 100%;
          animation: shimmer 1.5s infinite;
        }
              `}</style>
      </div>
    </>
    );
}