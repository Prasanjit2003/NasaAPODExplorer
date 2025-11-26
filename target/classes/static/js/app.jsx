// Requires React + ReactDOM + Tailwind loaded in index.html

const { useState, useEffect, useRef, useMemo, Component } = React;

/* ---------------- ICONS ---------------- */
const Icons = {
  Rocket: () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.1 4-1 4-1S10 10 9 12z"/><path d="M12 15v5s3.03-.55 4-2c1.1-1.62 1-4 1-4s-2 0-2 1z"/></svg>),
  Play: () => (<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>),
  Stop: () => (<svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12"/></svg>),
  Heart: ({fill}) => (<svg width="20" height="20" fill={fill ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
  Share: () => (<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>),
  Download: () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  ChevronLeft: () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>),
  ChevronRight: () => (<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>),
  Expand: () => (<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>),
  Close: () => (<svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>)
};

/* ---------------- Share Modal (unchanged) ---------------- */
function ShareModal({ open, onClose, title, url, text }) {
  if (!open) return null;
  const encodedUrl = encodeURIComponent(url || '');
  const encodedText = encodeURIComponent(((text || '').slice(0,200) + ' ' + (url || '')).trim());
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || '')}&url=${encodedUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodedText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title || 'Check this')}&body=${encodeURIComponent((text || '') + '\n\n' + url)}`;
  const instagramUrl = `https://www.instagram.com/`;
  const [toast, setToast] = useState(null);
  useEffect(()=>{ if(!open) setToast(null); },[open]);
  const copyLink = async ()=> {
    try { await navigator.clipboard.writeText(url); setToast('Link copied'); setTimeout(()=>setToast(null),1500); }
    catch(e){ const ta=document.createElement('textarea'); ta.value=url; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); setToast('Link copied'); setTimeout(()=>setToast(null),1500); }
  };
  return (
    <div className="share-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="share-sheet" onClick={e=>e.stopPropagation()}>
        <div className="share-title">Share</div>
        <div className="share-grid">
          <a className="share-btn" href={whatsappUrl} target="_blank" rel="noreferrer noopener" title="WhatsApp">📱<div className="share-label">WhatsApp</div></a>
          <a className="share-btn" href={twitterUrl} target="_blank" rel="noreferrer noopener" title="Twitter">🐦<div className="share-label">Twitter</div></a>
          <a className="share-btn" href={facebookUrl} target="_blank" rel="noreferrer noopener" title="Facebook">📘<div className="share-label">Facebook</div></a>
          <a className="share-btn" href={emailUrl} title="Email">✉️<div className="share-label">Email</div></a>
          <a className="share-btn" href={instagramUrl} target="_blank" rel="noreferrer noopener" title="Instagram">📸<div className="share-label">Instagram</div></a>
          <button className="share-btn" onClick={copyLink} title="Copy link">🔗<div className="share-label">Copy link</div></button>
        </div>
        <div style={{marginTop:12,textAlign:'center'}}><button onClick={onClose} className="glass px-4 py-2 rounded-md" style={{background:'transparent',border:'1px solid rgba(255,255,255,0.06)'}}>Close</button></div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    </div>
  );
}

/* ---------------- Fullscreen Viewer ---------------- */
function FullscreenViewer({ open, onClose, media }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    // request browser fullscreen if available on the container
    const el = ref.current;
    const tryFullscreen = async () => {
      try {
        if (el && el.requestFullscreen) await el.requestFullscreen();
      } catch (e) {
        // ignore
      }
    };
    tryFullscreen();

    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    // cleanup: exit fullscreen if we opened it
    return () => {
      window.removeEventListener('keydown', handleKey);
      if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(()=>{});
    };
  }, [open]);

  if (!open || !media) return null;

  return (
    <div className="fullscreen-overlay" ref={ref} onClick={onClose}>
      {media.media_type === 'video' ? (
        <iframe className="fullscreen-media" src={media.url} allowFullScreen title={media.title} onClick={e=>e.stopPropagation()} />
      ) : (
        <img className="fullscreen-media" src={media.hdurl || media.url} alt={media.title} onClick={e=>e.stopPropagation()} />
      )}
      <button className="fullscreen-close" onClick={(e)=>{ e.stopPropagation(); onClose(); }}>
        <Icons.Close /> Close
      </button>
    </div>
  );
}

