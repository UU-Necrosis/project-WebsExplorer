<!DOCTYPE html><html class="dark" lang="en"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Trustpilot — Verified Trust &amp; Autonomous Telemetry</title>
<!-- Google Fonts: Space Grotesk, Inter, JetBrains Mono -->
<link href="https://fonts.googleapis.com" rel="preconnect">
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500;600&amp;family=Space+Grotesk:wght@500;600;700&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<!-- Tailwind CSS CDN with forms and container queries plugins -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script>
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "background": "#0b0f17",
            "surface": "#0f131c",
            "surface-container": "#151a24",
            "surface-container-high": "#1c2230",
            "surface-card": "rgba(21, 26, 36, 0.7)",
            "primary": "#00b67a",
            "primary-bright": "#10b981",
            "primary-glow": "rgba(0, 182, 122, 0.25)",
            "primary-fixed": "#6efcb9",
            "on-surface": "#dfe2ef",
            "on-surface-muted": "#94a3b8",
            "outline-border": "rgba(255, 255, 255, 0.08)",
            "outline-glow": "rgba(0, 182, 122, 0.3)",
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            display: ['Space Grotesk', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          },
          boxShadow: {
            'glow-emerald': '0 0 35px -5px rgba(0, 182, 122, 0.35)',
            'glow-emerald-sm': '0 0 15px -2px rgba(0, 182, 122, 0.4)',
            'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
          }
        }
      }
    }
  </script>
