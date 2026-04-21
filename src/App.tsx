/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Flame, 
  Dumbbell, 
  Waves, 
  Activity, 
  Leaf, 
  Moon, 
  Heart, 
  Brain, 
  Dna as Gut,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  Shield,
  Eye,
  Search,
  Share2,
  Check,
  ChevronLeft,
  LayoutGrid,
  History,
  X
} from 'lucide-react';

// ============ CONFIG & CONSTANTS ============
const CONFIG = Object.freeze({
  APP_VERSION: '2.0.0',
  MAX_INPUT_LENGTH: 500,
  RATE_LIMIT_MS: 1000,
  STORAGE_PREFIX: 'vs2_'
});

// ============ MOCK AI ENGINE ============
async function callAI(context: string, data: any) {
  console.log('[VitalSim:AI]', context, data);
  await new Promise(res => setTimeout(res, 800));

  const responses: any = {
    crime: {
      verdict: data.healthy ? 'Innocent' : 'Guilty',
      crimes: ['High saturated fat', 'Low fiber content', 'Excess sodium'],
      sentence: 'Add a side salad or walk 20 minutes'
    },
    headline: data.healthy
      ? "Your nutrition is on track — keep the streak alive."
      : "Your diet needs attention. Small changes, big results.",
    future: data.healthy
      ? "Hey, it's future you. You look great. Keep going."
      : "Hey, it's future you. Please — start with breakfast.",
    bioAge: (data.age || 25) + (data.healthy ? -2.4 : 3.1),
    stocks: {
      immunity: data.healthy ? 82 : 54,
      energy: data.healthy ? 76 : 48,
      heart: data.healthy ? 88 : 61,
      brain: data.healthy ? 79 : 65,
      gut: data.healthy ? 71 : 43
    }
  };

  return responses[context] || { message: "Insight generated." };
}

// ============ REUSABLE UI COMPONENTS ============