/* ---------------- Background ---------------- */
const WarpBackground = () => {
  const stars = useMemo(() => Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    angle: Math.random() * 360,
    duration: Math.random() * 1 + 0.5 + 's',
    delay: Math.random() * 2 + 's'
  })), []);
  return (
    <div className="warp-container" aria-hidden>
      {stars.map(s => <div key={s.id} className="star" style={{ transform: `rotate(${s.angle}deg) translate(0, 0)`, '--duration': s.duration, animationDelay: s.delay }} />)}
    </div>
  );
};

/* ---------------- Navbar ---------------- */
const Navbar = ({ currentView, navigate }) => (
  <nav className="glass fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center">
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
      <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg text-white"><Icons.Rocket /></div>
      <h1 className="text-xl font-bold tracking-wider text-white hidden sm:block">APOD EXPLORER</h1>
      <h1 className="text-xl font-bold tracking-wider text-white sm:hidden">APOD</h1>
    </div>
    <div className="flex gap-2 md:gap-4 text-sm font-semibold">
      <button onClick={() => navigate('home')} className={`px-4 py-2 rounded-lg transition ${currentView === 'home' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-gray-300'}`}>Today</button>
      <button onClick={() => navigate('gallery')} className={`px-4 py-2 rounded-lg transition ${currentView === 'gallery' ? 'bg-purple-600 text-white' : 'hover:bg-slate-700 text-gray-300'}`}>Gallery</button>
      <button onClick={() => navigate('favorites')} className={`px-4 py-2 rounded-lg transition ${currentView === 'favorites' ? 'bg-pink-600 text-white' : 'hover:bg-slate-700 text-gray-300'}`}>Saved</button>
    </div>
  </nav>
);

