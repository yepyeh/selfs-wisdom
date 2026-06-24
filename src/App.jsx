import React, { useState, useEffect, useMemo } from 'react';
import { 
  Heart, 
  Activity, 
  Coins, 
  Compass, 
  Search, 
  Send, 
  User, 
  LogOut, 
  ThumbsUp, 
  Sparkles,
  Calendar,
  Compass as CompassIcon,
  Smile,
  BookOpen
} from 'lucide-react';

// Import avatars
import avatar15 from './assets/avatar_15.png';
import avatar25 from './assets/avatar_25.png';
import avatar45 from './assets/avatar_45.png';
import avatar65 from './assets/avatar_65.png';

const AVATAR_MAP = {
  15: avatar15,
  25: avatar25,
  45: avatar45,
  65: avatar65,
};

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: Sparkles, colorClass: 'all' },
  { id: 'health', label: 'Health', icon: Activity, colorClass: 'health' },
  { id: 'money', label: 'Money', icon: Coins, colorClass: 'money' },
  { id: 'travel', label: 'Travel', icon: Compass, colorClass: 'travel' },
  { id: 'relationships', label: 'Relationships', icon: Heart, colorClass: 'relationships' },
];

const INITIAL_TIPS = [
  {
    id: 'tip-1',
    author: 'David',
    authorAge: 50,
    targetAge: 25,
    category: 'money',
    text: 'Start saving 10% of whatever you earn immediately. Compound interest is a real cheat code, and those designer clothes won\'t matter in 10 years.',
    reason: 'I had to work until 65 because I spent my 20s buying things I didn\'t need to impress people I didn\'t like.',
    lifestyle: 'Retired Accountant, coffee lover',
    kudos: 42,
    kudosed: false
  },
  {
    id: 'tip-2',
    author: 'Sarah',
    authorAge: 38,
    targetAge: 18,
    category: 'health',
    text: 'Wear sunscreen every single day, even in winter. Your skin will thank you, and lift weights to build joint resilience.',
    reason: 'I got a melanoma scare at 35 and my lower back started hurting constantly.',
    lifestyle: 'Product Designer, weekend hiker',
    kudos: 28,
    kudosed: false
  },
  {
    id: 'tip-3',
    author: 'James',
    authorAge: 60,
    targetAge: 30,
    category: 'relationships',
    text: 'Don\'t let pride end friendships. Apologize first, even if it feels unfair. True friends are hard to find in your 50s.',
    reason: 'I lost touch with my college roommate over a trivial argument about money.',
    lifestyle: 'Writer, empty nester',
    kudos: 89,
    kudosed: false
  },
  {
    id: 'tip-4',
    author: 'Elena',
    authorAge: 28,
    targetAge: 21,
    category: 'travel',
    text: 'Travel solo at least once. It forces you to build confidence, talk to strangers, and figure out who you are outside your comfort bubble.',
    reason: 'I was terrified of being alone but it completely changed my career path.',
    lifestyle: 'Digital Nomad, coffee enthusiast',
    kudos: 15,
    kudosed: false
  },
  {
    id: 'tip-5',
    author: 'Robert',
    authorAge: 58,
    targetAge: 25,
    category: 'health',
    text: 'Slightly slow down your heavy partying habits. Your liver is durable now, but chronic inflammation builds up and manifests as illness at 58.',
    reason: 'Diagnosed with fatty liver and joint issues that could have been avoided.',
    lifestyle: 'Consultant, active cyclist',
    kudos: 54,
    kudosed: false
  }
];