const SkipLink = () => <a href="#main" className="skip-link">Skip to main content</a>;

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const base = "px-7 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 min-h-[44px]";
  const variants: any = {
    primary: "bg-vital-primary text-white hover:bg-indigo-700 shadow-md hover:shadow-lg active:scale-95",
    secondary: "bg-white border border-vital-primary text-vital-primary hover:bg-indigo-50 active:scale-95",
    ghost: "text-vital-text-muted hover:text-vital-primary hover:bg-vital-panel px-4",
    danger: "bg-vital-danger text-white hover:bg-red-600 shadow-md"
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

const Card = ({ children, className = '', isSelected = false, ...props }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        bg-white border p-6 rounded-2xl cursor-pointer transition-all duration-300 card-shadow
        ${isSelected ? 'border-vital-primary border-2 bg-indigo-50/50' : 'border-vital-border hover:border-vital-border-focus'}
        ${className}
      `}
      {...props}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 bg-vital-primary rounded-full p-1 z-10">
          <Check className="w-3 h-3 text-white stroke-[3px]" />
        </div>
      )}
      {children}
    </motion.div>
  );
};

// ============ SVG ILLUSTRATIONS (DATA DRIVEN) ============

const BioIllustration = ({ type }: { type: string }) => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-indigo-100/50 to-white/50" />
      <svg viewBox="0 0 400 600" className="w-[80%] h-[80%] relative z-10 drop-shadow-xl">
        <defs>
          <radialGradient id="gradCell" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {type === 'human' && (
          <g>
            <motion.path 
              d="M200,100 C230,100 250,130 250,170 C250,220 220,250 200,250 C180,250 150,220 150,170 C150,130 170,100 200,100 Z" 
              fill="none" stroke="#6366F1" strokeWidth="2"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.path 
              d="M150,250 L100,400 L120,550 M250,250 L300,400 L280,550 M200,250 L200,550" 
              fill="none" stroke="#6366F1" strokeWidth="2" strokeOpacity="0.3"
            />
            {[1,2,3,4,5].map(i => (
              <motion.circle 
                key={i} cx={150 + i * 20} cy={150 + i * 40} r="4" 
                className="fill-vital-secondary" 
                animate={{ opacity: [0.2, 1, 0.2] }} 
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </g>
        )}

        {type === 'molecules' && (
          <g>
            {[0, 72, 144, 216, 288].map((angle, i) => {
              const r = 120;
              const x = 200 + r * Math.cos(angle * Math.PI / 180);
              const y = 300 + r * Math.sin(angle * Math.PI / 180);
              return (
                <g key={i}>
                  <motion.line 
                    x1="200" y1="300" x2={x} y2={y} stroke="#6366F1" strokeOpacity="0.3" 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  />
                  <motion.circle 
                    cx={x} cy={y} r="15" fill="url(#gradCell)" 
                    animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <circle cx={x} cy={y} r="4" className="fill-vital-primary" />
                </g>
              );
            })}
          </g>
        )}

        {type === 'dna' && (
          <g transform="translate(150, 100)">
            {Array.from({ length: 15 }).map((_, i) => (
              <g key={i} transform={`translate(0, ${i * 30})`}>
                <motion.circle 
                  cx={Math.sin(i * 0.5) * 50 + 50} cy="0" r="4" className="fill-vital-primary"
                  animate={{ cx: [Math.sin(i * 0.5) * 50 + 50, Math.sin(i * 0.5 + Math.PI) * 50 + 50] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.circle 
                  cx={Math.sin(i * 0.5 + Math.PI) * 50 + 50} cy="0" r="4" className="fill-vital-secondary"
                  animate={{ cx: [Math.sin(i * 0.5 + Math.PI) * 50 + 50, Math.sin(i * 0.5) * 50 + 50] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <line x1="0" y1="0" x2="100" y2="0" stroke="#6366F1" strokeOpacity="0.1" />
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
};

// ============ SCANNED DATA DISPLAY ============

const CountUp = ({ to, duration = 1500 }: { to: number, duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = to;
    if (start === end) return;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [to]);
  return <span>{count}</span>;
};

// ============ MAIN APP LOGIC ============

export default function App() {
  const [step, setStep] = useState(1);
  const [screen, setScreen] = useState('onboarding');
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // App State
  const [profile, setProfile] = useState<any>({
    persona: '',
    goals: [],
    age: 28,
    weight: 75,
    height: 175,
    gender: 'Male',
    sleep: 7,
    stress: 5,
    activity: 'Active',
    conditions: [],
    rainbowData: { red: false, orange: false, yellow: false, green: false, purple: false }
  });
  const [mealLogs, setMealLogs] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any>({
    immunity: 75, energy: 68, heart: 82, brain: 71, gut: 60
  });

  const showToast = (message: string, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const [mealInput, setMealInput] = useState('');
  
  const handleLogMeal = async (meal: string) => {
    if (!meal.trim()) return;
    setIsLoading(true);
    const mealLower = meal.toLowerCase();
    const data = await callAI('crime', { healthy: mealLower.includes('salad') || mealLower.includes('fruit') });
    setMealLogs(prev => [{ id: Date.now(), text: meal, ...data }, ...prev]);

    // Update rainbow data via setProfile (no direct mutation)
    setProfile((prev: any) => {
      const rainbow = { ...prev.rainbowData };
      if (mealLower.includes('tomato') || mealLower.includes('strawberry') || mealLower.includes('apple')) rainbow.red = true;
      if (mealLower.includes('carrot') || mealLower.includes('mango') || mealLower.includes('orange')) rainbow.orange = true;
      if (mealLower.includes('corn') || mealLower.includes('banana') || mealLower.includes('lemon')) rainbow.yellow = true;
      if (mealLower.includes('spinach') || mealLower.includes('kale') || mealLower.includes('broccoli') || mealLower.includes('salad')) rainbow.green = true;
      if (mealLower.includes('grape') || mealLower.includes('eggplant') || mealLower.includes('blueberry')) rainbow.purple = true;
      return { ...prev, rainbowData: rainbow };
    });

    const stockUpdate = await callAI('stocks', { healthy: mealLower.includes('salad') });
    setStocks(stockUpdate.stocks);

    showToast('Meal logged! Health intelligence updated.', 'success');
    setIsLoading(false);
    setIsModalOpen(false);
    setMealInput('');
  };

  const bioAge = useMemo(() => {
    let base = profile.age || 25;
    if (profile.sleep < 6) base += 1.8;
    if (profile.stress > 7) base += 1.2;
    if (profile.activity === 'Sedentary') base += 2.5;
    return Math.round(base * 10) / 10;
  }, [profile]);

  const healthScore = useMemo(() => {
    let score = 100;
    if (profile.stress > 7) score -= 15;
    if (profile.sleep < 6) score -= 10;
    return Math.max(score, 0);
  }, [profile]);

  // ============ SCREEN: ONBOARDING ============
  
  const renderOnboardingStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="flex-1 flex flex-col justify-center p-12 lg:p-24 bg-white">
            <h1 className="text-4xl mb-2">First things first — who are you?</h1>
            <p className="text-vital-text-muted mb-12">Select your persona to calibrate our intelligence engine.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { id: 'gym', icon: <Dumbbell />, label: 'Gym Goer', tag: 'I train hard, I eat harder' },
                { id: 'home', icon: <Heart />, label: 'Homemaker', tag: 'Family first, me last' },
                { id: 'pro', icon: <Activity />, label: 'Working Pro', tag: 'Desk life, deadline stress' },
                { id: 'student', icon: <Brain />, label: 'Student', tag: 'Broke, busy, surviving' },
                { id: 'mom', icon: <Zap />, label: 'New Mom', tag: 'Running on love and no sleep' },
                { id: 'senior', icon: <Shield />, label: 'Senior', tag: 'Taking care of what I\'ve built' },
                { id: 'athlete', icon: <Activity />, label: 'Athlete', tag: 'Peak performance only' }
              ].map(p => (
                <Card 
                  key={p.id} 
                  isSelected={profile.persona === p.id}
                  onClick={() => setProfile({...profile, persona: p.id})}
                  className="relative overflow-hidden"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-vital-panel flex items-center justify-center text-vital-primary">
                      {p.icon}
                    </div>
                    <div>
                      <div className="font-bold">{p.label}</div>
                      <div className="text-xs text-vital-text-muted">{p.tag}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex-1 flex flex-col justify-center p-12 lg:p-24 bg-white">
            <h1 className="text-4xl mb-2">What are you here to fix?</h1>
            <p className="text-vital-text-muted mb-12">Multi-select your mission objectives.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'energy', icon: <Zap />, label: 'Boost Energy' },
                { id: 'weight', icon: <Flame />, label: 'Lose Weight' },
                { id: 'muscle', icon: <Dumbbell />, label: 'Build Muscle' },
                { id: 'stress', icon: <Waves />, label: 'Reduce Stress' },
                { id: 'condition', icon: <Activity />, label: 'Manage Condition' },
                { id: 'diet', icon: <Leaf />, label: 'Eat Cleaner' },
                { id: 'sleep', icon: <Moon />, label: 'Fix Sleep' }
              ].map(g => (
                <Card 
                  key={g.id}
                  isSelected={profile.goals.includes(g.id)}
                  onClick={() => {
                    const newGoals = profile.goals.includes(g.id) 
                      ? profile.goals.filter((x: string) => x !== g.id)
                      : [...profile.goals, g.id];
                    setProfile({...profile, goals: newGoals});
                  }}
                >
                  <div className="text-center">
                    <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-vital-panel flex items-center justify-center text-vital-primary">
                      {g.icon}
                    </div>
                    <div className="font-bold text-sm tracking-tight">{g.label}</div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-8 font-mono text-vital-primary font-bold">{profile.goals.length} goals selected</div>
          </div>
        );
      case 3:
        return (
          <div className="flex-1 flex flex-col justify-center p-12 lg:p-24 bg-white">
            <h1 className="text-4xl mb-12">Let's talk numbers.</h1>
            <div className="space-y-12">
              {[
                { label: 'Age', key: 'age', min: 15, max: 80, unit: 'years old' },
                { label: 'Weight', key: 'weight', min: 40, max: 200, unit: 'kg' },
                { label: 'Height', key: 'height', min: 140, max: 220, unit: 'cm' }
              ].map(input => (
                <div key={input.key}>
                  <div className="flex justify-between items-end mb-4">
                    <label className="font-bold text-vital-text-muted">{input.label}</label>
                    <div className="font-mono text-4xl text-vital-primary">{profile[input.key]} <span className="text-sm font-sans">{input.unit}</span></div>
                  </div>
                  <input 
                    type="range" min={input.min} max={input.max} 
                    value={profile[input.key]} 
                    onChange={(e) => setProfile({...profile, [input.key]: parseInt(e.target.value)})}
                    className="w-full h-1 bg-vital-panel rounded-lg appearance-none cursor-pointer accent-vital-primary"
                  />
                </div>
              ))}
              <div>
                <label className="font-bold text-vital-text-muted block mb-4">Gender</label>
                <div className="flex gap-2">
                  {['Male', 'Female', 'Other'].map(g => (
                    <Button 
                      key={g} variant={profile.gender === g ? 'primary' : 'secondary'}
                      onClick={() => setProfile({...profile, gender: g})}
                      className="flex-1"
                    >
                      {g}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex-1 flex flex-col justify-center p-12 lg:p-24 bg-white">
            <h1 className="text-4xl mb-12">How's life treating you?</h1>
            <div className="space-y-12">
              {[
                { label: 'Sleep Quality', key: 'sleep', min: 1, max: 10, lowLabel: 'Restless', highLabel: 'Deep' },
                { label: 'Stress Level', key: 'stress', min: 1, max: 10, lowLabel: 'Calm', highLabel: 'Burnt Out' }
              ].map(input => (
                <div key={input.key}>
                  <div className="flex justify-between items-end mb-4">
                    <label className="font-bold text-vital-text-muted">{input.label}</label>
                    <div className="font-mono text-4xl text-vital-primary">{profile[input.key]}</div>
                  </div>
                  <input 
                    type="range" min={input.min} max={input.max} 
                    value={profile[input.key]} 
                    onChange={(e) => setProfile({...profile, [input.key]: parseInt(e.target.value)})}
                    className="w-full h-1 bg-vital-panel rounded-lg appearance-none cursor-pointer accent-vital-primary"
                  />
                  <div className="flex justify-between mt-2 text-xs text-vital-text-light font-bold uppercase tracking-widest">
                    <span>{input.lowLabel}</span>
                    <span>{input.highLabel}</span>
                  </div>
                </div>
              ))}
              <div>
                <label className="font-bold text-vital-text-muted block mb-4">Activity Level</label>
                <div className="flex gap-2">
                  {['Sedentary', 'Moderate', 'Active'].map(a => (
                    <Button 
                      key={a} variant={profile.activity === a ? 'primary' : 'secondary'}
                      onClick={() => setProfile({...profile, activity: a})}
                      className="flex-1"
                    >
                      {a}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex-1 flex flex-col justify-center p-12 lg:p-24 bg-white">
            <h1 className="text-4xl mb-2">Anything we should know?</h1>
            <p className="text-vital-text-muted mb-12">Critical medical markers for precision analysis.</p>
            <div className="flex flex-wrap gap-3">
              {['Diabetes', 'High BP', 'PCOS', 'Thyroid', 'Heart Condition', 'Cholesterol', 'None'].map(c => (
                <button
                  key={c}
                  onClick={() => {
                    const newC = profile.conditions.includes(c) 
                      ? profile.conditions.filter((x: string) => x !== c)
                      : c === 'None' ? ['None'] : [...profile.conditions.filter((x: string) => x !== 'None'), c];
                    setProfile({...profile, conditions: newC});
                  }}
                  className={`px-6 py-2 rounded-full font-bold border transition-all ${profile.conditions.includes(c) ? 'bg-vital-primary border-vital-primary text-white' : 'border-vital-border text-vital-text-muted hover:border-vital-primary'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="flex-1 flex flex-col justify-center p-12 lg:p-24 bg-white relative overflow-hidden">
            <motion.div 
              initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}
              className="bg-vital-bg rounded-3xl p-12 card-shadow text-center border border-vital-primary/20 aspect-video flex flex-col justify-center"
            >
              <div className="w-20 h-20 bg-vital-panel rounded-full flex items-center justify-center text-vital-primary mx-auto mb-6">
                <Brain className="w-10 h-10" />
              </div>
              <h2 className="text-3xl mb-1">Intelligence Calibrated</h2>
              <p className="text-vital-text-muted mb-8">Your biological narrative is ready.</p>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div className="text-left bg-white p-6 rounded-2xl border border-vital-border">
                  <div className="text-xs uppercase text-vital-text-light font-bold mb-1">Bio-Age Shift</div>
                  <div className="font-mono text-4xl text-vital-primary"><CountUp to={bioAge} /></div>
                </div>
                <div className="text-left bg-white p-6 rounded-2xl border border-vital-border">
                  <div className="text-xs uppercase text-vital-text-light font-bold mb-1">Health Score</div>
                  <div className="font-mono text-4xl text-vital-success"><CountUp to={healthScore} /></div>
                </div>
              </div>

              <Button onClick={() => setScreen('dashboard')} className="w-full">
                Enter VitalSim <ChevronRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        );
      default: return null;
    }
  };

  // ============ DASHBOARD COMPONENTS ============
  
  const Sidebar = () => (
    <aside className="w-[260px] h-screen bg-white border-r border-vital-border p-8 flex flex-col fixed left-0 top-0 z-50">
      <div className="text-3xl font-black mb-12 bg-linear-to-r from-vital-primary to-vital-secondary bg-clip-text text-transparent italic">VITALSIM</div>
      <nav className="flex-1 space-y-2">
        {[
          { id: 'dashboard', label: 'Home', icon: <LayoutGrid className="w-5 h-5" /> },
          { id: 'stocks', label: 'Stocks', icon: <TrendingUp className="w-5 h-5" /> },
          { id: 'bio', label: 'Bio-Age', icon: <Activity className="w-5 h-5" /> },
          { id: 'future', label: 'Future Self', icon: <Clock className="w-5 h-5" /> },
          { id: 'crime', label: 'Crime Lab', icon: <Search className="w-5 h-5" /> },
          { id: 'rainbow', label: 'Rainbow', icon: <Zap className="w-5 h-5" /> }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-3 rounded-full font-semibold transition-all ${screen === item.id ? 'bg-vital-primary text-white shadow-md' : 'text-vital-text-muted hover:bg-vital-panel'}`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 bg-vital-panel rounded-2xl text-[10px] uppercase font-bold text-vital-text-light tracking-widest text-center">
        v2.0.0 Stable
      </div>
    </aside>
  );

  const DashboardContent = () => (
    <div className="ml-[260px] p-12 lg:p-16">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <div className="text-xs font-bold text-vital-primary uppercase tracking-[4px] mb-2">Operations Center</div>
            <h1 className="text-4xl lowercase tracking-tighter">Good morning, Agent.</h1>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-vital-text-light uppercase tracking-widest">Biological Status</div>
            <div className="font-mono text-xl text-vital-danger">Critical Alert</div>
          </div>
        </header>

        {/* AI HEADLINE */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-white border-l-4 border-vital-primary p-8 rounded-2xl mb-8 flex items-center gap-6 card-shadow"
        >
          <div className="w-12 h-12 rounded-full bg-vital-panel flex items-center justify-center text-vital-primary flex-shrink-0">
            <Zap />
          </div>
          <div className="flex-1 text-lg font-medium leading-relaxed">
            "Your biometric profile indicates a potential energy crash by 3PM. Consider an extra fiber-rich log now to stabilize stocks."
          </div>
          <ChevronRight className="w-6 h-6 text-vital-text-light" />
        </motion.div>

        {/* GRID 4-STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Health Score', val: healthScore, icon: <LayoutGrid className="w-4 h-4" />, color: 'text-vital-success' },
            { label: 'Bio-Age', val: bioAge, icon: <Activity className="w-4 h-4" />, color: 'text-vital-danger' },
            { label: 'Meals Logged', val: mealLogs.length, icon: <History className="w-4 h-4" />, color: 'text-vital-primary' },
            { label: 'Streak', val: 7, icon: <Flame className="w-4 h-4" />, color: 'text-vital-warning', suffix: ' Days' }
          ].map(stat => (
            <Card key={stat.label}>
              <div className="flex items-center gap-2 mb-2 text-vital-text-light">
                {stat.icon}
                <span className="text-[10px] uppercase font-bold tracking-widest">{stat.label}</span>
              </div>
              <div className={`text-4xl font-mono ${stat.color}`}>
                {typeof stat.val === 'number' ? <CountUp to={stat.val} /> : stat.val}
                {stat.suffix}
              </div>
            </Card>
          ))}
        </div>

        {/* STOCKS PREVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl mb-6 flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-vital-primary" />
              Health Market Live
            </h2>
            <div className="bg-white rounded-3xl p-8 border border-vital-border card-shadow space-y-6">
              {[
                { name: 'Immunity', val: stocks.immunity, icon: <Shield />, color: 'bg-vital-primary' },
                { name: 'Energy', val: stocks.energy, icon: <Zap />, color: 'bg-vital-warning' },
                { name: 'Heart', val: stocks.heart, icon: <Heart />, color: 'bg-vital-danger' },
                { name: 'Neural', val: stocks.brain, icon: <Brain />, color: 'bg-vital-purple' }
              ].map(s => (
                <div key={s.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <span className="text-vital-primary scale-75">{s.icon}</span>
                      {s.name}
                    </div>
                    <div className="font-mono text-sm"><CountUp to={s.val} />%</div>
                  </div>
                  <div className="w-full h-2 bg-vital-panel rounded-full overflow-hidden">
                    <motion.div 
                      key={`${s.name}-${s.val}`}
                      initial={{ width: 0 }} 
                      animate={{ width: `${s.val}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${s.color}`}
                    />
                  </div>
                </div>
              ))}
              <Button variant="secondary" className="w-full text-xs" onClick={() => setScreen('stocks')}>View All INDICATORS</Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl mb-6">Action Intelligence</h2>
            <div className="space-y-4">
              <Card className="flex gap-4 items-start border-l-4 border-vital-warning">
                <div className="text-vital-warning"><Search className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">Crime Lab Result</div>
                  <div className="text-xs text-vital-text-muted mt-1 underline">Samosa verdict: GUILTY</div>
                </div>
              </Card>
              <Card className="flex gap-4 items-start border-l-4 border-vital-purple">
                <div className="text-vital-purple"><Clock className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">Future Warning</div>
                  <div className="text-xs text-vital-text-muted mt-1">"Please eat breakfast in the morning."</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ============ FEATURE: CRIME LAB ============
  
  const CrimeLab = () => (
    <div className="ml-[260px] p-12 lg:p-16 h-full flex flex-col">
      <div className="max-w-6xl mx-auto w-full">
        <header className="mb-12">
          <div className="text-xs font-bold text-vital-primary uppercase tracking-[4px] mb-2">Investigation Unit</div>
          <h1 className="text-4xl text-vital-danger">Crime Division</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
             <Card className="bg-vital-panel/20 border-dashed mb-8 text-center py-20">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-vital-primary mx-auto mb-6 card-shadow">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl mb-2">No active cases</h3>
                <p className="text-vital-text-muted text-sm mb-8">Log a meal to start an intelligence investigation.</p>
                <Button onClick={() => setIsModalOpen(true)}>Initialize Log</Button>
             </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl">Historical Records</h2>
            {mealLogs.length === 0 ? (
              <div className="text-vital-text-light text-center py-12 border rounded-3xl">Clear Record — No Crimes Detected</div>
            ) : (
              mealLogs.map(log => (
                <Card key={log.id} className={`border-l-4 ${log.verdict === 'Guilty' ? 'border-vital-danger' : 'border-vital-success'}`}>
                  <div className="flex justify-between mb-4">
                    <span className="font-mono text-xs text-vital-text-light">#VS-{log.id.toString().slice(-4)}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${log.verdict === 'Guilty' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {log.verdict === 'Guilty' ? <X className="w-3 h-3"/> : <Check className="w-3 h-3"/>}
                      {log.verdict === 'Guilty' ? 'GUILTY' : 'INNOCENT'}
                    </span>
                  </div>
                  <h4 className="text-lg mb-2">{log.text}</h4>
                  {log.crimes && (
                    <ul className="text-xs text-vital-text-muted space-y-1">
                      {log.crimes.map((c: string) => <li key={c} className="flex gap-2 items-center"><X className="w-3 h-3 text-red-400" /> {c}</li>)}
                    </ul>
                  )}
                  <div className="mt-4 p-3 bg-vital-panel rounded-xl text-xs flex gap-2">
                    <Shield className="w-4 h-4 text-vital-primary" />
                    <span className="italic">" {log.sentence} "</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ============ MAIN RENDER LOGIC ============

  return (
    <div className="min-h-screen">
      <SkipLink />
      <div id="announcer" aria-live="polite" className="sr-only"></div>

      {screen === 'onboarding' ? (
        <div className="flex h-screen overflow-hidden">
          {/* Left Panel */}
          <div className="hidden lg:block w-[40%] bg-vital-panel relative border-r border-vital-border">
            <div className="absolute top-12 left-12 z-20 text-xs font-black tracking-[4px] text-vital-primary opacity-50">VITALSIM BIOMETRICS</div>
            <BioIllustration type={step < 3 ? 'human' : step < 5 ? 'molecules' : 'dna'} />
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gray-200 z-50">
              <motion.div 
                className="h-full bg-vital-primary" 
                animate={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-[60%] flex flex-col h-full bg-white relative">
            <div className="absolute top-8 right-8 font-mono text-xs text-vital-text-light font-bold z-10">STEP {step} OF 6</div>
            <div className="flex-1 overflow-y-auto">
              {renderOnboardingStep()}
            </div>
            
            <div className="flex-shrink-0 p-8 lg:p-12 bg-white border-t border-vital-border flex justify-between items-center">
              <Button 
                variant="secondary" 
                onClick={() => setStep(s => Math.max(1, s-1))}
                className={step === 1 ? 'invisible' : ''}
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </Button>
              <Button onClick={() => {
                if (step === 6) setScreen('dashboard');
                else setStep(s => s + 1);
              }}>
                {step === 6 ? 'Finalize Profile' : 'Next Step'} <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex bg-vital-bg min-h-screen">
          <Sidebar />
          <main id="main" className="flex-1 w-full">
            {screen === 'dashboard' && <DashboardContent />}
            {screen === 'crime' && <CrimeLab />}
        {screen === 'stocks' && (
          <div className="ml-[260px] p-12 lg:p-16">
            <div className="max-w-6xl mx-auto">
              <header className="mb-12">
                <div className="text-xs font-bold text-vital-primary uppercase tracking-[4px] mb-2">Biological Economy</div>
                <h1 className="text-4xl text-vital-primary">Health Market</h1>
              </header>

              <div className="bg-vital-success/10 border-b-4 border-vital-success p-6 mb-12 flex justify-between items-center rounded-t-3xl">
                 <div className="flex items-center gap-4">
                    <TrendingUp className="text-vital-success" />
                    <span className="font-bold uppercase tracking-widest text-sm">Market Condition: Bullish Intelligence</span>
                 </div>
                 <div className="font-mono text-sm text-vital-success">+2.4% Intensity</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Immunity', val: stocks.immunity, icon: <Shield />, trend: '+4%', cause: 'Vitamin C intake' },
                  { name: 'Energy', val: stocks.energy, icon: <Zap />, trend: '-2%', cause: 'Caffeine crash' },
                  { name: 'Heart', val: stocks.heart, icon: <Heart />, trend: '+1%', cause: 'Post-walk recovery' },
                  { name: 'Brain', val: stocks.brain, icon: <Brain />, trend: '+0.5%', cause: 'Deep sleep' },
                  { name: 'Bone', val: 88, icon: <Activity />, trend: 'Stable', cause: 'Calcium balance' },
                  { name: 'Gut', val: stocks.gut, icon: <Gut />, trend: '+5%', cause: 'Probiotic log' }
                ].map(s => (
                  <Card key={s.name} className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                       <div className="w-12 h-12 rounded-full bg-vital-panel flex items-center justify-center text-vital-primary">
                          {s.icon}
                       </div>
                       <div className={`font-mono text-sm ${s.trend.startsWith('+') ? 'text-vital-success' : s.trend.startsWith('-') ? 'text-vital-danger' : 'text-vital-text-light'}`}>
                          {s.trend}
                       </div>
                    </div>
                    <div>
                       <div className="text-xs font-bold text-vital-text-light uppercase tracking-widest mb-1">{s.name} Integrity</div>
                       <div className="text-3xl font-mono text-vital-text-primary">{s.val}%</div>
                    </div>
                    <div className="w-full h-1.5 bg-vital-panel rounded-full overflow-hidden">
                       <motion.div 
                          initial={{ width: 0 }} animate={{ width: `${s.val}%` }}
                          className={`h-full ${s.val > 70 ? 'bg-vital-success' : s.val > 40 ? 'bg-vital-warning' : 'bg-vital-danger'}`}
                       />
                    </div>
                    {/* Tiny Sparkline Simulation */}
                    <svg viewBox="0 0 100 20" className="w-full h-8 opacity-30 mt-2">
                       <path 
                          d="M0,15 L10,12 L20,16 L30,10 L40,14 L50,8 L60,12 L70,10 L80,14 L90,10 L100,12" 
                          fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" 
                       />
                    </svg>
                    <div className="text-[10px] uppercase font-bold text-vital-text-light mt-auto">
                       Primary Driver: <span className="text-vital-primary">{s.cause}</span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        {screen === 'bio' && (
          <div className="ml-[260px] p-12 lg:p-16">
            <div className="max-w-6xl mx-auto">
              <header className="mb-12">
                <div className="text-xs font-bold text-vital-primary uppercase tracking-[4px] mb-2">Simulated Reality</div>
                <h1 className="text-4xl text-vital-danger">Bio-Age Scanner</h1>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <Card className="text-center">
                      <div className="text-xs font-bold text-vital-text-light uppercase mb-2">Internal Age</div>
                      <div className="text-6xl font-mono text-vital-danger"><CountUp to={bioAge} /></div>
                      <div className="text-sm mt-4 text-vital-text-muted">+{Math.max(0, bioAge - profile.age).toFixed(1)} years offset</div>
                    </Card>
                    <Card className="text-center">
                      <div className="text-xs font-bold text-vital-text-light uppercase mb-2">Chronological</div>
                      <div className="text-6xl font-mono text-vital-primary">{profile.age}</div>
                      <div className="text-sm mt-4 text-vital-text-muted">Verified sequence</div>
                    </Card>
                  </div>
                  <Card className="border-l-4 border-vital-warning">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-vital-panel rounded-full flex items-center justify-center text-vital-warning"><Zap className="w-5 h-5"/></div>
                      <div>
                        <div className="font-bold">Cellular Decay Alert</div>
                        <p className="text-sm text-vital-text-muted mt-1">High cortisol markers detected. Current lifestyle is aging your primary neural nodes by 0.3 days every 24 hours.</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="bg-white rounded-[40px] p-12 border border-vital-border card-shadow flex flex-col items-center">
                   <div className="relative w-full aspect-[2/3] max-w-sm">
                      {/* Body Map SVG */}
                      <svg viewBox="0 0 200 300" className="w-full h-full">
                        <path d="M100,20 C115,20 120,35 120,50 C120,65 115,80 100,80 C85,80 80,65 80,50 C80,35 85,20 100,20 Z" fill="#E8EFFE" />
                        <path d="M80,80 L60,150 L65,280 M120,80 L140,150 L135,280 M100,80 L100,180 L85,280 M100,180 L115,280" fill="none" stroke="#E8EFFE" strokeWidth="20" strokeLinecap="round" />
                        
                        {/* Organ Nodes */}
                        {[
                          { cx: 100, cy: 50, label: 'Brain', score: stocks.brain },
                          { cx: 105, cy: 110, label: 'Heart', score: stocks.heart },
                          { cx: 95, cy: 140, label: 'Gut', score: stocks.gut },
                          { cx: 80, cy: 170, label: 'Lungs', score: 82 },
                          { cx: 120, cy: 130, label: 'Liver', score: 65 }
                        ].map(node => (
                          <motion.circle 
                            key={node.label} cx={node.cx} cy={node.cy} r="6" 
                            className={node.score > 75 ? 'fill-vital-success' : node.score > 60 ? 'fill-vital-warning' : 'fill-vital-danger'}
                            animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity, delay: Math.random() }}
                          />
                        ))}
                      </svg>
                      <div className="absolute top-0 right-0 p-4 border rounded-2xl bg-white/80 backdrop-blur-sm text-xs font-bold uppercase tracking-widest text-vital-text-light">
                        Biometric Map Analysis
                      </div>
                   </div>
                   <div className="mt-8 text-center">
                      <div className="text-xl font-bold uppercase font-display">Neural Center PII</div>
                      <p className="text-xs text-vital-text-muted mt-2">Active stress markers are causing micro-inflammation in the cerebellum node group.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'future' && (
          <div className="ml-[260px] p-12 lg:p-16">
            <div className="max-w-6xl mx-auto">
              <header className="mb-12">
                <div className="text-xs font-bold text-vital-primary uppercase tracking-[4px] mb-2">Temporal Simulation</div>
                <h1 className="text-4xl text-vital-purple">Future Self</h1>
              </header>

              <div className="flex gap-4 mb-12">
                {['1 Year', '3 Years', '5 Years'].map(t => (
                  <Button key={t} variant={t === '5 Years' ? 'primary' : 'secondary'} className="flex-1">{t} Simulation</Button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-64 h-64 rounded-full bg-linear-to-b from-vital-panel to-white flex items-center justify-center relative overflow-hidden border border-vital-border">
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}
                      className="text-vital-primary opacity-20"
                    >
                      <Activity className="w-32 h-32" />
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <Brain className="w-24 h-24 text-vital-purple/40" />
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <div className="text-xs font-bold text-vital-text-light uppercase tracking-widest mb-1">Entity Status</div>
                    <div className="font-bold text-xl uppercase font-display">Average Potential</div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Card className="p-12 relative overflow-hidden bg-vital-panel/10">
                    <div className="absolute top-4 right-8 font-mono text-[10px] text-vital-text-light">TIMESTAMP: 2031.04.21_10:00</div>
                    <div className="text-6xl text-vital-primary opacity-10 absolute -bottom-4 -right-4 italic">2031</div>
                    <div className="relative z-10">
                       <div className="flex items-center gap-4 mb-8">
                         <div className="w-2 h-2 rounded-full bg-vital-purple animate-ping" />
                         <span className="font-bold uppercase tracking-widest text-xs">DIRECT UPLINK ESTABLISHED</span>
                       </div>
                       <p className="text-2xl leading-relaxed text-vital-text-primary italic mb-12">
                         "Hey, it's future you... from 5 years down the line. We reached a fork in the road today. Every meal log currently logged is a vote for who we become. Please, don't ignore the bio-age warnings. I'm counting on you to stay disciplined."
                       </p>
                       <div className="flex gap-8 border-t border-vital-border pt-8">
                         <div>
                            <div className="text-[10px] uppercase font-bold text-vital-text-light">Projected Energy</div>
                            <div className="font-mono text-xl text-vital-primary">74%</div>
                         </div>
                         <div>
                            <div className="text-[10px] uppercase font-bold text-vital-text-light">Heart Integrity</div>
                            <div className="font-mono text-xl text-vital-danger">Critical</div>
                         </div>
                       </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {screen === 'rainbow' && (
          <div className="ml-[260px] p-12 lg:p-16">
            <div className="max-w-6xl mx-auto">
              <header className="mb-12">
                <div className="text-xs font-bold text-vital-primary uppercase tracking-[4px] mb-2">Phytonutrient Tracker</div>
                <h1 className="text-4xl text-vital-success">Eat the Rainbow</h1>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center mb-16">
                 <Card className="lg:col-span-1 text-center py-16 flex flex-col items-center">
                    <div className="relative w-48 h-48 mb-8">
                       <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#E8EFFE" strokeWidth="8" />
                          <motion.circle 
                            cx="50" cy="50" r="40" fill="none" stroke="#6366F1" strokeWidth="8" 
                            strokeDasharray="251" initial={{ strokeDashoffset: 251 }} 
                            animate={{ strokeDashoffset: 251 - (251 * Object.values(profile.rainbowData).filter(Boolean).length) / 5 }}
                            strokeLinecap="round"
                          />
                       </svg>
                       <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <div className="font-mono text-4xl">{Object.values(profile.rainbowData).filter(Boolean).length}/5</div>
                          <div className="text-[10px] uppercase font-bold text-vital-text-light">Daily Goal</div>
                       </div>
                    </div>
                    <p className="text-sm text-vital-text-muted">
                      {Object.values(profile.rainbowData).filter(Boolean).length === 5 
                        ? 'Peak biological synergy achieved! Rainbow complete.' 
                        : `You've unlocked ${Object.values(profile.rainbowData).filter(Boolean).length} phytonutrient groups today. ${5 - Object.values(profile.rainbowData).filter(Boolean).length} remaining.`}
                    </p>
                 </Card>

                 <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                    {[
                      { key: 'red', color: '#EF4444', label: 'Red', b: 'Lycopene', foods: 'Tomatoes, berries' },
                      { key: 'orange', color: '#F59E0B', label: 'Orange', b: 'Beta-carotene', foods: 'Carrots, mango' },
                      { key: 'yellow', color: '#FFD166', label: 'Yellow', b: 'Vitamin C', foods: 'Corn, banana' },
                      { key: 'green', color: '#10B981', label: 'Green', b: 'Chlorophyll', foods: 'Spinach, kale' },
                      { key: 'purple', color: '#8B5CF6', label: 'Purple', b: 'Antioxidants', foods: 'Grapes, eggplant' }
                    ].map(c => (
                      <Card key={c.label} className={`p-4 flex gap-4 items-center transition-all ${profile.rainbowData[c.key] ? 'border-vital-success bg-vital-success/5' : ''}`}>
                        <div className="w-10 h-10 rounded-full flex-shrink-0 relative" style={{ backgroundColor: c.color }}>
                          {profile.rainbowData[c.key] && (
                             <motion.div 
                               initial={{ scale: 0 }} animate={{ scale: 1 }}
                               className="absolute inset-0 bg-white/20 rounded-full flex items-center justify-center"
                             >
                               <Check className="w-6 h-6 text-white" strokeWidth={3} />
                             </motion.div>
                          )}
                        </div>
                        <div className="flex-1">
                           <div className="font-bold text-sm">{c.label} Group</div>
                           <div className="text-[10px] text-vital-text-muted leading-tight">{c.b}: {c.foods}</div>
                        </div>
                        <Button 
                          variant="ghost" className="p-2" 
                          onClick={() => {
                            setProfile(prev => ({
                              ...prev,
                              rainbowData: { ...prev.rainbowData, [c.key]: !prev.rainbowData[c.key] }
                            }));
                            showToast(`${c.label} group ${!profile.rainbowData[c.key] ? 'unlocked' : 'removed'}`, 'success');
                          }}
                        >
                          <Plus className={`w-4 h-4 transition-transform ${profile.rainbowData[c.key] ? 'rotate-45' : ''}`} />
                        </Button>
                      </Card>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        )}
          </main>
        </div>
      )}

      {/* MEAL LOG MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white w-full max-w-2xl rounded-t-[32px] p-8 lg:p-12 border-t-4 border-vital-primary shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl lowercase tracking-tighter">New Biometric Entry</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-vital-text-light hover:text-vital-danger"><X /></button>
              </div>
              
              <label className="block text-xs font-bold text-vital-text-light uppercase tracking-widest mb-3">Input Description</label>
              <textarea 
                placeholder="What fuel was consumed? (e.g., Avocado toast with egg)"
                className="w-full h-32 bg-vital-panel/50 rounded-2xl p-6 mb-8 border border-vital-border focus:border-vital-primary outline-none transition-all text-lg font-medium"
                value={mealInput}
                onChange={(e) => setMealInput(e.target.value)}
              />

              <div className="flex gap-2 mb-12">
                {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(t => (
                  <button key={t} className="flex-1 py-3 px-4 rounded-xl border border-vital-border text-xs font-bold text-vital-text-muted hover:border-vital-primary hover:text-vital-primary transition-all uppercase tracking-widest">{t}</button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-vital-text-light max-w-xs">AI analysis will process crimes, stocks, and bio-age shift in real-time.</p>
                <Button 
                  onClick={() => handleLogMeal(mealInput)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Analyze & Commit'} <Check className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING ACTION BUTTON */}
      {screen !== 'onboarding' && (
        <motion.button 
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-10 right-10 w-14 h-14 bg-vital-primary text-white rounded-full flex items-center justify-center shadow-xl z-50 animate-pulse border-4 border-white"
          aria-label="Log new meal"
        >
          <Plus className="w-8 h-8" />
        </motion.button>
      )}

      {/* TOAST SYSTEM */}
      <div className="fixed top-8 right-8 z-[200] space-y-4 w-80">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div 
              key={t.id} 
              initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
              className={`p-6 rounded-2xl shadow-xl border-l-4 flex gap-4 items-center bg-white ${t.type === 'success' ? 'border-vital-success' : 'border-vital-primary'}`}
            >
              <div className={t.type === 'success' ? 'text-vital-success' : 'text-vital-primary'}>
                {t.type === 'success' ? <Check /> : <Zap />}
              </div>
              <div className="text-sm font-semibold">{t.message}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