<style>
    body {
      background-color: #0b0f17;
      color: #dfe2ef;
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    /* Ambient cyber-grid pattern */
    .bg-cyber-grid {
      background-size: 40px 40px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    }

    /* Glass card backdrop */
    .glass-panel {
      background: rgba(18, 24, 38, 0.65);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.07);
    }

    .glass-panel:hover {
      border-color: rgba(0, 182, 122, 0.35);
    }

    /* Custom star rating badge */
    .tp-star-node {
      width: 28px;
      height: 28px;
      background: #00b67a;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      box-shadow: 0 0 10px rgba(0, 182, 122, 0.5);
    }

    /* Subtle pulse animation for telemetry status */
    @keyframes live-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.15); }
    }
    .live-dot {
      animation: live-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  </style>
</head>
<body class="min-h-screen relative selection:bg-primary selection:text-black overflow-x-hidden">
<!-- Dynamic Ambient Glow Spots -->
<div class="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-primary/10 rounded-full blur-[140px] pointer-events-none z-0"></div>
<div class="fixed top-[45%] right-[-100px] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none z-0"></div>
<!-- Cybernetic Grid Overlay -->
<div class="fixed inset-0 bg-cyber-grid pointer-events-none z-0"></div>
<!-- BEGIN: MainHeader -->
<header class="w-full bg-[#0b0f17]/85 backdrop-blur-xl border-b border-white/[0.08] sticky top-0 z-50"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
<!-- Brand Logo -->
<a aria-label="WebsExplore Directory" class="flex items-center gap-3 group shrink-0" href="#"><div class="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/30 group-hover:border-primary/60 transition-all duration-300 shadow-glow-emerald-sm flex items-center justify-center bg-surface-container"><img src="https://lh3.googleusercontent.com/aida/AEtjO1UgKixopvBpHwvtQkz4pCTwk9kEPwX4q3LteMzfwImV1M8WMDcz1GAV_z51IgvS6oWkF9C9I-vyY09N-pVXkxzfS4ddSXEK-6Wck8bJ5XUderAvp4emmmU-14mt-U5GZyIyuN18CFHhxC6aWisRgCkknWuPFpWDhC2frr1qZkSR7JJrBvKiEgi9scoQsdO_ylz48AiJ4EGbbF3dBPe9JUna9r7PwhNr3ltfY6HFmg" alt="WebsExplore Logo" class="w-full h-full object-contain rounded-xl"></div><div class="flex flex-col"><div class="flex items-center gap-2"><span class="text-xl font-bold tracking-tight text-white font-display">Webs<span class="text-primary">Explore</span></span><span class="px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-primary bg-primary/10 border border-primary/25 rounded flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>CROWDSOURCED</span></div><span class="text-[11px] font-mono text-slate-400 -mt-0.5">Curated Web &amp; Directory</span></div></a>
<!-- Desktop Navigation Menu -->
<nav class="hidden lg:flex items-center gap-6 text-[14px] font-medium text-slate-300 font-sans"><a class="hover:text-primary transition-colors" href="#categories-explorer">Explore Niches</a><a class="hover:text-primary transition-colors" href="#most-rated">Most Rated</a><a class="hover:text-primary transition-colors" href="#recently-added">Recently Added</a><a class="hover:text-primary transition-colors text-slate-400" href="#">How TrustScore Works</a></nav>
<!-- Right Utility Controls -->
<div class="flex items-center gap-3 sm:gap-4"><div class="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 bg-surface-container/60 border border-white/10 rounded-lg"><div class="w-5 h-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] text-slate-400"><svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg></div><span class="text-slate-300">Login</span><span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span></div></div>
</div></header>
<!-- END: MainHeader -->
<!-- BEGIN: HeroSection -->
<section class="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 z-10" data-purpose="hero-container">
<div class="max-w-5xl mx-auto text-center">
<!-- High-tech telemetry tag -->
<div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container border border-primary/30 text-xs font-mono text-primary mb-6 shadow-glass-inset"><span class="w-2 h-2 rounded-full bg-primary animate-ping"></span>
<span class="font-medium tracking-wide">CURATED WEB DISCOVERY &amp; USERS PROVIDE</span></div>
<!-- Hero Headline -->
<h1 class="text-4xl sm:text-6xl lg:text-[68px] font-bold tracking-tight text-white mb-6 font-display leading-[1.08]">Find websites you <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-300 to-teal-200">truly need.</span></h1>
<!-- Hero Subtitle -->
<p class="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-sans font-normal leading-relaxed">Discover curated tools, verified ratings, and top community reviews across 1M+ websites and web apps worldwide.</p>
<!-- Advanced Search Component -->
<div class="max-w-3xl mx-auto mb-8">
<div class="relative p-1.5 rounded-2xl bg-surface-container/90 border border-white/10 shadow-2xl focus-within:border-primary/80 focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-300">
<form action="#" class="flex flex-col sm:flex-row items-center gap-2" method="GET">
<div class="flex items-center flex-1 w-full pl-4">
<svg class="w-5 h-5 text-slate-400 mr-3 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
<circle cx="11" cy="11" r="8"></circle>
<line x1="21" x2="16.65" y1="21" y2="16.65"></line>
</svg>
<label class="sr-only" for="main-search">Search company, domain or category</label>
<input class="w-full py-3.5 bg-transparent border-0 text-white placeholder-slate-500 focus:ring-0 text-base font-sans" id="main-search" name="q" placeholder="Describe website, or tool category..." type="text">
<!-- Hotkey badge -->

</div>
<!-- Search Action Trigger -->
<button aria-label="Submit search" class="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary-bright text-black font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-glow-emerald-sm shrink-0" type="submit">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
<line x1="5" x2="19" y1="12" y2="12"></line>
<polyline points="12 5 19 12 12 19"></polyline>
</svg></button>
</form>
</div>
<!-- Quick Filter Tags -->
<div class="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-sans text-slate-400"><span class="text-slate-500 font-mono">Trending:</span>
<a class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-primary border border-white/5 transition-colors" href="#">⚡ Generative AI</a>
<a class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-primary border border-white/5 transition-colors" href="#">🎨 Web Comics &amp; Manga</a>
<a class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-primary border border-white/5 transition-colors" href="#">💻 Dev &amp; Programming</a>
<a class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-primary border border-white/5 transition-colors" href="#">🤖 LLM Frameworks</a>
<a class="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] hover:text-primary border border-white/5 transition-colors" href="#">🎬 Media &amp; Streaming</a></div>
</div>
<!-- Explanatory Link -->
<div class="text-xs font-mono text-slate-400">
<span class=""></span>
<a class="text-primary hover:underline inline-flex items-center gap-1 font-semibold" href="#">
          How TrustScore works <span aria-hidden="true" class="">→</span>
</a>
</div>
</div>
</section>
<!-- END: HeroSection -->
<!-- BEGIN: ReviewCalloutStrip / Telemetry Metrics Strip -->
<section class="relative z-10 border-y border-white/[0.08] bg-[#0d121c]/90 py-6 backdrop-blur-md" data-purpose="review-cta-banner">
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div class="flex flex-col lg:flex-row items-center justify-between gap-6">
<!-- Trustpilot 5 Stars & Score Indicator -->
<div class="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
<div aria-label="5 star rating preview" class="flex items-center gap-1.5">
<div class="tp-star-node">
<svg class="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
</div>
<div class="tp-star-node">
<svg class="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
</div>
<div class="tp-star-node">
<svg class="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
</div>
<div class="tp-star-node">
<svg class="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
</div>
<div class="tp-star-node">
<svg class="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
</div>
</div>
<div class="h-6 w-px bg-white/10 hidden sm:block"></div>
<div class="flex items-center gap-2">
<span class="text-sm font-semibold text-white">4.8 / 5.0</span>
<span class="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">EXCELLENT</span>
</div>
</div>
<!-- Telemetry Live Counters -->
<div class="flex items-center gap-6 sm:gap-10 text-xs font-mono">
<div class="flex flex-col">
<span class="text-slate-400 uppercase text-[10px]">Verified Reviews</span>
<span class="text-base font-bold text-white font-display">240,891,420+</span>
</div>
<div class="w-px h-7 bg-white/10"></div>
<div class="flex flex-col">
<span class="text-slate-400 uppercase text-[10px]">Fraud Detection</span>
<span class="text-base font-bold text-primary font-display">99.8% ACCURACY</span>
</div>
<div class="w-px h-7 bg-white/10"></div>
<div class="flex flex-col">
<span class="text-slate-400 uppercase text-[10px]">WEBSITE</span>
<span class="text-base font-bold text-white font-display">WebsExplore</span>
</div>
</div>
<!-- Action Button -->
<div>
<a class="inline-flex items-center gap-2.5 px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-white border border-primary/40 hover:border-primary rounded-full font-medium text-xs uppercase tracking-wider font-mono transition-all shadow-glass-inset group" href="#">
<svg class="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
<path d="M12 20h9"></path>
<path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
</svg>
<span class="">Write a review</span>
<svg class="w-3.5 h-3.5 text-primary stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
<polyline points="9 18 15 12 9 6"></polyline>
</svg>
</a>
</div>
</div>
</div>
</section>
<!-- END: ReviewCalloutStrip -->
<!-- BEGIN: Live Verified Reviews Preview Ticker -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 relative z-10">
<div class="flex items-center justify-between mb-4">
<div class="flex items-center gap-2.5">
<span class="w-2 h-2 rounded-full bg-emerald-400 live-dot"></span>
<h3 class="text-xs uppercase font-mono tracking-widest text-slate-400">RECENT Verified Ingest Feed</h3>
</div>
<span class="text-[11px] font-mono text-emerald-400/80">LATENCY: 42ms • CONSENSUS: STABLE</span>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-4"><!-- Card 1 -->
<div class="glass-panel p-4 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<div class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
              EK
            </div>
<div>
<span class="text-xs font-semibold text-white block">Elena K.</span>
<span class="text-[10px] text-slate-400">reviewed <span class="text-slate-200">Cursor IDE</span></span>
</div>
</div>
<span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-primary border border-primary/20">VERIFIED</span>
</div>
<div class="flex items-center gap-1 mb-2">
<div class="flex text-primary">★★★★★</div>
<span class="text-[11px] font-mono text-slate-400 ml-1.5">2m ago</span>
</div>
<p class="text-xs text-slate-300 line-clamp-2 italic">
          "Zero friction code generation while building web apps. Unmatched speed and context indexing."
        </p>
</div>
<!-- Card 2 -->
<div class="glass-panel p-4 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<div class="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
              MR
            </div>
<div>
<span class="text-xs font-semibold text-white block">Marcus Reed</span>
<span class="text-[10px] text-slate-400">reviewed <span class="text-slate-200">Midjourney</span></span>
</div>
</div>
<span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-primary border border-primary/20">VERIFIED</span>
</div>
<div class="flex items-center gap-1 mb-2">
<div class="flex text-primary">★★★★★</div>
<span class="text-[11px] font-mono text-slate-400 ml-1.5">7m ago</span>
</div>
<p class="text-xs text-slate-300 line-clamp-2 italic">
          "v6.1 prompt adherence is incredible for creative design workflows. 10/10 consistency."
        </p>
</div>
<!-- Card 3 -->
<div class="glass-panel p-4 rounded-xl relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5">
<div class="flex items-center justify-between mb-2">
<div class="flex items-center gap-2">
<div class="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30 flex items-center justify-center font-bold text-xs">
              SL
            </div>
<div>
<span class="text-xs font-semibold text-white block">Sarah Lin</span>
<span class="text-[10px] text-slate-400">reviewed <span class="text-slate-200">Webtoon</span></span>
</div>
</div>
<span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-primary border border-primary/20">VERIFIED</span>
</div>
<div class="flex items-center gap-1 mb-2">
<div class="flex text-primary">★★★★★</div>
<span class="text-[11px] font-mono text-slate-400 ml-1.5">11m ago</span>
</div>
<p class="text-xs text-slate-300 line-clamp-2 italic">
          "Smooth reader UI with seamless vertical scrolling and daily updated serializations."
        </p>
</div></div>
</section>
<!-- END: Live Verified Reviews Preview Ticker -->
<!-- BEGIN: CategoryExplorerSection -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 relative z-10" data-purpose="categories-explorer">
<!-- Header with Controls -->
<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
<div>
<div class="text-xs font-mono uppercase tracking-wider text-primary mb-1">Index Navigation</div>
<h2 class="text-2xl sm:text-3xl font-bold text-white font-display">Explore by Category &amp; Niche</h2>
</div>
<!-- Navigation Arrows & See More -->
<div class="flex items-center gap-3 self-end sm:self-center">
<!-- Prev Button -->
<button aria-label="Previous categories" class="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors" type="button">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<polyline points="15 18 9 12 15 6"></polyline>
</svg>
</button>
<!-- Next Button -->
<button aria-label="Next categories" class="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors" type="button">
<svg class="w-4 h-4 stroke-current stroke-2 fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<polyline points="9 18 15 12 9 6"></polyline>
</svg>
</button>
<!-- See More Button -->
<a class="ml-2 px-4 py-2 text-xs font-mono font-semibold text-primary border border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors uppercase tracking-wider" href="#">
          View All Sectors →
        </a>
</div>
</div>
<!-- Category Items Grid / Row -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 text-center"><!-- 1. AI & Machine Learning -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<rect height="10" rx="2" width="18" x="3" y="11"></rect>
<circle cx="12" cy="5" r="2"></circle>
<path d="M12 7v4"></path>
<line x1="8" x2="8" y1="16" y2="16.01"></line>
<line x1="16" x2="16" y1="16" y2="16.01"></line>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">AI</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">4,820 websites</span>
</a>

<!-- 2. Web Comics & Manga -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
<path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">Comics</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">2,150 websites</span>
</a>

<!-- 3. Programming & Dev Tools -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<polyline points="16 18 22 12 16 6"></polyline>
<polyline points="8 6 2 12 8 18"></polyline>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">Dev Tools</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">5,340 websites</span>
</a>

<!-- 4. Design & Creative -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<circle cx="13.5" cy="6.5" r=".5"></circle>
<circle cx="17.5" cy="10.5" r=".5"></circle>
<circle cx="8.5" cy="7.5" r=".5"></circle>
<circle cx="6.5" cy="12.5" r=".5"></circle>
<path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">Designer</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">3,210 websites</span>
</a>

<!-- 5. Productivity & SaaS -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<rect height="14" rx="2" width="20" x="2" y="7"></rect>
<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">SaaS</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">5,420 websites</span>
</a>

<!-- 6. Entertainment & Streaming -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<circle cx="12" cy="12" r="10"></circle>
<polygon points="10 8 16 12 10 16 10 8"></polygon>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">Social Media</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">3,120 websites</span>
</a>

<!-- 7. Cloud & Hosting -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">Cloud</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">1,050 websites</span>
</a>

<!-- 8. Gaming & Web Apps -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<line x1="6" x2="10" y1="12" y2="12"></line>
<line x1="8" x2="8" y1="10" y2="14"></line>
<line x1="15" x2="15.01" y1="13" y2="13"></line>
<line x1="18" x2="18.01" y1="11" y2="11"></line>
<rect height="12" rx="2" width="20" x="2" y="6"></rect>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">Gaming</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">2,400 websites</span>
</a>

<!-- 9. Cybersecurity & VPN -->
<a class="glass-panel group flex flex-col items-center justify-between p-3.5 rounded-xl transition-all duration-300 hover:bg-surface-container-high hover:border-primary/50 hover:shadow-glow-emerald-sm min-h-[148px]" href="#">
<div class="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:border-primary/30 group-hover:scale-110 transition-all duration-300">
<svg class="w-6 h-6 stroke-current stroke-[1.75] fill-none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
</svg>
</div>
<div class="my-1.5">
<span class="text-xs font-semibold text-white group-hover:text-primary transition-colors block leading-tight">Security</span>
</div>
<span class="text-[10px] font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded w-full">780 websites</span>
</a></div>
</section><!-- BEGIN: ExclusiveVerifiedPartnersSection -->
<section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 relative z-10" data-purpose="exclusive-partners-showcase">
  <!-- Section Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/[0.08] pb-6"><div class="">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-primary/30 text-xs font-mono text-primary mb-3 shadow-glass-inset">
        <span class="w-1.5 h-1.5 rounded-full bg-primary live-dot"></span>
        <span class="">GLOBAL LEADERBOARD • CROWDSOURCED VERIFICATION</span>
      </div>
      <h2 class="text-2xl sm:text-4xl font-bold text-white font-display tracking-tight">Most Rated Websites</h2>
      <p class="text-sm text-slate-400 font-sans mt-2 max-w-2xl leading-relaxed">Explore platforms with the highest community rating volume worldwide. Ratings and counts are continuously submitted and verified via peer telemetry consensus.</p>
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      <span class="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-mono font-medium flex items-center gap-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
        Top Volume Ranking
      </span>
      <span class="px-3 py-1.5 rounded-lg bg-surface-container border border-white/10 text-slate-400 text-xs font-mono">~1.4M+ Community Votes</span>
    </div></div>

  <!-- Partner Cards Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"><!-- Card 1: Wikipedia -->
    <div class="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-white text-lg group-hover:border-primary/40 transition-colors">
              W
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">Wikipedia</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">wikipedia.org</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-primary border border-primary/25 font-medium">#1 Most Rated</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-4">Free multilingual open encyclopedia authored and vetted collaboratively by millions of global contributors.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.9</span>
          <span class="text-primary text-[11px] font-medium">(342,800+ reviews)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect <span class="">→</span>
        </a>
      </div>
    </div>

    <!-- Card 2: GitHub -->
    <div class="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-white text-lg group-hover:border-primary/40 transition-colors">
              GH
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">GitHub</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">github.com</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium">#2 Most Rated</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-4">The definitive developer platform for open-source code hosting, Git version control, CI/CD, and peer reviews.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.9</span>
          <span class="text-primary text-[11px] font-medium">(286,400+ reviews)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect <span class="">→</span>
        </a>
      </div>
    </div>

    <!-- Card 3: OpenAI ChatGPT -->
    <div class="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-white text-lg group-hover:border-primary/40 transition-colors">
              AI
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">ChatGPT</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">chatgpt.com</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-violet-500/20 text-violet-400 border border-violet-500/30 font-medium">#3 Most Rated</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-4">Conversational AI assistant for reasoning, code development, creative generation, and dynamic research tasks.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.8</span>
          <span class="text-primary text-[11px] font-medium">(241,150+ reviews)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect <span class="">→</span>
        </a>
      </div>
    </div>

    <!-- Card 4: Reddit -->
    <div class="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-white text-lg group-hover:border-primary/40 transition-colors">
              RD
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">Reddit</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">reddit.com</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-primary border border-primary/25 font-medium">#4 Most Rated</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-4">Vast network of community-driven subreddits sharing authentic user commentary, advice, news, and unfiltered feedback.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★☆</div>
          <span class="font-bold text-white font-display">4.6</span>
          <span class="text-primary text-[11px] font-medium">(198,720+ reviews)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect <span class="">→</span>
        </a>
      </div>
    </div>

    <!-- Card 5: YouTube -->
    <div class="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-white text-lg group-hover:border-primary/40 transition-colors">
              YT
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">YouTube</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">youtube.com</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-primary border border-primary/25 font-medium">#5 Most Rated</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-4">The preeminent video streaming ecosystem hosting independent creators, educational media, and live broadcasts.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.7</span>
          <span class="text-primary text-[11px] font-medium">(175,900+ reviews)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect <span class="">→</span>
        </a>
      </div>
    </div>

    <!-- Card 6: Stack Overflow -->
    <div class="glass-panel rounded-2xl p-5 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-white text-lg group-hover:border-primary/40 transition-colors">
              SO
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">Stack Overflow</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">stackoverflow.com</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-primary border border-primary/25 font-medium">#6 Most Rated</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-4">Essential Q&amp;A repository for software engineers, debugging, algorithm design, and architecture discussions.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.8</span>
          <span class="text-primary text-[11px] font-medium">(148,320+ reviews)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect <span class="">→</span>
        </a>
      </div>
    </div></div>

  <!-- Promotional Claiming Banner Box -->
  <div class="p-4 mb-6 rounded-xl border border-white/10 bg-surface-container/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
    <div class="flex items-center gap-2.5">
      <span class="w-2 h-2 rounded-full bg-emerald-400 live-dot"></span>
      <span class=""><strong class="text-slate-200">Crowdsourced Verification Note:</strong> All review metrics and website counts (~est.) are continuously submitted and ranked by the community. Entries are being actively updated in realtime.</span>
    </div>
    <a href="#" class="text-primary hover:underline shrink-0 font-semibold">Submit / Verify a Website →</a>
  </div><!-- BEGIN: RecentlyAddedWebsitesSection -->
<div class="mb-16 pt-6" data-purpose="recently-added-showcase">
  <!-- Section Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-white/[0.08] pb-6">
    <div>
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-primary/30 text-xs font-mono text-primary mb-3 shadow-glass-inset">
        <span class="w-1.5 h-1.5 rounded-full bg-primary live-dot"></span>
        <span class="">LIVE SUBMISSION FEED • CROWDSOURCED</span>
      </div>
      <h2 class="text-2xl sm:text-4xl font-bold text-white font-display tracking-tight">Recently Added Websites</h2>
      <p class="text-sm text-slate-400 font-sans mt-2 max-w-2xl leading-relaxed">Websites freshly submitted by community contributors in the last 24h. Metadata, safety scores, and consensus telemetry are actively being indexed.</p>
    </div>
    <div class="flex items-center gap-3 flex-wrap">
      <a href="#" class="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-colors inline-flex items-center gap-1.5">
        <span class="font-bold text-primary">+</span> Submit Website
      </a>
      <a href="#" class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/40 text-primary text-xs font-mono font-medium transition-all shadow-glass-inset">
        View All (64+) →
      </a>
    </div>
  </div>

  <!-- Cards Grid (6 Recent Additions, 3-Column Matching Most Rated) -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
    <!-- Card 1: Perplexity AI -->
    <div class="glass-panel rounded-2xl p-6 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-primary text-base group-hover:border-primary/40 transition-colors shrink-0">
              PX
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">Perplexity AI</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">perplexity.ai</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-primary border border-primary/25 font-medium shrink-0">14m ago</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/25 font-medium">AI &amp; Research</span>
          <span class="text-[10px] font-mono text-slate-500">by @alex_dev</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-5">Conversational answer engine with direct citations, academic cross-referencing, and real-time web grounding.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.8</span>
          <span class="text-slate-400 text-[11px]">(142 initial votes)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect / Vote →
        </a>
      </div>
    </div>

    <!-- Card 2: Bolt.new -->
    <div class="glass-panel rounded-2xl p-6 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-cyan-400 text-base group-hover:border-primary/40 transition-colors shrink-0">
              BL
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">Bolt.new</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">bolt.new</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium shrink-0">42m ago</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium">Dev &amp; Coding</span>
          <span class="text-[10px] font-mono text-slate-500">by @nguyen_ui</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-5">In-browser full-stack development, instant Node container initialization, and real-time execution sandbox.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.7</span>
          <span class="text-slate-400 text-[11px]">(89 initial votes)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect / Vote →
        </a>
      </div>
    </div>

    <!-- Card 3: MangaDex -->
    <div class="glass-panel rounded-2xl p-6 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-emerald-400 text-base group-hover:border-primary/40 transition-colors shrink-0">
              MD
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">MangaDex</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">mangadex.org</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium shrink-0">2h ago</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Comics &amp; Manga</span>
          <span class="text-[10px] font-mono text-slate-500">by @otaku_reader</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-5">Open ad-free community-driven online manga reader and scanner hub with high-resolution image servers.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.9</span>
          <span class="text-slate-400 text-[11px]">(310 initial votes)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect / Vote →
        </a>
      </div>
    </div>

    <!-- Card 4: v0.dev -->
    <div class="glass-panel rounded-2xl p-6 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-violet-400 text-base group-hover:border-primary/40 transition-colors shrink-0">
              V0
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">v0.dev</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">v0.dev</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-violet-500/20 text-violet-400 border border-violet-500/30 font-medium shrink-0">3h ago</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-violet-500/20 text-violet-400 border border-violet-500/30 font-medium">Design &amp; UI</span>
          <span class="text-[10px] font-mono text-slate-500">by @design_core</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-5">Generative UI system powered by AI to synthesize modular React, shadcn/ui, and modern Tailwind components.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★☆</div>
          <span class="font-bold text-white font-display">4.6</span>
          <span class="text-slate-400 text-[11px]">(175 initial votes)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect / Vote →
        </a>
      </div>
    </div>

    <!-- Card 5: Raycast Store -->
    <div class="glass-panel rounded-2xl p-6 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-white text-base group-hover:border-primary/40 transition-colors shrink-0">
              RC
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">Raycast Store</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">raycast.com</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-primary border border-primary/25 font-medium shrink-0">4h ago</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/25 font-medium">Productivity</span>
          <span class="text-[10px] font-mono text-slate-500">by @kevin_keys</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-5">Extensible desktop command launcher ecosystem with community extensions, script commands, and quick AI tools.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.9</span>
          <span class="text-slate-400 text-[11px]">(260 initial votes)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect / Vote →
        </a>
      </div>
    </div>

    <!-- Card 6: Cursor IDE -->
    <div class="glass-panel rounded-2xl p-6 border border-white/[0.08] hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
      <div>
        <div class="flex items-start justify-between gap-3 mb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-surface-container border border-white/10 flex items-center justify-center font-display font-bold text-primary text-base group-hover:border-primary/40 transition-colors shrink-0">
              CR
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="text-base font-bold text-white font-display group-hover:text-primary transition-colors">Cursor IDE</h3>
                <svg class="w-4 h-4 text-primary fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path></svg>
              </div>
              <span class="text-xs font-mono text-slate-400 block">cursor.com</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-primary border border-primary/25 font-medium shrink-0">5h ago</span>
        </div>
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-primary/10 text-primary border border-primary/25 font-medium">Dev &amp; Coding</span>
          <span class="text-[10px] font-mono text-slate-500">by @dev_sam</span>
        </div>
        <p class="text-xs text-slate-300 font-sans leading-relaxed mb-5">AI-first code editor engineered for hyper-fast software creation with multi-file edits and repo-wide understanding.</p>
      </div>
      <div class="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono">
        <div class="flex items-center gap-2">
          <div class="flex text-primary text-sm">★★★★★</div>
          <span class="font-bold text-white font-display">4.9</span>
          <span class="text-slate-400 text-[11px]">(420 initial votes)</span>
        </div>
        <a href="#" class="text-primary hover:text-primary-bright font-medium inline-flex items-center gap-1 transition-colors">
          Inspect / Vote →
        </a>
      </div>
    </div>
  </div>
</div>
<!-- END: RecentlyAddedWebsitesSection --><div class="relative rounded-2xl overflow-hidden border border-primary/30 bg-gradient-to-r from-surface-container via-[#131d27] to-surface-container p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
    <div class="relative z-10">
      <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-primary/10 border border-primary/25 text-[11px] font-mono text-primary mb-2">
        <span class="">EXCLUSIVE ONBOARDING</span>
      </div>
      <h3 class="text-xl sm:text-2xl font-bold text-white font-display mb-1">Looking to feature your platform or new discover?</h3>
      <p class="text-xs sm:text-sm text-slate-400 font-sans max-w-xl leading-relaxed">Strengthen your digital reputation with cryptographic review telemetry, fraud-proof scoring, and direct search index exposure.</p>
    </div>
    <div class="relative z-10 shrink-0 w-full sm:w-auto">
      <a href="#" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary-bright text-black font-semibold text-xs font-mono uppercase tracking-wider rounded-xl transition-all shadow-glow-emerald-sm">
        <span class="">Login for submission</span>
        <svg class="w-4 h-4 stroke-current stroke-2 fill-none" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </a>
    </div>
  </div>
</section>
<!-- END: ExclusiveVerifiedPartnersSection -->
<!-- END: CategoryExplorerSection -->
<!-- Modern Trust Architecture Micro-Footer -->
<footer class="border-t border-white/10 bg-[#070a10] pt-16 pb-12 text-xs font-mono text-slate-400 relative z-10"><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 pb-12"><div class="lg:col-span-2 space-y-4"><div class="flex items-center gap-2"><span class="text-xl font-bold tracking-tight text-white font-display">Webs<span class="text-primary">Explore</span></span><span class="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-primary/10 text-primary border border-primary/25 font-semibold">VERIFIED TELEMETRY</span></div><p class="text-xs text-slate-400 font-sans max-w-md leading-relaxed">Forensic crowd-telemetry and verified audit systems for the modern web. Independent verification scores powered by cryptographic activity indexing and multi-factor evaluation models.</p><div class="flex items-center gap-2.5 pt-1 flex-wrap"><div class="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-container border border-white/10 text-slate-400 text-[11px] font-mono"><span class="">1,142,890 Websites Indexed</span></div></div></div><div><p class="text-sm font-bold text-white font-display mb-4">Security</p><ul class="space-y-2.5 text-xs font-sans"><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">How TrustScore Works</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Scoring Parameters (v3.2)</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Anti-Fraud Guardrails</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Cryptographic Proof Audit</a></li></ul></div><div><p class="text-sm font-bold text-white font-display mb-4">Discover</p><ul class="space-y-2.5 text-xs font-sans"><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#categories-explorer">All Software Niches</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#most-rated">Top Rated Platforms</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#recently-added">Recently Added</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Submit a Website</a></li></ul></div><div><p class="text-sm font-bold text-white font-display mb-4">About</p><ul class="space-y-2.5 text-xs font-sans"><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Integrity Standards</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Privacy Architecture</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Terms of Service</a></li><li class="flex items-center gap-1.5"><a class="text-slate-400 hover:text-primary transition-colors" href="#">Dispute Resolution</a></li></ul></div></div><div class="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono"><p class="">© 2026 WebsExplore by Athixo</p><div class="flex items-center gap-4"><span class="text-slate-400">Latency: 22ms</span></div></div></div></footer>