/* ---------------- MediaViewer (updated) ---------------- */
const MediaViewer = ({ data, addToFavorites, isFavorite, isModal = false }) => {
  const [speaking, setSpeaking] = useState(false);
  const [caption, setCaption] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false); // used for info panel control
  const [shareOpen, setShareOpen] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [fsOpen, setFsOpen] = useState(false); // our fullscreen viewer modal
  const containerRef = useRef(null);

  useEffect(() => { return () => window.speechSynthesis.cancel(); }, []);

  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setCaption("");
    } else {
      setSpeaking(true);
      const sentences = (data.explanation || '').match(/[^.!?]+[.!?]+["']?|[^.!?]+$/g) || [data.explanation || ''];
      let index = 0;
      const speakNext = () => {
        if (index >= sentences.length) { setSpeaking(false); setCaption(""); return; }
        const text = sentences[index];
        setCaption(text.trim());
        const u = new SpeechSynthesisUtterance(text);
        u.onend = () => { index++; speakNext(); };
        u.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      };
      speakNext();
    }
  };

  const toggleFullscreen = () => {
    const elem = containerRef.current;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) elem.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  const handleShare = async () => {
    const shareData = { title: data.title, text: (data.explanation || '').slice(0, 200), url: data.url };
    if (navigator.share && (navigator.maxTouchPoints > 0 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent))) {
      try { await navigator.share(shareData); }
      catch (err) { setShareOpen(true); }
    } else {
      setShareOpen(true);
    }
  };

  const handleDownloadClick = () => {
    // Open the fullscreen-only viewer (user requested behavior)
    setFsOpen(true);
  };

  if (!data) return null;

  const SHORT_LEN = 220;
  const fullDesc = data.explanation || '';
  const shortDesc = fullDesc.length > SHORT_LEN ? fullDesc.slice(0, SHORT_LEN).trim() + '…' : fullDesc;

  return (
    <>
      <div ref={containerRef} className={`relative w-full flex flex-col ${isModal ? 'h-full md:flex-row' : 'lg:flex-row h-auto lg:h-[600px]'} glass rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 bg-slate-900`}>
        {/* Visuals */}
        <div className={`relative bg-black ${isModal ? 'h-[40vh] md:h-full md:w-2/3' : 'w-full lg:w-2/3 h-[350px] lg:h-full'}`}>
          {data.media_type === 'video' ? (
            <iframe src={data.url} className="w-full h-full" allowFullScreen title={data.title}></iframe>
          ) : (
            <img src={data.hdurl || data.url} className={`w-full h-full ${isFullscreen ? 'object-contain' : 'object-cover'}`} alt={data.title} />
          )}

          {/* Plain white subtitle (no background) */}
          {speaking && caption && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center px-4 pointer-events-none z-20">
              <div className="subtitle-box">{caption}</div>
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2 z-30">
            <button onClick={toggleSpeech} className={`p-2 rounded-full backdrop-blur transition ${speaking ? 'bg-amber-500 text-black' : 'bg-black/50 text-white hover:bg-white/20'}`} title="Read Aloud">
              {speaking ? <Icons.Stop /> : <Icons.Play />}
            </button>

            <button onClick={() => addToFavorites(data)} className={`p-2 rounded-full backdrop-blur transition ${isFavorite(data.date) ? 'bg-pink-600 text-white' : 'bg-black/50 text-white hover:bg-white/20'}`} title="Save">
              <Icons.Heart fill={isFavorite(data.date)} />
            </button>

            <button onClick={handleShare} className="p-2 rounded-full bg-black/50 text-white backdrop-blur hover:bg-white/20 transition" title="Share">
              <Icons.Share />
            </button>

            {/* Download: opens fullscreen-only viewer (no description) */}
            <button onClick={handleDownloadClick} className="p-2 rounded-full bg-black/50 text-white backdrop-blur hover:bg-white/20 transition" title="Open image in fullscreen">
              <Icons.Download />
            </button>

            <button onClick={toggleFullscreen} className="p-2 rounded-full bg-black/50 text-white backdrop-blur hover:bg-white/20 transition" title="Toggle fullscreen">
              <Icons.Expand />
            </button>
          </div>

          {data.copyright && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-[10px] text-gray-300 z-30 pointer-events-none border border-white/10">
              © {data.copyright}
            </div>
          )}
        </div>

        {/* Info Panel */}
        {!isFullscreen && (
          <div className={`${isModal ? 'flex-1 md:w-1/3' : 'w-full lg:w-1/3'} p-6 flex flex-col border-t lg:border-t-0 lg:border-l md:border-t-0 md:border-l border-white/10 bg-slate-850/50 overflow-hidden`}>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="mb-4">
                <span className="text-blue-400 font-mono text-xs border border-blue-400 px-2 py-1 rounded">{data.date}</span>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4 leading-tight font-sans">{data.title}</h1>

              {/* Truncated description with Read more */}
              <div className="info-description">
                {descExpanded ? fullDesc : shortDesc}
                {fullDesc.length > shortDesc.length && (
                  <span className="read-more" onClick={() => setDescExpanded(!descExpanded)}>{descExpanded ? 'Show less' : 'Read more'}</span>
                )}
              </div>

              {/* Image credit */}
              <div className="image-credit">
                Image credit: {data.copyright ? `© ${data.copyright}` : 'NASA'}
              </div>
            </div>
          </div>
        )}
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} title={data.title} url={data.url} text={data.explanation} />
      <FullscreenViewer open={fsOpen} onClose={() => setFsOpen(false)} media={data} />
    </>
  );
};

/* ---------------- Detail Modal ---------------- */
const DetailModal = ({ data, onClose, addToFavorites, isFavorite }) => {
  if (!data) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-6xl h-[85vh] relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-gray-400 hover:text-white p-2 bg-white/10 rounded-full"><Icons.Close /></button>
        <MediaViewer data={data} addToFavorites={addToFavorites} isFavorite={isFavorite} isModal={true} />
      </div>
    </div>
  );
};

