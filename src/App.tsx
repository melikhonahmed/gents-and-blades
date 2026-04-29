import React, { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import { ArrowRight, MapPin, ArrowUpRight, Play, Star, Plus } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2500&auto=format&fit=crop",
  chair: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop",
  tools: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2000&auto=format&fit=crop",
  detail: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=2000&auto=format&fit=crop",
  ambient: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=2000&auto=format&fit=crop",
  gallery1: "https://images.unsplash.com/photo-1534723347310-51411b6fd7f5?q=80&w=1500&auto=format&fit=crop",
  gallery2: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1500&auto=format&fit=crop",
  gallery3: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1500&auto=format&fit=crop",
  gallery4: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1500&auto=format&fit=crop",
  product1: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
  product2: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000&auto=format&fit=crop",
};

const SERVICES = [
  { 
    title: "The Executive Cut", 
    price: "$65", 
    time: "45 Min", 
    desc: "A meticulous grooming session starting with a detailed consultation. Includes a precision cut tailored to your head shape, a hot towel neck shave, and finishing with premium styling products.",
    img: IMAGES.gallery1
  },
  { 
    title: "Royal Hot Towel Shave", 
    price: "$55", 
    time: "45 Min", 
    desc: "Experience the ultimate relaxation with our traditional straight razor shave. Features multiple hot towels, premium pre-shave oils, warm lather, and a soothing post-shave balm.",
    img: IMAGES.chair
  },
  { 
    title: "Beard Sculpting", 
    price: "$40", 
    time: "30 Min", 
    desc: "Expert beard trimming, shaping, and precise razor lining. Finished with conditioning beard oils to nourish the hair and skin beneath for a pristine look.",
    img: IMAGES.gallery4
  },
  { 
    title: "The Full Treatment", 
    price: "$110", 
    time: "90 Min", 
    desc: "Our most comprehensive service. Combines The Executive Cut and the Royal Hot Towel Shave into one deeply relaxing, transformative grooming experience.",
    img: IMAGES.gallery3
  }
];

const CustomCursor = () => {
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dotX = 0, dotY = 0, cursorX = 0, cursorY = 0;
    let dotScale = 1;
    let animationFrameId: number;
    let isHovering = false;
    let hoverType = "";
    
    if (window.matchMedia("(pointer: coarse)").matches) return;
    
    const loop = () => {
      dotX += (cursorX - dotX) * 0.2;
      dotY += (cursorY - dotY) * 0.2;
      
      const targetDotScale = isHovering ? 2.5 : 1;
      dotScale += (targetDotScale - dotScale) * 0.15;

      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        
        if (isHovering && hoverType === 'play') {
           cursorDotRef.current.style.mixBlendMode = 'normal';
           cursorDotRef.current.style.backgroundColor = '#C4A962';
           cursorDotRef.current.innerHTML = '<span style="color: black; font-size: 5px; font-weight: bold; transform: scale(0.4);">PLAY</span>';
        } else if (isHovering) {
           cursorDotRef.current.style.mixBlendMode = 'difference';
           cursorDotRef.current.style.backgroundColor = 'white';
           cursorDotRef.current.innerHTML = '';
        } else {
           cursorDotRef.current.style.mixBlendMode = 'difference';
           cursorDotRef.current.style.backgroundColor = 'white';
           cursorDotRef.current.innerHTML = '';
        }
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    animationFrameId = requestAnimationFrame(loop);

    const onMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      const target = e.target as HTMLElement;
      const hoverEl = target.closest('a, button, [data-cursor-hover="true"]');
      isHovering = !!hoverEl;
      hoverType = hoverEl?.getAttribute('data-cursor-type') || '';
    };
    
    window.addEventListener('mousemove', onMouseMove);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hidden lg:block">
      <div 
        ref={cursorDotRef} 
        className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center pt-[1px]" 
        style={{ transition: 'background-color 0.3s, mix-blend-mode 0.3s' }} 
      />
    </div>
  );
};

const MagneticButton = ({ children, className, ...props }: any) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const springX = useSpring(position.x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(position.y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      data-cursor-hover="true"
      {...props}
    >
      <motion.div style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </motion.button>
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
           animate={{ width: `${counter}%` }}
           transition={{ duration: 0.1 }}
         />
      </div>
    </motion.div>
  );
};

