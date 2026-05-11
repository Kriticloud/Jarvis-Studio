import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Sparkles, 
  Layout, 
  Palette, 
  Type as TypeIcon, 
  Smartphone, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Dna,
  Zap,
  Download,
  Share2,
  ChevronRight,
  Menu,
  X,
  Layers,
  History,
  Star
} from 'lucide-react';
import { cn } from './lib/utils';
import { analyzeWebsiteContent, generateVisualInspiration } from './services/aiService';
import ReactMarkdown from 'react-markdown';

// --- Types ---
interface AnalysisData {
  score: number;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    uxIssues: string[];
    trustLevel: string;
    conversionPotential: string;
  };
  redesign: {
    strategy: string;
    heroSection: {
      headline: string;
      subheadline: string;
      cta: string;
      visualConcept: string;
    };
    colorPalette: {
      primary: string;
      secondary: string;
      accent: string;
      neutral: string;
      rationale: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      rationale: string;
    };
    sections: Array<{
      name: string;
      purpose: string;
      layout: string;
    }>;
  };
  branding: {
    mood: string;
    positioning: string;
    tone: string;
  };
}

// --- Components ---

const GlassCard = ({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={cn("glass rounded-3xl p-6 transition-all duration-300 hover:border-cyan-500/30 group", className)}
  >
    {children}
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group relative",
      active ? "bg-white/10 text-white shadow-xl" : "text-white/40 hover:bg-white/5 hover:text-cyan-400"
    )}
  >
    {active && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-cyan-400 rounded-full" />}
    <Icon size={18} className={cn("transition-colors", active ? "text-cyan-400" : "group-hover:text-cyan-400")} />
    <span className="text-xs font-semibold tracking-wide uppercase">{label}</span>
  </button>
);

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [visualMockup, setVisualMockup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('analysis');
  const [error, setError] = useState<string | null>(null);

  const analysisSteps = [
    "Scanning website structure...",
    "Analyzing visual hierarchy...",
    "Evaluating UI/UX quality...",
    "Detecting brand positioning...",
    "Generating redesign strategy...",
    "Crafting modern design system...",
    "Generating visual inspiration..."
  ];

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setAnalysisStep(0);
    setError(null);

    // Progression animation for UI feel
    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 2000);

    try {
      // Step 1: Fetch via backend
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!res.ok) {
        throw new Error("Failed to reach website. Scrapers might be blocked.");
      }
      
      const siteData = await res.json();

      // Step 2: AI Analysis
      const analysis = await analyzeWebsiteContent(siteData);
      if (!analysis) throw new Error("AI failed to generate analysis structure.");
      setData(analysis);

      // Step 3: Visual Mockup
      try {
        const mockup = await generateVisualInspiration(`${analysis.branding.mood} ${analysis.redesign.strategy}`);
        setVisualMockup(mockup);
      } catch (mockupErr) {
        console.warn("Visual mockup generation failed, but analysis is complete.", mockupErr);
      }

      setView('dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setIsAnalyzing(false);
    } finally {
      clearInterval(interval);
      if (!error) setIsAnalyzing(false);
    }
  };

  if (view === 'landing') {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-cyan-600/10 blur-[120px] rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-violet-600/5 blur-[100px] rounded-full -ml-20 -mb-20" />
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 w-full p-8 flex justify-between items-center z-10 px-12 h-20 bg-[#020204]/40 backdrop-blur-md">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45 shadow-glow" />
            </div>
            <span className="text-xl font-bold tracking-tight uppercase">Jarvis <span className="text-cyan-400 font-light italic">Studio</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
            <a href="#" className="hover:text-cyan-400 transition-colors">Showcase</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Pricing</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Enterprise</a>
            <button className="glass px-6 py-2 rounded-full text-white hover:bg-white/10 transition-all border-white/10">Sign In</button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 text-center max-w-5xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 mb-10 text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-400">
              <Sparkles size={12} />
              AI Concept Generation v2.8
            </div>
            <h1 className="text-7xl md:text-9xl font-light tracking-tighter mb-10 leading-[0.85]">
              Intelligent <br />
              <span className="font-serif italic text-cyan-500">Quantum</span> Flow
            </h1>
            <p className="text-lg text-white/40 font-light mb-14 max-w-2xl mx-auto leading-relaxed">
              Experience the future of logistics with an AI-driven interface designed for ultimate speed and visual clarity. Premium, fast, and fully responsive.
            </p>

            <form onSubmit={handleAnalyze} className="relative max-w-3xl mx-auto group">
              <div className="relative flex items-center p-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-cyan-400/30 transition-all backdrop-blur-md shadow-[0_0_50px_-12px_rgba(14,165,233,0.2)]">
                <div className="pl-4 text-white/20">
                  <span className="text-sm font-light">https://</span>
                </div>
                <input
                  type="url"
                  placeholder="quantum-logistics.io"
                  className="w-full bg-transparent border-none outline-none px-4 py-4 text-white placeholder:text-white/20 text-lg font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  disabled={isAnalyzing}
                  className="bg-cyan-500 text-black px-10 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? "Processing..." : "Redesign"}
                </button>
              </div>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-3 justify-center"
                >
                  <AlertCircle size={14} />
                  {error}
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>

        {/* Analysis Loading Screen */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
            >
              <div className="relative mb-12">
                <div className="w-24 h-24 rounded-full border-4 border-white/5 border-t-white animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="text-white animate-pulse" size={32} />
                </div>
              </div>
              
              <div className="text-center max-w-md">
                <p className="text-2xl font-serif mb-4 gradient-text">{analysisSteps[analysisStep]}</p>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white"
                    initial={{ width: 0 }}
                    animate={{ width: `${(analysisStep + 1) / analysisSteps.length * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  {analysisSteps.map((step, i) => (
                    <div key={i} className={cn("flex items-center gap-2 text-xs transition-opacity duration-500", i <= analysisStep ? "opacity-100" : "opacity-20")}>
                      <CheckCircle2 size={12} className={i < analysisStep ? "text-green-500" : "text-white"} />
                      <span className="font-mono uppercase tracking-wider">{step.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="absolute bottom-12 text-white/20 text-[10px] font-mono tracking-[0.3em] uppercase">
          Autonomous AI Design Engine — Jarvis v1.0
        </div>
      </div>
    );
  }

  // --- Dashboard View ---
  return (
    <div className="flex h-screen bg-[#020204] overflow-hidden font-sans text-[#E0E0E6]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 bg-[#050508] z-20">
        <div className="flex items-center gap-3 mb-12 px-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-lg font-bold tracking-tight uppercase">Jarvis <span className="text-cyan-400 font-light italic">Studio</span></span>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={BarChart3} label="Analysis" active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
          <SidebarItem icon={Layout} label="Redesign" active={activeTab === 'redesign'} onClick={() => setActiveTab('redesign')} />
          <SidebarItem icon={Palette} label="Design System" active={activeTab === 'system'} onClick={() => setActiveTab('system')} />
          <SidebarItem icon={Dna} label="Branding" active={activeTab === 'branding'} onClick={() => setActiveTab('branding')} />
          <SidebarItem icon={Smartphone} label="Mobile UX" active={activeTab === 'mobile'} onClick={() => setActiveTab('mobile')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all group">
            <div className="flex items-center gap-3">
              <Download size={16} className="text-white/40 group-hover:text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Export Data</span>
            </div>
            <ChevronRight size={14} className="text-white/20" />
          </button>
          <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-violet-500/10 border border-white/10 group overflow-hidden relative">
            <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-3">Enterprise</p>
            <p className="text-xs text-white/50 mb-5 leading-relaxed">Custom styling, API access, and team collaboration.</p>
            <button className="w-full py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-cyan-50 transition-all">Go Pro</button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-[#020204] p-12">
        {/* Atmosphere */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-cyan-600/5 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-violet-600/5 blur-[100px] rounded-full -ml-20 -mb-20 pointer-events-none" />

        {/* Top Navigation */}
        <header className="relative flex justify-between items-center mb-16 z-10">
          <div className="flex-1 max-w-2xl bg-white/5 border border-white/10 rounded-2xl h-14 flex items-center px-6 backdrop-blur-sm mr-8 group focus-within:border-cyan-400/30 transition-all">
            <Globe size={14} className="text-white/20 mr-3" />
            <span className="text-white/30 text-sm font-light">https://</span>
            <span className="text-white font-medium truncate">{url.replace(/^https?:\/\//, '')}</span>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 animate-pulse hidden md:block">Processing Active</span>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button 
                onClick={() => setView('landing')}
                className="bg-cyan-500 text-black px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-400 transition-all"
              >
                Redesign
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="glass flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all border-white/10">
              <Share2 size={16} className="text-cyan-400" /> Share
            </button>
            <button className="bg-[#1a1a1f] text-white border border-white/10 flex items-center gap-2 px-8 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-cyan-400/50 transition-all">
              Figma Sync
            </button>
          </div>
        </header>

        {/* Dashboard Sections */}
        <div className="relative max-w-7xl mx-auto space-y-16 pb-24 z-10">
          
          {activeTab === 'analysis' && data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <GlassCard className="col-span-1 md:col-span-4 flex flex-col justify-center items-center text-center py-16 bg-gradient-to-b from-white/[0.03] to-transparent">
                  <div className="relative w-40 h-40 mb-8">
                    <svg className="w-full h-full transform -rotate-90 scale-110">
                      <circle cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                      <motion.circle 
                        cx="80" cy="80" r="74" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={464.7}
                        initial={{ strokeDashoffset: 464.7 }}
                        animate={{ strokeDashoffset: 464.7 * (1 - data.score / 100) }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="text-cyan-400"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-light">{data.score}<span className="text-cyan-400 text-3xl">%</span></span>
                      <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-1 font-bold">Premium Rate</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-400">Analysis Mode</p>
                    <p className="text-sm text-white/50 italic font-serif">"{data.analysis.trustLevel} Trust Integrity"</p>
                  </div>
                </GlassCard>

                <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard className="flex flex-col border-green-500/20 bg-green-500/[0.02]">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                        <CheckCircle2 size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/50">Core Strengths</span>
                    </div>
                    <ul className="space-y-4 flex-1">
                      {data.analysis.strengths.map((item, i) => (
                        <li key={i} className="text-sm text-white/60 flex gap-3">
                          <span className="text-green-500 font-mono">0{i+1}</span> {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>

                  <GlassCard className="flex flex-col border-red-500/20 bg-red-500/[0.02]">
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <AlertCircle size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-red-500/50">Vulnerabilities</span>
                    </div>
                    <ul className="space-y-4 flex-1">
                      {data.analysis.weaknesses.map((item, i) => (
                        <li key={i} className="text-sm text-white/60 flex gap-3">
                          <span className="text-red-500 font-mono">0{i+1}</span> {item}
                        </li>
                      ))}
                    </ul>
                  </GlassCard>
                </div>
              </div>

              <GlassCard className="bg-white/[0.01]">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-1.5 h-6 bg-cyan-400 rounded-full" />
                  <h3 className="font-light text-2xl uppercase tracking-wider">UX Enhancement Detect</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {data.analysis.uxIssues.map((issue, i) => (
                    <div key={i} className="group cursor-default">
                      <p className="text-[10px] text-cyan-400 font-bold mb-3 uppercase tracking-[0.3em]">Module {i+1}</p>
                      <div className="h-px w-full bg-white/10 mb-4 group-hover:bg-cyan-500/50 transition-all" />
                      <p className="text-sm leading-relaxed text-white/50 group-hover:text-white transition-colors">{issue}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeTab === 'redesign' && data && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-7 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-cyan-400">Design Vision #042</h3>
                  <h2 className="text-6xl font-light leading-[1.1] tracking-tight">
                    {data.redesign.heroSection.headline.split(' ').map((word, i) => 
                      i % 2 === 1 ? <span key={i} className="font-serif italic text-cyan-500"> {word} </span> : word + ' '
                    )}
                  </h2>
                  <p className="text-lg font-light text-white/40 leading-relaxed max-w-xl italic">
                    "{data.redesign.strategy}"
                  </p>
                  
                  <div className="flex gap-6 pt-6">
                    <button className="h-14 px-10 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-cyan-50 transition-all shadow-glow">
                      {data.redesign.heroSection.cta}
                    </button>
                    <button className="h-14 w-14 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-cyan-400 transition-all">
                      <Zap size={20} className="text-white fill-white" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <GlassCard className="bg-white/5 border-white/10">
                      <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mb-4">Hero Structure</div>
                      <p className="text-sm font-medium text-white/80 leading-relaxed">
                        {data.redesign.heroSection.subheadline}
                      </p>
                   </GlassCard>
                   <GlassCard className="bg-white/5 border-white/10">
                      <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold mb-4">Visual Philosophy</div>
                      <p className="text-sm font-medium text-white/80 leading-relaxed">
                        {data.redesign.heroSection.visualConcept}
                      </p>
                   </GlassCard>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/30 mb-6">Component Architecture</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.redesign.sections.map((section, i) => (
                      <div key={i} className="flex items-center gap-5 p-5 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all group">
                        <div className="w-14 h-14 rounded-2xl glass-darker flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                          {i === 0 ? <Layout size={20} /> : i === 1 ? <Layers size={20} /> : i === 2 ? <Search size={20} /> : <Zap size={20} />}
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-0.5">{section.layout}</p>
                          <p className="font-semibold text-white/90">{section.name}</p>
                        </div>
                        <ChevronRight size={14} className="ml-auto text-white/10 group-hover:text-white transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-8">
                <div className="relative aspect-[3/4] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group">
                  {visualMockup ? (
                    <>
                      <img 
                        src={visualMockup} 
                        alt="AI Redesign Concept" 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-10 left-10 text-[10px] font-bold uppercase tracking-[0.4em] px-4 py-2 bg-black/40 backdrop-blur-xl rounded-full border border-white/10 text-cyan-400">
                        Render Concept #042
                      </div>
                      <div className="absolute bottom-12 left-10 right-10">
                         <div className="w-12 h-1 bg-cyan-500 rounded-full mb-6" />
                         <h4 className="text-3xl font-serif mb-4 leading-tight">Quantum Logistics <br/> <span className="italic text-white/60">Digital Evolution</span></h4>
                         <p className="text-sm text-white/40 leading-relaxed italic">Generated based on industry analysis of premium corporate logistics patterns.</p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/[0.02] bg-[#050508]">
                      <Sparkles size={80} className="animate-pulse mb-6 text-white/5" />
                      <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/10">Synthesizing Vision...</p>
                    </div>
                  )}
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'system' && data && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 border-r border-white/5 pr-8">
                   <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-cyan-400 mb-8">System Rationale</h3>
                   <div className="space-y-10">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Chromatic Palette</p>
                        <p className="text-sm text-white/50 leading-relaxed italic">"{data.redesign.colorPalette.rationale}"</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">Typographic Pairing</p>
                        <p className="text-sm text-white/50 leading-relaxed italic">"{data.redesign.typography.rationale}"</p>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-2 space-y-12">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Primary', color: data.redesign.colorPalette.primary },
                      { label: 'Secondary', color: data.redesign.colorPalette.secondary },
                      { label: 'Accent', color: data.redesign.colorPalette.accent },
                      { label: 'Neutral', color: data.redesign.colorPalette.neutral }
                    ].map((c, i) => (
                      <div key={i} className="group cursor-pointer">
                        <div className="w-full h-24 rounded-[1.5rem] border border-white/10 mb-4 transition-transform group-hover:scale-105" style={{ backgroundColor: c.color.startsWith('#') || c.color.startsWith('rgb') ? c.color : '#fff' }} />
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{c.label}</p>
                        <p className="text-xs font-bold text-white uppercase">{c.color}</p>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-8">
                    <div className="p-10 rounded-[2.5rem] glass-darker border-white/10 flex flex-col md:flex-row items-baseline justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-mono text-cyan-400 mb-4 uppercase tracking-[0.4em]">Heading / {data.redesign.typography.headingFont}</p>
                        <h4 className="text-7xl font-light tracking-tighter">Immersive.</h4>
                      </div>
                      <span className="text-sm text-white/20 italic font-serif">Display Weight // 300</span>
                    </div>
                    <div className="p-10 rounded-[2.5rem] glass border-white/5 flex flex-col md:flex-row items-baseline justify-between gap-6">
                      <div>
                        <p className="text-[10px] font-mono text-cyan-400 mb-4 uppercase tracking-[0.4em]">Accent / Cormorant Garamond</p>
                        <h4 className="text-4xl font-serif italic text-white/80">Elegance in Quantum.</h4>
                      </div>
                      <span className="text-sm text-white/20 italic font-serif">Serif Weight // 400</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'branding' && data && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'Brand Mood', value: data.branding.mood, icon: Star },
                  { label: 'Positioning', value: data.branding.positioning, icon: Share2 },
                  { label: 'Tone of Voice', value: data.branding.tone, icon: Menu }
                ].map((item, i) => (
                  <GlassCard key={i} className="text-center py-16 hover:bg-white/[0.02]">
                    <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-cyan-400/60 transition-transform group-hover:scale-110">
                      <item.icon size={28} />
                    </div>
                    <p className="text-[10px] font-bold text-white/30 mb-3 uppercase tracking-[0.4em]">{item.label}</p>
                    <p className="text-4xl font-light tracking-tight">{item.value}</p>
                  </GlassCard>
                ))}
              </div>

              <div className="bg-gradient-to-br from-cyan-500/[0.03] to-violet-500/[0.03] border border-white/10 rounded-[3rem] p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 blur-[100px] rounded-full -mr-32 -mt-32" />
                <div className="max-w-3xl relative z-10">
                  <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/20 mb-8">Branding Strategy V2</h3>
                  <div className="space-y-10">
                    <p className="text-4xl font-light leading-tight">
                      Jarvis detects a <span className="text-cyan-400">Shift</span> from <span className="text-white/40 italic">Generic Corporate</span> towards <span className="text-white italic underline underline-offset-8 decoration-cyan-500/50">Elite Digital Narrative</span>.
                    </p>
                    <p className="text-lg text-white/40 leading-relaxed">
                      "The current positioning lacks emotional depth. By adopting a <span className="text-white">'{data.branding.mood}'</span> aesthetic, 
                      Quantum Logistics can command a <span className="text-cyan-300">34% higher trust premium</span> within the high-value logistics market."
                    </p>
                    <div className="flex gap-6 mt-10">
                      <button className="bg-white text-black px-10 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs hover:bg-cyan-50 transition-all">Manifesto Copy</button>
                      <button className="glass px-10 py-4 rounded-2xl font-bold uppercase tracking-wider text-xs border-white/10 hover:bg-white/5">Mood Spectrum</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'mobile' && data && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col lg:flex-row gap-20 items-center">
              <div className="flex-1 space-y-12">
                <div>
                  <h3 className="text-[10px] font-bold tracking-[0.5em] uppercase text-cyan-400 mb-6">Mobile UX Paradigm</h3>
                  <h2 className="text-6xl font-light tracking-tighter leading-[1.1] mb-10">
                    Touch-Native <br />
                    <span className="font-serif italic text-white/40">Responsive Flux.</span>
                  </h2>
                  <div className="space-y-6">
                     {[
                       "Quantum-sheet navigation for thumb-restricted precision.",
                       "Vertical component stacking for high-velocity scrolling.",
                       "Immersive fullscreen imagery with parallax micro-interactions.",
                       "Fluid typography scaling for cross-viewport integrity."
                     ].map((item, i) => (
                       <div key={i} className="flex gap-6 items-start group">
                         <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-mono text-cyan-400 group-hover:bg-cyan-500/10 group-hover:scale-110 transition-all">0{i+1}</div>
                         <p className="text-base text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">{item}</p>
                       </div>
                     ))}
                  </div>
                </div>
                <button className="w-full lg:w-auto bg-cyan-500 text-black px-12 py-5 rounded-[2rem] font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:bg-cyan-400 transition-all shadow-glow">
                   Preview Mobile Experience <ChevronRight size={18} />
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-cyan-400/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                {/* iPhone Pro Frame Style */}
                <div className="w-[320px] h-[660px] rounded-[3.5rem] border-[12px] border-[#1a1a1f] overflow-hidden bg-black relative shadow-2xl z-10 transition-transform duration-700 group-hover:rotate-2">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a1f] rounded-b-3xl z-20" />
                   <div className="w-full h-full pt-12 overflow-hidden bg-[#020204]">
                      {visualMockup && (
                        <div className="w-full h-full relative overflow-hidden translate-y-4">
                           <img src={visualMockup} className="w-full h-full object-cover scale-[1.8] translate-y-10 group-hover:scale-[1.9] transition-transform duration-1000" />
                           <div className="absolute inset-x-6 bottom-10 rounded-[2rem] glass-darker p-6 text-center border-white/20">
                              <p className="text-xl font-serif italic mb-4 leading-tight">{data.redesign.heroSection.headline}</p>
                              <div className="w-full py-3 rounded-xl bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-[0.3em]">{data.redesign.heroSection.cta}</div>
                           </div>
                           <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#020204] to-transparent pointer-events-none" />
                        </div>
                      )}
                   </div>
                </div>
                {/* Floating Metrics */}
                <motion.div 
                  className="absolute -right-20 top-20 glass-darker p-5 rounded-3xl z-20 border-cyan-500/20"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                   <div className="flex items-center gap-3 mb-4">
                     <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                     <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60">Flow Integrity</span>
                   </div>
                   <div className="space-y-2">
                     <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-cyan-400" initial={{ width: 0 }} animate={{ width: '88%' }} transition={{ delay: 1, duration: 1.5 }} />
                     </div>
                     <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div className="h-full bg-violet-400" initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ delay: 1.2, duration: 1.5 }} />
                     </div>
                   </div>
                </motion.div>
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
}