/* ---------------- HomeView (keeps hero background + behaviour) ---------------- */
const HomeView = ({ currentData, setCurrentData, addToFavorites, isFavorite }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [date, setDate] = useState(currentData ? currentData.date : new Date().toISOString().split('T')[0]);

  // Hero image URL (illustrative astronaut / space).
  const heroUrl = 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=80';

  const fetchData = async (dateVal, retry = false) => {
    setLoading(true);
    setError(null);
    const url = dateVal ? `/api/date?val=${dateVal}` : '/api/today';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const d = await res.json();
      if (d.code) throw new Error(d.msg);
      setCurrentData(d);
      if (d.date) setDate(d.date);
      setLoading(false);
    } catch (e) {
      if (!dateVal && !retry) {
        const y = new Date(); y.setDate(y.getDate() - 1);
        fetchData(y.toISOString().split('T')[0], true);
      } else {
        setLoading(false);
        setError("Unable to load data. Please check your connection.");
      }
    }
  };

  useEffect(() => { if (!currentData) fetchData(); }, []);

  const changeDate = (offset) => {
    const d = new Date(date); d.setDate(d.getDate() + offset);
    const s = d.toISOString().split('T')[0];
    if (s <= new Date().toISOString().split('T')[0]) { setDate(s); fetchData(s); }
  };

  return (
    <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-10 relative">
      <div className="home-hero" style={{ backgroundImage: `url('${heroUrl}')` }} aria-hidden />
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h2 className="text-blue-400 font-bold tracking-wider text-sm uppercase mb-1">Today</h2>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Image Of The Day</h1>
        </div>
        <div className="glass p-1 rounded-lg flex items-center">
          <button onClick={() => changeDate(-1)} className="p-3 hover:text-blue-400"><Icons.ChevronLeft /></button>
          <input type="date" value={date} onChange={(e) => { setDate(e.target.value); fetchData(e.target.value); }} className="bg-transparent border-none outline-none text-white font-mono text-sm text-center w-32 cursor-pointer" />
          <button onClick={() => changeDate(1)} className="p-3 hover:text-blue-400"><Icons.ChevronRight /></button>
        </div>
      </div>

      {loading ? <div className="h-[500px] glass rounded-2xl flex items-center justify-center text-blue-400 animate-pulse font-mono tracking-widest">LOADING...</div> :
        error ? <div className="h-[300px] glass rounded-2xl flex flex-col items-center justify-center text-red-400 gap-4"><p>{error}</p><button onClick={() => fetchData()} className="px-4 py-2 bg-white/10 rounded text-white">Retry</button></div> :
          currentData ? <MediaViewer data={currentData} addToFavorites={addToFavorites} isFavorite={isFavorite} /> : null}
    </div>
  );
};

/* ---------------- GridView + App (unchanged) ---------------- */
const GridView = ({ items, onSelect, title }) => (
  <div className="pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-10">
    <h2 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4 text-white">{title}</h2>
    {(!items || items.length === 0) ? <div className="text-center text-gray-500 py-10 font-mono">NO DATA FOUND.</div> : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <div key={idx} onClick={() => onSelect(item)} className="glass rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 group relative aspect-[4/3]">
            <img src={item.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" alt={item.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-xs text-blue-400 font-mono mb-1">{item.date}</span>
              <h3 className="text-white font-bold text-sm line-clamp-2">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const App = () => {
  const [view, setView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [favorites, setFavorites] = useState(() => { try { return JSON.parse(localStorage.getItem('apod-favs')) || []; } catch { return []; } });
  const [archive, setArchive] = useState([]);

  useEffect(() => {
    const handleHash = () => { setView(window.location.hash.replace('#', '') || 'home'); };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = (v) => window.location.hash = v;

  useEffect(() => { fetch('/api/gallery').then(r => r.json()).then(d => setArchive(Array.isArray(d) ? d.reverse() : [])).catch(() => setArchive([])); }, []);

  const toggleFavorite = (item) => {
    if (!item) return;
    const exists = favorites.find(f => f.date === item.date);
    const newFavs = exists ? favorites.filter(f => f.date !== item.date) : [...favorites, item];
    setFavorites(newFavs);
    localStorage.setItem('apod-favs', JSON.stringify(newFavs));
  };
  const isFav = (d) => !!favorites.find(f => f.date === d);

  class GlobalBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError(error) { return { hasError: true }; }
    render() {
      if (this.state.hasError) return <div className="h-screen flex items-center justify-center text-red-500">Something went wrong. <button onClick={() => window.location.reload()} className="ml-4 underline">Reload</button></div>;
      return this.props.children;
    }
  }

  return (
    <GlobalBoundary>
      <WarpBackground />
      <div className="min-h-screen flex flex-col relative z-10">
        <Navbar currentView={view} navigate={navigate} />
        <main className="flex-1">
          {view === 'home' && <HomeView currentData={currentData} setCurrentData={setCurrentData} addToFavorites={toggleFavorite} isFavorite={isFav} />}
          {view === 'gallery' && <GridView items={archive} onSelect={setSelectedItem} title="Mission Archive" />}
          {view === 'favorites' && <GridView items={favorites} onSelect={setSelectedItem} title="Saved Collections" />}
        </main>
        {selectedItem && <DetailModal data={selectedItem} onClose={() => setSelectedItem(null)} addToFavorites={toggleFavorite} isFavorite={isFav} />}
      </div>
    </GlobalBoundary>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