export default function App() {
  // Profile state
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('selfs_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // Tips state
  const [tips, setTips] = useState(() => {
    const saved = localStorage.getItem('selfs_tips');
    return saved ? JSON.parse(saved) : INITIAL_TIPS;
  });

  // UI state
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTimelineAge, setSelectedTimelineAge] = useState(25);

  // Form state
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingDob, setOnboardingDob] = useState('');
  const [onboardingLifestyle, setOnboardingLifestyle] = useState('');
  const [onboardingError, setOnboardingError] = useState('');

  // Write Tip Form state
  const [tipText, setTipText] = useState('');
  const [tipTargetAge, setTipTargetAge] = useState(20);
  const [tipCategory, setTipCategory] = useState('health');
  const [tipReason, setTipReason] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Calculate age from DOB helper
  const calculateAge = (dobString) => {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Sync profile to local storage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('selfs_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('selfs_profile');
    }
  }, [profile]);

  // Sync tips to local storage
  useEffect(() => {
    localStorage.setItem('selfs_tips', JSON.stringify(tips));
  }, [tips]);

  // Set default slider value based on user current age
  useEffect(() => {
    if (profile) {
      const defaultTarget = Math.max(13, Math.floor(profile.currentAge - 5));
      setTipTargetAge(defaultTarget);
      
      // Auto-set the active timeline age to the user's current milestone
      if (profile.currentAge <= 18) setSelectedTimelineAge(15);
      else if (profile.currentAge <= 35) setSelectedTimelineAge(25);
      else if (profile.currentAge <= 55) setSelectedTimelineAge(45);
      else setSelectedTimelineAge(65);
    }
  }, [profile]);

  // Handle onboarding submission
  const handleOnboarding = (e) => {
    e.preventDefault();
    if (!onboardingName.trim()) {
      setOnboardingError('Please enter your name.');
      return;
    }
    if (!onboardingDob) {
      setOnboardingError('Please enter your date of birth.');
      return;
    }
    if (!onboardingLifestyle.trim()) {
      setOnboardingError('Please describe your lifestyle.');
      return;
    }

    const age = calculateAge(onboardingDob);
    if (age < 13) {
      setOnboardingError('You must be at least 13 years old to use Self\'s.');
      return;
    }

    const newProfile = {
      name: onboardingName,
      dob: onboardingDob,
      lifestyle: onboardingLifestyle,
      currentAge: age
    };
    setProfile(newProfile);
    setOnboardingError('');
  };

  // Handle logout / reset profile
  const handleResetProfile = () => {
    if (window.confirm('Are you sure you want to reset your profile? This will clear your personal feed preferences, but your custom tips will remain.')) {
      setProfile(null);
      setOnboardingName('');
      setOnboardingDob('');
      setOnboardingLifestyle('');
    }
  };

  // Handle Kudos
  const handleKudos = (tipId) => {
    setTips(prevTips => 
      prevTips.map(tip => {
        if (tip.id === tipId) {
          return {
            ...tip,
            kudos: tip.kudosed ? tip.kudos - 1 : tip.kudos + 1,
            kudosed: !tip.kudosed
          };
        }
        return tip;
      })
    );
  };

  // Handle Tip Submission
  const handleCreateTip = (e) => {
    e.preventDefault();
    if (!tipText.trim()) {
      setFormError('Please write your tip.');
      return;
    }
    if (tipTargetAge >= profile.currentAge) {
      setFormError(`Target age must be younger than your current age (${profile.currentAge}).`);
      return;
    }
    if (!tipReason.trim()) {
      setFormError('Please provide a reason or context.');
      return;
    }

    const newTipObj = {
      id: `custom-tip-${Date.now()}`,
      author: profile.name,
      authorAge: profile.currentAge,
      targetAge: Number(tipTargetAge),
      category: tipCategory,
      text: tipText,
      reason: tipReason,
      lifestyle: profile.lifestyle,
      kudos: 0,
      kudosed: false
    };

    setTips([newTipObj, ...tips]);
    setTipText('');
    setTipReason('');
    setFormError('');
    setSuccessMessage('Your wisdom has been cast into the past!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  // Helper to determine avatar for any age
  const getAvatarForAge = (age) => {
    if (age <= 18) return AVATAR_MAP[15];
    if (age <= 35) return AVATAR_MAP[25];
    if (age <= 55) return AVATAR_MAP[45];
    return AVATAR_MAP[65];
  };

  // Filter & Search logic
  const filteredTips = useMemo(() => {
    return tips.filter(tip => {
      // 1. Category Filter
      if (activeCategory !== 'all' && tip.category !== activeCategory) {
        return false;
      }

      // 2. Tab Filter
      if (profile) {
        if (activeTab === 'for-me') {
          // Tips written by anyone targeting my current age group
          // Target age matches user's current age (+/- 2 years)
          const ageDiff = Math.abs(tip.targetAge - profile.currentAge);
          if (ageDiff > 2) return false;
        } else if (activeTab === 'from-future') {
          // Advice from the future: author current age is older than mine,
          // and target age matches mine (+/- 3 years)
          const isOlderAuthor = tip.authorAge > profile.currentAge;
          const targetMatchesMine = Math.abs(tip.targetAge - profile.currentAge) <= 3;
          if (!isOlderAuthor || !targetMatchesMine) return false;
        }
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = tip.text.toLowerCase().includes(query);
        const matchesReason = tip.reason.toLowerCase().includes(query);
        const matchesAuthor = tip.author.toLowerCase().includes(query);
        const matchesCategory = tip.category.toLowerCase().includes(query);
        return matchesText || matchesReason || matchesAuthor || matchesCategory;
      }

      return true;
    });
  }, [tips, activeCategory, activeTab, searchQuery, profile]);

  // Render onboarding
  if (!profile) {
    return (
      <div className="onboarding-container">
        <div className="onboarding-card glass-panel">
          <div className="text-center mb-4">
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Self<span className="gradient-text">’s</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Hand down some wisdom. What do you wish your younger self would have known?
            </p>
          </div>

          <form onSubmit={handleOnboarding} style={{ marginTop: '2rem' }}>
            <div className="form-group">
              <label htmlFor="name">What's your name?</label>
              <input 
                type="text" 
                id="name" 
                className="form-input" 
                placeholder="e.g., Steven" 
                value={onboardingName}
                onChange={(e) => setOnboardingName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="dob">What's your date of birth?</label>
              <input 
                type="date" 
                id="dob" 
                className="form-input" 
                value={onboardingDob}
                onChange={(e) => setOnboardingDob(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lifestyle">Describe your lifestyle</label>
              <textarea 
                id="lifestyle" 
                className="form-textarea" 
                placeholder="e.g., Tech developer, heavy coffee drinker, night owl, occasionally runs" 
                value={onboardingLifestyle}
                onChange={(e) => setOnboardingLifestyle(e.target.value)}
              />
            </div>

            {onboardingError && <div className="error-text mb-4">{onboardingError}</div>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              Create My Self <Sparkles size={18} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active avatar file for user based on selection
  const timelineAvatarSrc = AVATAR_MAP[selectedTimelineAge];
  const userCurrentAvatarSrc = getAvatarForAge(profile.currentAge);

  return (
    <div>
      {/* App Header */}
      <header className="app-header">
        <a className="logo" onClick={() => { setActiveTab('all'); setActiveCategory('all'); setSearchQuery(''); }}>
          <span>Self<span className="gradient-text">’s</span></span>
        </a>

        <div className="user-profile-header">
          <div className="user-profile-info">
            <span className="name">{profile.name}</span>
            <span className="age">{profile.currentAge} years old</span>
          </div>
          <div className="profile-avatar-circle">
            <img src={userCurrentAvatarSrc} alt="Your profile avatar" />
          </div>
          <button 
            className="btn-close" 
            onClick={handleResetProfile} 
            title="Reset Profile" 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="container">
        
        {/* Personalized Welcome Banner */}
        <div className="glass-card mb-4" style={{ 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(236, 72, 153, 0.05) 100%)',
          borderColor: 'rgba(99, 102, 241, 0.25)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            Hi {profile.name}, welcome back.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '700px' }}>
            Here are a few latest tips that fit your profile context: <strong style={{ color: 'var(--text-primary)' }}>{profile.lifestyle}</strong>. 
            Browse advice from older folks who stood where you are standing now.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          
          {/* Left Column: Sidebar Widgets */}
          <div className="sidebar-panel">
            
            {/* Interactive Timeline Widget */}
            <div className="aging-timeline-widget glass-card">
              <div className="aging-timeline-header">
                <h3>Your Simulated Self</h3>
                <p>AI-generated profile preview through the years</p>
              </div>

              {/* Central Large Avatar display */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                marginBottom: '1.5rem',
                padding: '1.5rem',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255, 255, 255, 0.04)'
              }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  borderRadius: '50%', 
                  overflow: 'hidden', 
                  border: '3px solid var(--primary)',
                  boxShadow: '0 0 20px var(--primary-glow)',
                  marginBottom: '1rem',
                  transition: 'var(--transition-bounce)'
                }}>
                  <img src={timelineAvatarSrc} alt="AI Aged preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {profile.name} at {selectedTimelineAge}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {selectedTimelineAge === 15 && 'The teenager years — full of fire & uncertainty'}
                  {selectedTimelineAge === 25 && 'The 20s — laying down foundations & exploring'}
                  {selectedTimelineAge === 45 && 'The 40s — stabilizing career & family'}
                  {selectedTimelineAge === 65 && 'The 60s — reflecting & passing down wisdom'}
                </div>
              </div>

              {/* Selector Track */}
              <div className="avatar-timeline-track">
                <div 
                  className={`timeline-milestone ${selectedTimelineAge === 15 ? 'active' : ''}`}
                  onClick={() => setSelectedTimelineAge(15)}
                >
                  <div className="timeline-milestone-avatar">
                    <img src={AVATAR_MAP[15]} alt="Teenager icon" />
                  </div>
                  <div className="timeline-milestone-info">
                    <span className="age-label">Age 15</span>
                    <span className="status-tag">Teenager</span>
                  </div>
                </div>

                <div 
                  className={`timeline-milestone ${selectedTimelineAge === 25 ? 'active' : ''}`}
                  onClick={() => setSelectedTimelineAge(25)}
                >
                  <div className="timeline-milestone-avatar">
                    <img src={AVATAR_MAP[25]} alt="25 icon" />
                  </div>
                  <div className="timeline-milestone-info">
                    <span className="age-label">Age 25</span>
                    <span className="status-tag">Young Adult</span>
                  </div>
                </div>

                <div 
                  className={`timeline-milestone ${selectedTimelineAge === 45 ? 'active' : ''}`}
                  onClick={() => setSelectedTimelineAge(45)}
                >
                  <div className="timeline-milestone-avatar">
                    <img src={AVATAR_MAP[45]} alt="45 icon" />
                  </div>
                  <div className="timeline-milestone-info">
                    <span className="age-label">Age 45</span>
                    <span className="status-tag">Middle Aged</span>
                  </div>
                </div>

                <div 
                  className={`timeline-milestone ${selectedTimelineAge === 65 ? 'active' : ''}`}
                  onClick={() => setSelectedTimelineAge(65)}
                >
                  <div className="timeline-milestone-avatar">
                    <img src={AVATAR_MAP[65]} alt="65 icon" />
                  </div>
                  <div className="timeline-milestone-info">
                    <span className="age-label">Age 65</span>
                    <span className="status-tag">Elderly</span>
                  </div>
                </div>
              </div>
            </div>

            {/* "Send Back Knowledge" Form */}
            <div className="send-knowledge-widget glass-card">
              <div className="send-knowledge-header">
                <h3>Hey there, you old fart.</h3>
                <p>Send back knowledge to your younger self</p>
              </div>

              <form onSubmit={handleCreateTip}>
                <div className="age-slider-container">
                  <div className="age-slider-label">
                    <span>Send back knowledge to:</span>
                    <strong style={{ color: 'var(--primary-light)', fontSize: '1rem' }}>
                      {tipTargetAge} years old
                    </strong>
                  </div>
                  <input 
                    type="range" 
                    min="13" 
                    max={Math.max(13, profile.currentAge - 1)} 
                    value={tipTargetAge} 
                    className="age-range-input"
                    onChange={(e) => setTipTargetAge(Number(e.target.value))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span>Age 13</span>
                    <span>Age {profile.currentAge - 1}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <div className="form-category-grid">
                    {CATEGORIES.slice(1).map(cat => {
                      const IconComponent = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          className={`category-option-btn ${tipCategory === cat.id ? `active ${cat.colorClass}` : ''}`}
                          onClick={() => setTipCategory(cat.id)}
                        >
                          <IconComponent size={14} />
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tip-message">What is your tip?</label>
                  <textarea 
                    id="tip-message" 
                    className="form-input" 
                    placeholder="e.g., Don't waste money on things that depreciate. Invest early..." 
                    style={{ minHeight: '80px', fontSize: '0.9rem' }}
                    value={tipText}
                    onChange={(e) => setTipText(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tip-reason">Why? (Context / Reason)</label>
                  <textarea 
                    id="tip-reason" 
                    className="form-input" 
                    placeholder="e.g., I lost my house because I didn't save." 
                    style={{ minHeight: '60px', fontSize: '0.85rem' }}
                    value={tipReason}
                    onChange={(e) => setTipReason(e.target.value)}
                  />
                </div>

                {formError && <div className="error-text mb-4">{formError}</div>}
                {successMessage && (
                  <div style={{ color: 'var(--accent-health)', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500 }}>
                    {successMessage}
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%', fontSize: '0.9rem' }}>
                  Cast Wisdom Back <Send size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Main Feed */}
          <div className="feed-panel">
            
            {/* Search Bar */}
            <div className="search-box-container">
              <Search className="search-box-icon" size={18} />
              <input 
                type="text" 
                className="search-box-input" 
                placeholder="Search tips, context, or authors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="category-filters-container">
              {CATEGORIES.map(cat => {
                const IconComponent = cat.icon;
                return (
                  <button 
                    key={cat.id} 
                    className={`filter-pill ${activeCategory === cat.id ? `active ${cat.colorClass}` : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                  >
                    <IconComponent size={14} />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Feed Filter Tabs */}
            <div className="feed-tabs-header">
              <button 
                className={`feed-tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Wisdom
              </button>
              <button 
                className={`feed-tab ${activeTab === 'for-me' ? 'active' : ''}`}
                onClick={() => setActiveTab('for-me')}
              >
                Tips for My Age ({profile.currentAge})
              </button>
              <button 
                className={`feed-tab ${activeTab === 'from-future' ? 'active' : ''}`}
                onClick={() => setActiveTab('from-future')}
              >
                Tips from the Future
              </button>
            </div>

            {/* Tips Stream */}
            <div className="tips-feed-container">
              {filteredTips.length > 0 ? (
                filteredTips.map((tip) => {
                  const CategoryIcon = CATEGORIES.find(c => c.id === tip.category)?.icon || Sparkles;
                  return (
                    <div key={tip.id} className={`wisdom-card glass-card ${tip.category}`}>
                      
                      <div className="wisdom-card-header">
                        <div className="wisdom-card-meta">
                          <span className={`category-badge ${tip.category}`}>
                            {tip.category}
                          </span>
                          <span className="age-transfer-badge">
                            Wished my <strong>{tip.targetAge}</strong> self knew...
                          </span>
                        </div>
                        <div className="wisdom-card-author">
                          <div className="wisdom-card-author-avatar">
                            <img src={getAvatarForAge(tip.authorAge)} alt={tip.author} />
                          </div>
                          <div className="wisdom-card-author-info">
                            <div className="wisdom-card-author-name">
                              {tip.author}, now {tip.authorAge}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="wisdom-card-body">
                        <p className="wisdom-tip-text">“{tip.text}”</p>
                        <p className="wisdom-reason-box">
                          <strong>Context:</strong> {tip.reason}
                        </p>
                      </div>

                      <div className="wisdom-card-footer">
                        <div className="lifestyle-context" title={tip.lifestyle}>
                          <span>Lifestyle: {tip.lifestyle}</span>
                        </div>
                        <button 
                          className={`kudos-btn ${tip.kudosed ? 'active' : ''}`}
                          onClick={() => handleKudos(tip.id)}
                        >
                          <Smile size={14} />
                          <span>Kudos • {tip.kudos}</span>
                        </button>
                      </div>

                    </div>
                  );
                })
              ) : (
                <div className="feed-empty-state">
                  <BookOpen size={48} strokeWidth={1} />
                  <h4 style={{ fontWeight: 600, marginTop: '1rem', marginBottom: '0.25rem' }}>No wisdom found</h4>
                  <p>
                    {activeTab === 'from-future' 
                      ? 'Nobody older than you has posted advice targeting your age group yet.' 
                      : activeTab === 'for-me'
                      ? `No tips found targeting exactly age ${profile.currentAge}. Try casting knowledge to yourself!`
                      : 'No tips fit your current filters or search terms.'}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
