import fs from 'fs';

const appCode = `import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { ArrowRight, MapPin, ArrowUpRight, Play, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2500&auto=format&fit=crop",
  chair: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop",
  tools: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2000&auto=format&fit=crop",
  detail: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop",
  ambient: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=2000&auto=format&fit=crop",
  craftsman1: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1500&auto=format&fit=crop",
  interior: "https://images.unsplash.com/photo-1534723347310-51411b6fd7f5?q=80&w=2500&auto=format&fit=crop"
};

const SERVICES = [
  { 
    title: "The Executive Cut", 
    price: "$65", 
    time: "45 Min", 
    desc: "A meticulous grooming session starting with a detailed consultation. Includes a precision cut tailored to your head shape, a hot towel neck shave, and finishing with premium styling products.",
    tags: ["Precision", "Styling"]
  },
  { 
    title: "Royal Hot Towel Shave", 
    price: "$55", 
    time: "45 Min", 
    desc: "Experience the ultimate relaxation with our traditional straight razor shave. Features multiple hot towels, premium pre-shave oils, warm lather, and a soothing post-shave balm.",
    tags: ["Relaxation", "Traditional"]
  },
  { 
    title: "Beard Sculpting", 
    price: "$40", 
    time: "30 Min", 
    desc: "Expert beard trimming, shaping, and precise razor lining. Finished with conditioning beard oils to nourish the hair and skin beneath for a pristine look.",
    tags: ["Sculpting", "Care"]
  },
  { 
    title: "The Full Treatment", 
    price: "$110", 
    time: "90 Min", 
    desc: "Our most comprehensive service. Combines The Executive Cut and the Royal Hot Towel Shave into one deeply relaxing, transformative grooming experience.",
    tags: ["Signature", "Complete"]
  }
];

// Utility: Cursor
const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0, cursorX = 0, cursorY = 0;
    let ringScale = 1, dotScale = 1;
    let animationFrameId: number;
    let isHovering = false;
    
    // Check if it's touch device, we don't need custom cursor on touch
    if (window.matchMedia('(pointer: coarse)').matches) return;
    
    const loop = () => {
      dotX += (cursorX - dotX) * 0.4;
      dotY += (cursorY - dotY) * 0.4;
      ringX += (cursorX - ringX) * 0.15;
      ringY += (cursorY - ringY) * 0.15;
      
      const targetDotScale = isHovering ? 0 : 1;
      const targetRingScale = isHovering ? 1.8 : 1;
      
      dotScale += (targetDotScale - dotScale) * 0.15;
      ringScale += (targetRingScale - ringScale) * 0.15;

      if (cursorDotRef.current && cursorRingRef.current) {
        cursorDotRef.current.style.transform = \`translate3d(\${dotX}px, \${dotY}px, 0) translate(-50%, -50%) scale(\${dotScale})\`;
        cursorRingRef.current.style.transform = \`translate3d(\${ringX}px, \${ringY}px, 0) translate(-50%, -50%) scale(\${ringScale})\`;
        if (isHovering) {
           cursorRingRef.current.style.backgroundColor = 'rgba(196, 169, 98, 0.1)';
        } else {
           cursorRingRef.current.style.backgroundColor = 'transparent';
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    const onMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      const target = e.target as HTMLElement;
      isHovering = !!target.closest('a, button, [data-cursor-hover="true"]');
    };
    
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hidden lg:block">
      <div ref={cursorDotRef} className="fixed top-0 left-0 w-[6px] h-[6px] bg-[#C4A962] rounded-full pointer-events-none z-[9999] mix-blend-screen" style={{ transition: 'transform 0s, background-color 0.3s' }} />
      <div ref={cursorRingRef} className="fixed top-0 left-0 w-12 h-12 border border-[#C4A962]/40 rounded-full pointer-events-none z-[9999] flex items-center justify-center" style={{ transition: 'transform 0s, background-color 0.3s' }}>
      </div>
    </div>
  );
};

const SplitText = ({ text, delay = 0, className = '' }: { text: string, delay?: number, className?: string }) => {
  return (
    <span className={cn("inline-block overflow-hidden", className)}>
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0, rotateZ: 5 }}
          whileInView={{ y: "0%", opacity: 1, rotateZ: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: delay + index * 0.03
          }}
          className="inline-block origin-bottom-left"
        >
          {char === ' ' ? '\\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 2400;

    const updateCounter = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 4);
      setCounter(Math.floor(ease * 100));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setTimeout(onComplete, 800);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(animationFrameId);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col justify-end p-8 md:p-16 bg-[#0c0c0c] text-[#F5F2EB]"
      exit={{ y: "-100%" }}
      transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="flex justify-between items-end border-b border-[#F5F2EB]/20 pb-4 relative overflow-hidden w-full max-w-[1600px] mx-auto">
         <motion.div 
           initial={{ y: 50, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 1, delay: 0.2 }}
           className="font-serif text-2xl md:text-5xl italic font-light tracking-widest text-[#A69B8D]"
         >
           Gents & Blades
         </motion.div>
         <div className="font-sans text-7xl md:text-[10rem] font-light tabular-nums leading-none tracking-tighter">
           {counter}
         </div>
         
         <motion.div 
           className="absolute bottom-0 left-0 h-[2px] bg-[#A69B8D]"
           initial={{ width: "0%" }}
           animate={{ width: \`\${counter}%\` }}
           transition={{ duration: 0.1 }}
         />
      </div>
    </motion.div>
  );
};

const ServiceAccordionItem = ({ service, index, expanded, onClick }: any) => {
  const isOpen = expanded === index;
  
  return (
    <div className="border-b border-white/10 group">
      <button 
        data-cursor-hover="true"
        onClick={() => onClick(isOpen ? null : index)}
        className="w-full py-8 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-6 md:gap-12 w-full md:w-auto">
          <span className="font-sans text-xs tracking-widest text-[#A69B8D]/50 w-8">0{index + 1}</span>
          <h3 className={cn(
            "font-serif text-3xl md:text-5xl lg:text-6xl font-light transition-all duration-500",
            isOpen ? "text-[#A69B8D] italic translate-x-4" : "text-[#F5F2EB] group-hover:translate-x-4 group-hover:text-[#A69B8D]"
          )}>
            {service.title}
          </h3>
        </div>
        <div className="flex items-center justify-between w-full md:w-auto mt-6 md:mt-0 gap-12 lg:pr-12 md:opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <span className="font-sans text-sm tracking-[0.2em] uppercase text-white/50">{service.time}</span>
           <span className="font-serif text-2xl italic text-[#A69B8D]">{service.price}</span>
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-12 md:pl-28 flex flex-col md:flex-row gap-8 lg:gap-20 items-start">
              <p className="font-sans text-lg md:text-xl text-white/60 leading-relaxed font-light max-w-xl">
                {service.desc}
              </p>
              <div className="flex gap-4">
                {service.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-widest text-[#A69B8D]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navigation = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-12 flex justify-between items-center text-[#F5F2EB] mix-blend-difference pointer-events-none">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 2.8 }}
             className="font-serif italic text-2xl md:text-3xl tracking-widest font-light pointer-events-auto"
           >
             Gents & Blades<span className="text-[#A69B8D]">.</span>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 2.9 }}
             className="flex gap-8 items-center pointer-events-auto"
           >
             <button data-cursor-hover="true" className="font-sans text-[11px] uppercase tracking-[0.25em] hover:text-[#A69B8D] transition-colors hidden md:block">
                Appointments
             </button>
             <button data-cursor-hover="true" className="font-sans text-[11px] uppercase tracking-[0.25em] relative group overflow-hidden pl-4 md:border-l border-white/20">
               <span className="inline-block group-hover:-translate-y-[150%] transition-transform duration-500">Menu</span>
               <span className="absolute left-4 top-full group-hover:-translate-y-full transition-transform duration-500 text-[#A69B8D]">Menu</span>
             </button>
           </motion.div>
        </nav>
    );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [expandedService, setExpandedService] = useState<number | null>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lenis Smooth Scroll
    if (!loading) {
      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
      
      return () => {
        lenis.destroy();
      };
    }
  }, [loading]);
  
  // Parallax calculations
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <>
      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="bg-[#0c0c0c] min-h-screen selection:bg-[#A69B8D] selection:text-[#0c0c0c] flex flex-col font-sans overflow-x-hidden">
        
        <Navigation />

        {/* 1. Cinematic Hero Section */}
        <section className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12 bg-black">
          {/* Parallax Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <motion.div 
               style={{ y: heroY, scale: heroScale }} 
               className="w-full h-[120%]"
            >
              <img 
                src={IMAGES.hero} 
                alt="Luxury Barbering" 
                className="w-full h-full object-cover object-[center_30%] grayscale opacity-60" 
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/40 via-[#0c0c0c]/10 to-transparent" />
          </div>

          <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col">
             <div className="overflow-hidden">
               <motion.h1 
                 initial={{ y: "100%", rotate: 2 }}
                 animate={{ y: loading ? "100%" : "0%", rotate: 0 }}
                 transition={{ duration: 1.2, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
                 className="font-serif text-[clamp(4.5rem,14vw,16rem)] leading-[0.8] tracking-tighter text-[#F5F2EB]"
               >
                 SARTORIAL<br/>
                 <span className="italic font-light text-[#A69B8D]">Grooming.</span>
               </motion.h1>
             </div>
             
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
               transition={{ duration: 1, delay: 3.4 }}
               className="mt-12 md:mt-24 flex flex-col md:flex-row gap-8 justify-between items-start md:items-end w-full"
             >
                <p className="max-w-md text-white/60 text-sm md:text-base leading-relaxed font-light tracking-wide">
                  Establishing a new standard in modern gentlemens grooming. Where architectural precision meets old-world craftsmanship.
                </p>
                <button data-cursor-hover="true" className="group flex items-center gap-4 text-[#A69B8D] border border-[#A69B8D] px-8 py-4 rounded-full hover:bg-[#A69B8D] hover:text-[#0c0c0c] transition-all duration-500 overflow-hidden relative">
                   <span className="relative z-10 font-sans text-xs uppercase tracking-widest font-bold">Discover</span>
                   <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-2 transition-transform" />
                </button>
             </motion.div>
          </div>
        </section>

        {/* 2. Editorial About Section */}
        <section className="relative py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
           <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-32 w-full">
              {/* Left text column */}
              <div className="w-full lg:w-5/12 flex flex-col lg:sticky lg:top-48 z-10 self-start">
                 <div className="font-sans uppercase text-[10px] tracking-[0.3em] text-[#A69B8D] mb-12 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-[#A69B8D]/50"></span>
                    The Ethos
                 </div>
                 
                 <h2 className="font-serif text-4xl md:text-6xl font-light text-[#F5F2EB] leading-[1.2] mb-12">
                   Not merely a haircut,<br/> 
                   but a <span className="italic text-[#A69B8D]">ritual of restoration.</span>
                 </h2>

                 <p className="font-sans text-lg md:text-xl text-white/50 leading-relaxed font-light mb-8">
                   We reject the rush of the modern barbershop. We create a sanctuary for the modern gentleman, focusing on detail, precision, and an immersive atmosphere that allows you to reset.
                 </p>
                 
                 <a href="#" data-cursor-hover="true" className="inline-flex items-center gap-4 text-xs font-sans uppercase tracking-[0.2em] text-[#F5F2EB] group w-max">
                   Learn more about our philosophy
                   <span className="w-8 h-[1px] bg-white group-hover:w-16 transition-all duration-300"></span>
                 </a>
              </div>
              
              {/* Right Images Masonry */}
              <div className="w-full lg:w-7/12 flex flex-col md:flex-row gap-8 lg:gap-10 mt-16 lg:mt-0">
                 <div className="flex flex-col gap-10 md:mt-24 w-full md:w-1/2">
                    <motion.div 
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative overflow-hidden rounded-md"
                    >
                      <div className="aspect-[3/4] w-full overflow-hidden">
                        <img src={IMAGES.detail} alt="Craftsmanship" className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-transform duration-1000 ease-out" />
                      </div>
                      <p className="mt-4 text-xs uppercase tracking-widest text-[#A69B8D]">Precision Cut</p>
                    </motion.div>
                 </div>
                 <div className="flex flex-col gap-10 w-full md:w-1/2">
                    <motion.div 
                      initial={{ opacity: 0, y: 100 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative overflow-hidden rounded-md"
                    >
                      <div className="aspect-[4/5] w-full overflow-hidden">
                        <img src={IMAGES.tools} alt="Tools" className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-transform duration-1000 ease-out" />
                      </div>
                      <p className="mt-4 text-xs uppercase tracking-widest text-[#A69B8D]">Curated Tools</p>
                    </motion.div>
                 </div>
              </div>
           </div>
        </section>

        {/* 3. Immersive Parallax Break */}
        <section className="relative w-full h-[120vh] overflow-hidden">
           <motion.div 
              style={{ y: useTransform(scrollYProgress, [0.4, 0.8], ["-15%", "15%"]) }}
              className="absolute inset-0 w-full h-[130%]"
           >
               <img src={IMAGES.ambient} alt="Interior Atmosphere" className="w-full h-full object-cover object-center grayscale opacity-80 mix-blend-screen" />
           </motion.div>
           <div className="absolute inset-0 bg-[#0c0c0c]/30 mix-blend-multiply"></div>
           
           <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10 pointer-events-none">
              <motion.h2 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
                 className="font-serif text-[clamp(4rem,10vw,10rem)] italic leading-none drop-shadow-2xl text-white"
              >
                 The Inner Sanctum
              </motion.h2>
              <p className="mt-8 uppercase font-sans tracking-[0.4em] text-xs text-white/50 max-w-sm">
                 Where exclusivity is standard.
              </p>
           </div>
        </section>

        {/* 4. The Services (Accordion) */}
        <section className="py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
           <div className="flex flex-col mb-20 md:mb-32 md:flex-row justify-between items-end gap-10">
              <div className="flex flex-col md:w-2/3">
                 <div className="font-sans uppercase text-[10px] tracking-[0.3em] text-[#A69B8D] mb-8 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-[#A69B8D]/50"></span>
                    Service Repertoire
                 </div>
                 <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#F5F2EB] leading-[1.1]">
                    Curated <span className="italic text-[#A69B8D]">Offerings.</span>
                 </h2>
              </div>
              <button data-cursor-hover="true" className="w-full md:w-auto text-xs font-sans uppercase tracking-[0.2em] border border-white/20 px-8 py-4 rounded-full text-white/70 hover:bg-white hover:text-black transition-colors duration-300 whitespace-nowrap">
                 View Full Menu
              </button>
           </div>

           <div className="border-t border-white/10 w-full">
             {SERVICES.map((service, index) => (
                <ServiceAccordionItem 
                   key={index} 
                   service={service} 
                   index={index} 
                   expanded={expandedService} 
                   onClick={setExpandedService} 
                />
             ))}
           </div>
        </section>

        {/* 5. Our Masters */}
        <section className="py-32 px-6 md:px-12 bg-[#050505] border-y border-white/5 relative overflow-hidden text-center">
          <div className="max-w-[1600px] mx-auto">
             <div className="font-sans uppercase text-[10px] tracking-[0.3em] text-[#A69B8D] mb-16 inline-flex items-center gap-4">
                <span className="w-8 h-[1px] bg-[#A69B8D]/50"></span>
                The Craftsmen
                <span className="w-8 h-[1px] bg-[#A69B8D]/50"></span>
             </div>
             
             <div className="flex flex-col md:flex-row gap-12 lg:gap-24 justify-center mt-12 w-full max-w-5xl mx-auto">
                <div className="group relative w-full md:w-1/2 flex flex-col items-center">
                   <div className="w-full aspect-[4/5] overflow-hidden rounded-md mb-8">
                     <img src={IMAGES.craftsman1} alt="Master Barber" className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                   </div>
                   <h4 className="font-serif text-4xl font-light text-[#F5F2EB]">Julian <span className="italic text-[#A69B8D]">Black</span></h4>
                   <p className="font-sans text-xs uppercase tracking-widest text-white/40 mt-4">Founder & Master Barber</p>
                </div>
                
                <div className="group relative w-full md:w-1/2 flex flex-col items-center md:mt-32">
                   <div className="w-full aspect-[4/5] overflow-hidden rounded-md mb-8">
                     <img src={IMAGES.interior} alt="Master Barber" className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out" />
                   </div>
                   <h4 className="font-serif text-4xl font-light text-[#F5F2EB]">Elias <span className="italic text-[#A69B8D]">Vance</span></h4>
                   <p className="font-sans text-xs uppercase tracking-widest text-white/40 mt-4">Senior Grooming Specialist</p>
                </div>
             </div>
          </div>
        </section>

        {/* 6. Footer */}
        <footer className="relative bg-[#0c0c0c] pt-32 pb-12 px-6 md:px-12 overflow-hidden flex flex-col justify-end">
           <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 border-b border-white/10 pb-20">
              
              <div className="flex flex-col gap-16 w-full lg:w-7/12">
                 <h3 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light leading-none text-[#F5F2EB]">
                    Reserve your <br/>
                    <span className="italic text-[#A69B8D]">chair.</span>
                 </h3>
                 <div className="flex flex-col sm:flex-row gap-16 sm:gap-24">
                   <div className="flex flex-col gap-6">
                      <p className="font-sans text-[#A69B8D] text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                        <MapPin className="w-4 h-4" /> Location
                      </p>
                      <p className="font-sans text-white/70 font-light leading-loose">
                         404 Sartorial Ave<br/>
                         Metropolis District 9<br/>
                         NY 10012
                      </p>
                   </div>
                   <div className="flex flex-col gap-6">
                      <p className="font-sans text-[#A69B8D] text-xs tracking-[0.2em] uppercase">Select Hours</p>
                      <p className="font-sans text-white/70 font-light leading-loose">
                         Mon - Fri: 9am - 8pm<br/>
                         Sat: 10am - 6pm<br/>
                         Sun: Closed
                      </p>
                   </div>
                 </div>
              </div>

              <div className="flex flex-col gap-8 w-full lg:w-4/12 text-left font-sans text-sm tracking-[0.2em] uppercase font-light lg:ml-auto">
                 <a href="#" className="flex items-center justify-between border-b border-white/10 pb-6 group hover:text-[#A69B8D] transition-colors relative overflow-hidden w-full">
                    <span>Instagram</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                 </a>
                 <a href="#" className="flex items-center justify-between border-b border-white/10 pb-6 group hover:text-[#A69B8D] transition-colors relative overflow-hidden w-full">
                    <span>Journal</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                 </a>
                 <a href="#" className="flex items-center justify-between border-b border-white/10 pb-6 group hover:text-[#A69B8D] transition-colors relative overflow-hidden w-full">
                    <span>Book Appointment</span>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                 </a>
              </div>
           </div>

           <div className="relative z-10 w-full max-w-[1600px] mx-auto mt-12 flex flex-col md:flex-row justify-between items-center gap-8 font-sans text-[10px] uppercase tracking-[0.2em] text-white/30">
              <p>&copy; {new Date().getFullYear()} GENTS & BLADES. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-10">
                 <a href="#" data-cursor-hover="true" className="hover:text-[#A69B8D] transition-colors">Privacy</a>
                 <a href="#" data-cursor-hover="true" className="hover:text-[#A69B8D] transition-colors">Terms</a>
              </div>
           </div>

           {/* Giant Background Typography */}
           <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none opacity-[0.03] select-none text-[#F5F2EB] z-0 overflow-hidden">
              <h1 className="font-serif font-black italic tracking-tighter mix-blend-screen text-center w-full" style={{ fontSize: 'clamp(10rem, 30vw, 500px)' }}>BLEND</h1>
           </div>
        </footer>

      </div>
    </>
  );
}
`;

fs.writeFileSync('src/App.tsx', appCode);