const Navigation = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-12 flex justify-between items-center text-[#F5F2EB] mix-blend-difference pointer-events-none">
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.2 }}
             className="font-serif italic text-2xl md:text-3xl tracking-widest font-light pointer-events-auto"
           >
             Gents & Blades<span className="text-[#A69B8D]">.</span>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.3 }}
             className="flex gap-10 items-center pointer-events-auto mix-blend-difference"
           >
             <a href="#" data-cursor-hover="true" className="font-sans text-[11px] uppercase tracking-[0.25em] hover:text-[#A69B8D] transition-colors hidden md:block">
                Journal
             </a>
             <a href="#" data-cursor-hover="true" className="font-sans text-[11px] uppercase tracking-[0.25em] hover:text-[#A69B8D] transition-colors hidden md:block">
                Appointments
             </a>
             <button data-cursor-hover="true" className="font-sans text-[11px] uppercase tracking-[0.25em] relative flex flex-col justify-center items-end gap-1.5 w-10 h-10 group">
                <span className="w-8 h-[1px] bg-white group-hover:w-6 transition-all duration-300"></span>
                <span className="w-6 h-[1px] bg-white group-hover:w-8 transition-all duration-300"></span>
             </button>
           </motion.div>
        </nav>
    );
};

const TextReveal = ({ text, trigger = true, delay = 0 }: { text: string, trigger?: boolean, delay?: number }) => {
  return (
    <span className="inline-block overflow-hidden pb-4">
      <motion.span
        className="inline-block origin-bottom"
        initial={{ y: "150%", rotateZ: 5, opacity: 0 }}
        animate={trigger ? { y: "0%", rotateZ: 0, opacity: 1 } : { y: "150%", rotateZ: 5, opacity: 0 }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </span>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  const [activeServiceHover, setActiveServiceHover] = useState(0);

  useEffect(() => {
    if (!loading) {
      const lenis = new Lenis({
        duration: 1.2,
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

  return (
    <>
      {/* Noise Overlay */}
      <div className="fixed inset-0 z-[999] pointer-events-none opacity-[0.03] mix-blend-screen" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <CustomCursor />
      
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="bg-[#0c0c0c] text-[#F5F2EB] min-h-screen selection:bg-[#A69B8D] selection:text-[#0c0c0c] flex flex-col font-sans overflow-x-hidden">
        
        <Navigation />

        {/* 1. Dramatic Hero Section Redesigned */}
        <section className="relative w-full min-h-[100svh] overflow-hidden flex flex-col items-center justify-center bg-black">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <motion.div 
               style={{ y: heroY, scale: heroScale }} 
               animate={{ scale: loading ? 1.05 : 1 }}
               transition={{ duration: 3, ease: "easeOut" }}
               className="w-full h-[120%] origin-top"
            >
              <img 
                src={IMAGES.hero} 
                alt="Luxury Barbering" 
                className="w-full h-full object-cover object-top grayscale opacity-60 mix-blend-luminosity" 
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-[#0c0c0c]/40 to-[#0c0c0c]/20" />
          </div>

          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 min-h-[100vh] flex flex-col justify-center items-center text-center py-32 md:py-48 mt-12 md:mt-24">
             
             <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }} 
                transition={{ duration: 1, delay: 0.6 }}
                className="font-sans text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#A69B8D] mb-8 lg:mb-14 flex items-center gap-4"
             >
                <span className="w-8 h-[1px] bg-[#A69B8D]/50 hidden md:block"></span>
                TRADITION & CRAFT
                <span className="w-8 h-[1px] bg-[#A69B8D]/50 hidden md:block"></span>
             </motion.div>

             <div className="font-serif text-[clamp(4.5rem,15vw,16rem)] leading-[0.85] tracking-tighter mix-blend-screen text-[#F5F2EB] flex flex-col items-center justify-center z-10 w-full">
                <TextReveal text="SARTORIAL" trigger={!loading} delay={0.4} />
                <div className="italic text-[#A69B8D] flex items-center mt-2 md:-mt-4">
                   <TextReveal text="Grooming." trigger={!loading} delay={0.5} />
                </div>
             </div>

             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: loading ? 0 : 1 }}
               transition={{ duration: 1, delay: 1.0 }}
               className="mt-12 md:mt-24 space-y-6 flex flex-col items-center"
             >
                <p className="font-sans text-xs md:text-sm tracking-widest text-[#F5F2EB]/40 max-w-md md:max-w-lg mb-4 md:mb-8 leading-relaxed font-light">
                   Elevating the standard of men's grooming through meticulous attention to detail and uncompromising quality.
                </p>
                <MagneticButton className="px-8 py-4 md:px-12 md:py-5 border border-[#A69B8D]/30 rounded-full text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-[#A69B8D] hover:text-[#0c0c0c] transition-colors duration-500 text-white/80 bg-black/20 backdrop-blur-sm">
                   Book Appointment
                </MagneticButton>
             </motion.div>

          </div>

          {/* Scroll Down element (absolute bottom center) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 pointer-events-none"
          >
             <span className="font-sans text-[9px] tracking-[0.3em] uppercase text-white/30 text-center">Scroll</span>
             <div className="w-[1px] h-12 bg-white/10 relative overflow-hidden">
                <motion.div 
                  animate={{ y: [-20, 60] }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute top-0 left-0 w-[1px] h-6 bg-white"
                />
             </div>
          </motion.div>
        </section>

        {/* 2. Marquee Ticker */}
        <section className="py-12 bg-[#0c0c0c] border-b border-white/5 overflow-hidden flex relative z-20">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            className="flex whitespace-nowrap items-center font-sans text-[10px] uppercase tracking-[0.3em] text-[#A69B8D] px-4"
          >
            {[...Array(6)].map((_, i) => (
              <React.Fragment key={i}>
                <span className="mx-8">PRECISION ENGINEERING</span>
                <Star className="w-3 h-3 text-white/20" />
                <span className="mx-8">SARTORIAL ELEGANCE</span>
                <Star className="w-3 h-3 text-white/20" />
                <span className="mx-8">OLD WORLD CRAFTSMANSHIP</span>
                <Star className="w-3 h-3 text-white/20" />
              </React.Fragment>
            ))}
          </motion.div>
        </section>

        {/* 3. The Ethos Redesigned */}
        <section className="relative py-24 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto w-full z-20 flex flex-col">
           <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 w-full items-center">
              
              <div className="w-full lg:w-1/2 relative px-4 md:px-0">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                   className="relative aspect-[4/5] overflow-hidden rounded-sm w-[90%] md:w-[80%] mx-auto lg:ml-0"
                 >
                   <img src={IMAGES.detail} alt="Craftsmanship" className="w-full h-full object-cover grayscale opacity-80 hover:scale-105 hover:grayscale-0 transition-all duration-1000 ease-out cursor-pointer" />
                 </motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                   className="absolute -bottom-8 md:-bottom-16 -right-2 md:-right-8 lg:-right-4 w-[55%] md:w-[50%] aspect-[4/4] overflow-hidden rounded-sm shadow-2xl border border-white/5"
                 >
                    <img src={IMAGES.tools} alt="Tools" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" />
                 </motion.div>
              </div>

              <div className="w-full lg:w-1/2 flex flex-col justify-center mt-20 lg:mt-0 lg:pl-12">
                 <div className="font-sans uppercase text-[10px] tracking-[0.3em] text-[#A69B8D] mb-8 lg:mb-12 flex items-center gap-4">
                    <span className="w-8 h-[1px] bg-[#A69B8D]/50"></span>
                    Our Philosophy
                 </div>
                 
                 <h2 className="font-serif text-[clamp(2.5rem,4vw,4.5rem)] font-light text-[#F5F2EB] leading-[1.1] mb-12">
                   Reject the rush.<br/> <span className="italic text-[#A69B8D]">Embrace the ritual.</span>
                 </h2>

                 <div className="font-sans text-base md:text-xl text-white/50 leading-relaxed font-light flex flex-col gap-8 max-w-lg">
                   <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8}}>
                     At Gents & Blades, grooming is elevated from a checklist chore to an architectural study. We create a sanctuary for the modern gentleman, focusing on meticulous detail.
                   </motion.p>
                   <motion.p initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{duration:0.8, delay:0.2}}>
                     It is not just about the hair. It is about the atmosphere, the scent of hot towels, the sound of shears, and the absolute focus given to your structural aesthetic.
                   </motion.p>
                 </div>
              </div>

           </div>
        </section>

        {/* 4. The Environment - Tight Premium Bento Grid */}
        <section className="relative w-full bg-[#050505] z-20 pt-16 pb-24 md:pt-24 md:pb-32 border-t border-white/5">
           <div className="max-w-[1600px] mx-auto px-4 md:px-8 xl:px-12">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-8">
                 <div className="flex flex-col gap-4 md:gap-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#A69B8D] flex items-center gap-4"
                    >
                      <span className="w-12 h-[1px] bg-[#A69B8D]/50"></span>
                      The Environment
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                      className="font-serif text-[clamp(3.5rem,7vw,7rem)] leading-[0.9] text-[#F5F2EB] tracking-tight"
                    >
                      A sanctuary for <br className="hidden md:block"/>
                      <span className="italic text-[#A69B8D]">refinement.</span>
                    </motion.h2>
                 </div>
                 
                 <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.2 }}
                   className="font-sans text-sm md:text-base text-white/40 max-w-sm font-light leading-relaxed md:text-right"
                 >
                   Step into an atmosphere engineered for absolute precision. Every tool, every texture, and every detail has been chosen to elevate the ritual of grooming.
                 </motion.p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 relative w-full">
                 
                 {/* Visual 01 - Large Left */}
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="lg:col-span-8 h-[50vh] md:h-[60vh] lg:h-[700px] rounded-xl overflow-hidden group relative bg-[#111]"
                 >
                    <motion.img 
                         whileHover={{ scale: 1.05 }}
                         transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                         src="https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=2000&auto=format&fit=crop" 
                         alt="The Space" 
                         className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 transition-[transform,filter] duration-[1.5s] ease-[0.16,1,0.3,1]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent pointer-events-none opacity-80 group-hover:opacity-50 transition-opacity duration-700" />
                    
                    <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 flex flex-col gap-1">
                       <span className="font-serif italic text-3xl md:text-5xl text-white/90">The Chair</span>
                       <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#A69B8D]">01 // Environment</span>
                    </div>
                 </motion.div>

                 {/* Visual 02 & 03 - Right Stack */}
                 <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6 h-[70vh] lg:h-[700px]">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1 }}
                      className="flex-1 rounded-xl overflow-hidden group relative bg-[#111]"
                    >
                      <motion.img 
                           whileHover={{ scale: 1.05 }}
                           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                           src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1500&auto=format&fit=crop" 
                           alt="Hardware" 
                           className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 transition-[transform,filter] duration-[1.5s] ease-[0.16,1,0.3,1]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent pointer-events-none opacity-80 group-hover:opacity-50 transition-opacity duration-700" />
                      <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col gap-1">
                         <span className="font-serif italic text-2xl md:text-3xl text-white/90">Hardware</span>
                         <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#A69B8D]">02 // Tools</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="flex-1 rounded-xl overflow-hidden group relative bg-[#111]"
                    >
                      <motion.img 
                           whileHover={{ scale: 1.05 }}
                           transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                           src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1500&auto=format&fit=crop" 
                           alt="Atmosphere" 
                           className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 transition-[transform,filter] duration-[1.5s] ease-[0.16,1,0.3,1]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-[#050505]/20 to-transparent pointer-events-none opacity-80 group-hover:opacity-50 transition-opacity duration-700" />
                      <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 flex flex-col gap-1">
                         <span className="font-serif italic text-2xl md:text-3xl text-white/90">Atmosphere</span>
                         <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#A69B8D]">03 // Sensory</span>
                      </div>
                    </motion.div>
                 </div>

              </div>

           </div>
        </section>

        {/* 5. The Services (Immersive Hover List) */}
        <section className="relative w-full min-h-screen bg-[#0c0c0c] py-32 flex flex-col justify-center border-t border-white/5">
           
           <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 hidden lg:block opacity-30 mix-blend-screen transition-opacity duration-1000">
             <AnimatePresence mode="popLayout">
               <motion.img 
                 key={activeServiceHover}
                 initial={{ opacity: 0, scale: 1.05 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 1, ease: "easeInOut" }}
                 src={SERVICES[activeServiceHover].img}
                 className="absolute inset-0 w-full h-full object-cover grayscale"
               />
             </AnimatePresence>
             <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent" />
             <div className="absolute inset-0 bg-[#0c0c0c]/40" />
           </div>

           <div className="relative z-10 px-6 md:px-12 lg:px-24 flex flex-col">
              <div className="font-sans uppercase text-[10px] tracking-[0.3em] text-[#A69B8D] mb-16 flex items-center gap-4">
                 <span className="w-8 h-[1px] bg-[#A69B8D]/50"></span>
                 Repertoire
              </div>

              <div className="flex flex-col w-full relative">
                {SERVICES.map((service, idx) => (
                  <div 
                    key={idx}
                    className="group border-b border-white/10 w-full lg:w-3/4 flex flex-col justify-center py-10 md:py-16 relative hover:border-white/40 transition-colors duration-500 cursor-pointer"
                    onMouseEnter={() => setActiveServiceHover(idx)}
                    data-cursor-hover="true"
                  >
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-12 relative z-10 w-full">
                       <h3 className="font-serif text-[clamp(2rem,5vw,4.5rem)] font-light text-white/50 group-hover:text-white group-hover:italic transition-all duration-500 origin-left max-w-2xl">
                         {service.title}
                       </h3>
                       <div className="flex items-center gap-8 md:gap-16 sm:w-auto transition-transform duration-500 group-hover:translate-x-4">
                         <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-white/30 group-hover:text-[#A69B8D] transition-colors">{service.time}</span>
                         <span className="font-serif text-2xl italic text-[#A69B8D]">{service.price}</span>
                       </div>
                     </div>
                     <div className="overflow-hidden h-0 group-hover:h-24 md:group-hover:h-16 transition-all duration-500 ease-in-out">
                       <p className="font-sans text-sm md:text-base text-white/50 lg:max-w-xl mt-6 lg:mt-8 font-light leading-relaxed">
                         {service.desc}
                       </p>
                     </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* 6. Apothecary / Artifacts (Premium Showcase) */}
        <section className="relative py-32 md:py-48 w-full bg-[#030303] overflow-hidden border-t border-white/5 z-20">
           
           <div className="max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24 mb-20 md:mb-32 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
              <div className="flex flex-col items-start w-full lg:w-1/2">
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#A69B8D] flex items-center gap-4 mb-8"
                 >
                   <span className="w-12 h-[1px] bg-[#A69B8D]/50"></span>
                   The Apothecary
                 </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-serif text-[clamp(3.5rem,7vw,8rem)] leading-[0.9] text-[#F5F2EB] tracking-tight"
                >
                  Curated <br/>
                  <span className="italic text-[#A69B8D]">Artifacts.</span>
                </motion.h2>
              </div>
              
              <div className="w-full lg:w-1/3 pb-4">
                 <motion.p
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.2 }}
                   className="font-sans text-sm md:text-base text-white/50 font-light leading-relaxed mb-8"
                 >
                   Our signature line of grooming essentials. Formulated with pristine botanical extracts for the modern practitioner. Uncompromising quality for the daily ritual.
                 </motion.p>
                 <motion.div
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1, delay: 0.4 }}
                 >
                    <a href="#" className="font-sans text-[10px] uppercase tracking-[0.2em] text-white flex items-center gap-4 group">
                       <span className="border-b border-white pb-1 group-hover:text-[#A69B8D] group-hover:border-[#A69B8D] transition-colors">Shop All Products</span>
                       <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                    </a>
                 </motion.div>
              </div>
           </div>

           <div className="w-full max-w-[1600px] mx-auto px-4 md:px-12 xl:px-24">
              <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full h-auto lg:h-[800px]">
                 
                 {/* Product 01 (Hero) */}
                 <motion.a 
                   href="#" 
                   initial={{ opacity: 0, scale: 0.98 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                   className="group relative w-full lg:w-[60%] h-[60vh] lg:h-full overflow-hidden rounded-sm bg-[#050505]"
                   data-cursor-hover="true"
                 >
                    <img src={IMAGES.product1} alt="Signature Beard Oil" className="absolute inset-0 w-full h-full object-cover filter grayscale-[0.3] transition-transform duration-[2s] group-hover:scale-[1.05] group-hover:grayscale-0 z-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 opacity-90 group-hover:opacity-70 transition-opacity duration-1000 z-0" />
                    
                    <div className="absolute inset-0 p-8 md:p-12 xl:p-16 flex flex-col justify-end text-left z-10 w-full h-full">
                       <div className="flex flex-col relative w-full transform translate-y-0 group-hover:-translate-y-6 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                           <div className="mb-4">
                               <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#A69B8D] opacity-80 group-hover:opacity-100 transition-opacity duration-700">Sandalwood & Vetiver</p>
                           </div>
                           
                           <div className="flex justify-between items-end w-full relative z-10 bg-transparent">
                               <div className="relative z-20 pb-2">
                                   <h4 className="font-serif text-4xl md:text-5xl lg:text-7xl text-[#F5F2EB] leading-[0.95] transition-colors duration-700">
                                       Signature<br/><span className="italic">Beard Oil.</span>
                                   </h4>
                               </div>
                               <span className="font-serif text-2xl lg:text-4xl italic text-white/50 mb-2">$38</span>
                           </div>
                       </div>
                       
                       {/* Add to cart hover reveal */}
                       <div className="absolute bottom-8 md:bottom-12 xl:bottom-16 left-8 md:left-12 xl:left-16 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 ease-[0.16,1,0.3,1] flex items-center gap-4 z-10">
                           <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] text-white border-b border-white/30 pb-1 group-hover:border-white transition-colors">Add to Cart</span>
                           <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                 </motion.a>

                 {/* Right Column Stack */}
                 <div className="w-full lg:w-[40%] flex flex-col gap-6 md:gap-8 h-[80vh] lg:h-full">
                    
                    {/* Product 02 */}
                    <motion.a 
                      href="#" 
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative w-full h-[50%] overflow-hidden rounded-sm bg-[#050505]"
                      data-cursor-hover="true"
                    >
                       <img src={IMAGES.product2} alt="Matte Pomade" className="absolute inset-0 w-full h-full object-cover filter grayscale-[0.3] transition-transform duration-[2s] group-hover:scale-[1.05] group-hover:grayscale-0 z-0" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-1000 z-0" />
                       
                       <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-end text-left z-10">
                           <div className="flex flex-col relative w-full transform translate-y-0 group-hover:-translate-y-6 transition-transform duration-700 ease-[0.16,1,0.3,1]">
                               <p className="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#A69B8D] mb-3">Strong Hold, No Shine</p>
                               <div className="flex justify-between items-end w-full relative z-10 bg-transparent pb-1">
                                   <div className="relative z-20">
                                       <h4 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F5F2EB] leading-none transition-colors duration-700">
                                           Matte<br/><span className="italic">Pomade.</span>
                                       </h4>
                                   </div>
                                   <span className="font-serif text-xl lg:text-3xl italic text-white/50">$24</span>
                               </div>
                           </div>
                           
                           {/* Add to cart hover reveal */}
                           <div className="absolute bottom-8 md:bottom-10 left-8 md:left-10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 delay-100 ease-[0.16,1,0.3,1] flex items-center gap-3 z-10">
                               <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-white border-b border-white/30 pb-1">Quick Add</span>
                               <ArrowRight className="w-3 h-3 text-white" />
                           </div>
                       </div>
                    </motion.a>

                    {/* Discover Set */}
                    <motion.a 
                      href="#"
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 1.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative w-full h-[50%] overflow-hidden rounded-sm bg-[#030303]"
                      data-cursor-hover="true"
                    >
                        <img src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1500&auto=format&fit=crop" alt="The Ritual Set" className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 transition-transform duration-[2s] group-hover:scale-[1.05] group-hover:opacity-70 z-0" />
                        <div className="absolute inset-0 bg-[#000]/40 mix-blend-multiply transition-colors duration-1000 group-hover:bg-transparent z-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-0" />
                        
                        <div className="absolute inset-0 p-8 md:p-10 flex flex-col justify-center items-center text-center z-10">
                            <h4 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F5F2EB] italic mb-4 overflow-hidden">
                                <span className="block transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-700 ease-[0.16,1,0.3,1]">The Ritual</span>
                                <span className="block transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-700 delay-75 ease-[0.16,1,0.3,1]">Set.</span>
                            </h4>
                            <p className="font-sans text-xs text-white/50 mb-6 max-w-[220px] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-150 ease-out">
                                Three premium artifacts. Uncompromising quality.
                            </p>
                            <div className="w-12 h-12 rounded-full border border-white/20 bg-black/40 flex items-center justify-center backdrop-blur-md group-hover:bg-white transition-colors duration-500 delay-200">
                                <ArrowRight className="w-4 h-4 text-white group-hover:text-black group-hover:-rotate-45 transition-all duration-500" />
                            </div>
                        </div>
                    </motion.a>
                 </div>

              </div>
           </div>
        </section>

        {/* 6.5. Editorial / Journal */}
        <section className="relative py-24 md:py-40 w-full bg-[#030303] overflow-hidden border-t border-white/5 z-20">
           <div className="max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24 mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
              <div className="flex flex-col items-start w-full md:w-2/3">
                 <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#A69B8D] flex items-center gap-4 mb-8"
                 >
                   <span className="w-12 h-[1px] bg-[#A69B8D]/50"></span>
                   Editorial
                 </motion.div>
                 <motion.h2 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                   className="font-serif text-[clamp(3.5rem,6vw,7rem)] leading-[0.9] text-[#F5F2EB] tracking-tight"
                 >
                   The <br className="hidden md:block" />
                   <span className="italic text-[#A69B8D]">Journal.</span>
                 </motion.h2>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                  <a href="#" className="font-sans text-[10px] uppercase tracking-[0.2em] text-white flex items-center gap-4 group">
                     <span className="relative overflow-hidden block">
                         <span className="block transform translate-y-0 group-hover:-translate-y-full transition-transform duration-500 pb-1 border-b border-white border-dashed">Read All Entries</span>
                         <span className="block absolute top-0 left-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 pb-1 border-b border-[#A69B8D] text-[#A69B8D]">Read All Entries</span>
                     </span>
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" />
                  </a>
              </motion.div>
           </div>

           <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24 pb-12">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 lg:gap-16 w-full">
                  {[
                        {
                           title: "The essential morning ritual for the modern gentleman.",
                           category: "Grooming",
                           time: "04 Min Read",
                           img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=1000&auto=format&fit=crop",
                           delay: 0
                        },
                        {
                           title: "Crafting confidence: How a tailored cut defines your presence.",
                           category: "Style",
                           time: "06 Min Read",
                           img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1000&auto=format&fit=crop",
                           delay: 0.15
                        },
                        {
                           title: "Behind the chair: Secrets from the district's master barbers.",
                           category: "Culture",
                           time: "08 Min Read",
                           img: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=1000&auto=format&fit=crop",
                           delay: 0.3
                        }
                  ].map((article, idx) => (
                      <motion.a 
                        key={idx}
                        href="#"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, delay: article.delay, ease: [0.16, 1, 0.3, 1] }}
                        className="group flex flex-col w-full cursor-pointer transform hover:-translate-y-4 transition-all duration-[0.8s] ease-[0.16,1,0.3,1]"
                      >
                         <div className="w-full aspect-[3/4] overflow-hidden mb-8 relative rounded-md bg-[#050505] shadow-lg group-hover:shadow-2xl group-hover:shadow-black/50 transition-shadow duration-[0.8s] ease-[0.16,1,0.3,1]">
                             <img src={article.img} alt={article.category} className="absolute inset-0 w-full h-full object-cover filter grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transform scale-100 group-hover:scale-105 transition-all duration-[1.5s] ease-[0.16,1,0.3,1] z-10" />
                             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-1000 z-20 pointer-events-none" />
                         </div>
                         
                         <div className="flex flex-col gap-5 px-1 py-2">
                            <div className="flex items-center gap-4 text-[#A69B8D] font-sans text-[9px] md:text-[10px] uppercase tracking-[0.25em]">
                                <span>{article.category}</span>
                                <span className="w-4 h-[1px] bg-[#A69B8D]/50" />
                                <span>{article.time}</span>
                            </div>
                            <h4 className="font-serif text-2xl lg:text-3xl xl:text-4xl text-[#F5F2EB] group-hover:text-white transition-colors duration-500 leading-snug">
                                {article.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#F5F2EB]">Read</span>
                                <ArrowRight className="w-3 h-3 text-[#F5F2EB] transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                            </div>
                         </div>
                      </motion.a>
                  ))}
               </div>
           </div>
        </section>

        {/* 6.75. CTA / Newsletter */}
        <section className="relative py-32 md:py-48 w-full bg-[#050505] z-20 border-t border-white/[0.05]">
           <div className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(166,155,141,0.03)_0%,transparent_100%)] pointer-events-none"></div>
           <div className="relative z-20 w-full max-w-[800px] mx-auto px-6 text-center flex flex-col items-center">
              <motion.div
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                 className="flex flex-col items-center w-full"
              >
                  <p className="font-sans text-[10px] md:text-xs uppercase tracking-[0.4em] text-[#A69B8D] mb-8 md:mb-12">
                     The Dispatch
                  </p>
                  
                  <h2 className="font-serif text-[clamp(4rem,7vw,7rem)] leading-[0.9] text-[#F5F2EB] tracking-tighter mb-8 w-full">
                     Elevate your <span className="italic text-[#A69B8D] font-light">routine.</span>
                  </h2>

                  <p className="font-sans text-[14px] md:text-[15px] font-light max-w-md mx-auto mb-16 leading-relaxed text-white/50">
                     Curated insights on modern grooming, early access to appointments, and bespoke style guides delivered to your inbox.
                  </p>

                  <form
                     className="w-full max-w-md relative flex flex-col group"
                     onSubmit={(e) => e.preventDefault()}
                  >
                     <div className="relative flex items-center w-full border-b border-white/20 group-focus-within:border-[#F5F2EB] transition-colors duration-500 pb-4">
                        <input 
                           type="email" 
                           placeholder="Enter your email address" 
                           required
                           className="w-full bg-transparent border-none text-[#F5F2EB] font-sans text-[15px] placeholder:text-white/30 focus:ring-0 focus:outline-none px-2"
                        />
                        <button 
                           type="submit" 
                           className="flex items-center gap-3 justify-center text-white/40 hover:text-[#F5F2EB] transition-colors pr-2 group/btn"
                        >
                           <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium">Subscribe</span>
                           <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </form>
              </motion.div>
           </div>
        </section>

        {/* 7. Grand Footer */}
        <footer className="relative bg-[#050505] pt-32 lg:pt-40 flex flex-col z-20 overflow-hidden text-[#F5F2EB]">
            {/* Fine top line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24 relative z-10 flex flex-col lg:flex-row justify-between gap-24 lg:gap-12 pb-32">
                
                {/* Brand / Logo Area */}
                <div className="w-full lg:w-5/12 flex flex-col">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.85] tracking-tighter mb-8">
                            Gents &<br/>
                            <span className="italic text-[#A69B8D] font-light">Blades.</span>
                        </h2>
                        <p className="font-sans text-white/40 text-[14px] font-light max-w-sm leading-relaxed mb-12">
                            A sanctuary for the modern gentleman. Bespoke grooming, master tailoring, and a refined atmosphere.
                        </p>
                        
                        <a href="#booking" className="group flex items-center justify-between w-full sm:w-[320px] border border-white/20 bg-transparent text-[#F5F2EB] px-8 py-5 cursor-pointer hover:border-[#A69B8D] hover:bg-[#A69B8D] hover:text-white transition-all duration-700">
                            <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium">Make an Appointment</span>
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </a>
                    </motion.div>
                </div>

                {/* Info Grid */}
                <div className="w-full lg:w-6/12 grid grid-cols-2 sm:grid-cols-3 gap-y-16 gap-x-8 lg:pt-4">
                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: 0.1 }}
                    >
                        <h5 className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#A69B8D] mb-8">Location</h5>
                        <div className="flex flex-col gap-2 font-sans text-white/50 text-[13px] md:text-[14px] leading-relaxed">
                            <p>404 Sartorial Ave<br/>Metropolis D9<br/>NY 10012</p>
                            <a href="#" className="text-white hover:text-[#A69B8D] transition-colors mt-2 text-[11px] uppercase tracking-widest inline-flex items-center gap-2 group/link w-fit">
                                Get Directions
                                <ArrowUpRight className="w-3 h-3 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: 0.2 }}
                    >
                        <h5 className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#A69B8D] mb-8">Contact</h5>
                        <div className="flex flex-col gap-6 font-sans text-white/50 text-[13px] md:text-[14px]">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Inquiries</span>
                                <a href="mailto:hello@gentsandblades.com" className="hover:text-white transition-colors w-fit">hello@gentsb.com</a>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-white/30 uppercase tracking-widest mb-1.5">Phone</span>
                                <a href="tel:+1234567890" className="hover:text-white transition-colors w-fit">+1 (234) 567 890</a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                       initial={{ opacity: 0, y: 20 }}
                       whileInView={{ opacity: 1, y: 0 }}
                       viewport={{ once: true }}
                       transition={{ duration: 1, delay: 0.3 }}
                       className="col-span-2 sm:col-span-1"
                    >
                        <h5 className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#A69B8D] mb-8">Socials</h5>
                        <ul className="flex flex-col gap-4 font-sans text-white/50 text-[13px] md:text-[14px]">
                            {['Instagram', 'Twitter', 'Journal', 'Spotify'].map((s, i) => (
                                <li key={s}>
                                    <a href="#" className="flex items-center group w-fit hover:text-[#A69B8D] transition-colors relative overflow-hidden">
                                        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-full">{s}</span>
                                        <span className="inline-block absolute left-0 top-0 translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 text-white">{s}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="w-full relative z-10 border-t border-white/[0.05]">
                <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12 xl:px-24">
                    <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30">
                        <p>&copy; {new Date().getFullYear()} GENTS &amp; BLADES.</p>
                        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Cookie Settings</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

      </div>
    </>
  );
}
