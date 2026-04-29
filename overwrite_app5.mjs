import fs from 'fs';

const appCode = `import React, { useEffect, useState, useRef } from 'react';
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
        cursorDotRef.current.style.transform = \`translate3d(\${dotX}px, \${dotY}px, 0) translate(-50%, -50%) scale(\${dotScale})\`;
        
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
           animate={{ width: \`\${counter}%\` }}
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
  
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: horizontalScroll } = useScroll({ target: targetRef });
  const x = useTransform(horizontalScroll, [0, 1], ["0%", "-66.66%"]);

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
        <section className="relative w-full h-[100svh] overflow-hidden flex items-center justify-center bg-black">
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
                className="w-full h-full object-cover object-top grayscale opacity-50" 
              />
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#0c0c0c] to-transparent opacity-90" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0c0c0c_120%)]" />
          </div>

          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 flex flex-col items-center mt-12 md:mt-24">
             <div className="flex flex-col items-center text-center">
                <div className="font-serif text-[clamp(4.5rem,15vw,16rem)] leading-[0.8] tracking-tighter mix-blend-screen text-white">
                  <TextReveal text="SARTORIAL" trigger={!loading} delay={0.6} />
                </div>
                <div className="font-serif text-[clamp(4rem,14vw,15rem)] leading-[0.8] tracking-tighter italic text-[#A69B8D] -mt-2">
                  <TextReveal text="Grooming." trigger={!loading} delay={0.7} />
                </div>
             </div>
             
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: loading ? 0 : 1, y: loading ? 30 : 0 }}
               transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
               className="mt-12 md:mt-16 text-center"
             >
                <MagneticButton className="group flex items-center justify-center gap-4 border border-[#A69B8D]/40 w-32 h-32 md:w-40 md:h-40 rounded-full hover:bg-[#A69B8D] hover:text-[#0c0c0c] transition-colors duration-500 overflow-hidden relative">
                   <span className="font-sans text-[10px] uppercase tracking-[0.2em] font-medium z-10">Discover</span>
                   <div className="absolute inset-x-0 bottom-0 h-0 bg-[#A69B8D] transition-all duration-500 ease-out group-hover:h-full z-0" />
                </MagneticButton>
             </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: loading ? 0 : 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="absolute bottom-10 left-6 md:left-12 font-sans text-[10px] tracking-[0.2em] uppercase text-white/40"
          >
             Scroll to explore <br/>
             <div className="w-[1px] h-12 bg-white/10 mt-4 relative overflow-hidden">
                <motion.div 
                  animate={{ y: [-15, 60] }} 
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
        <section className="relative py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto w-full z-20 flex flex-col">
           <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 w-full items-center">
              
              <div className="w-full lg:w-1/2 relative">
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true, margin: "-100px" }}
                   transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                   className="relative aspect-[4/5] overflow-hidden rounded-sm w-full md:w-[85%] mx-auto lg:ml-0"
                 >
                   <img src={IMAGES.detail} alt="Craftsmanship" className="w-full h-full object-cover grayscale opacity-80 hover:scale-105 hover:grayscale-0 transition-all duration-1000 ease-out cursor-pointer" />
                 </motion.div>
                 
                 <motion.div 
                   initial={{ opacity: 0, y: 50 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, margin: "-50px" }}
                   transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                   className="absolute -bottom-16 -right-4 lg:-right-12 w-[60%] md:w-[50%] aspect-square overflow-hidden rounded-sm shadow-2xl border border-white/5"
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

        {/* 4. Horizontal Scroll Gallery */}
        <section ref={targetRef} className="relative h-[300vh] bg-[#050505]">
          <div className="sticky top-0 h-screen flex items-center overflow-hidden">
             
             <div className="absolute top-12 left-6 md:left-12 lg:left-24 font-sans uppercase text-[10px] tracking-[0.3em] text-[#A69B8D] flex items-center gap-4 z-10 mix-blend-difference">
                <span className="w-8 h-[1px] bg-[#A69B8D]/50"></span>
                The Space
             </div>

             <motion.div style={{ x }} className="flex gap-8 md:gap-20 px-6 md:px-24 h-[60vh] md:h-[70vh] items-center text-[#F5F2EB] whitespace-nowrap">
                
                <div className="w-[80vw] md:w-[50vw] flex-shrink-0 flex items-center pr-12 md:pr-24">
                   <h2 className="font-serif text-[clamp(4rem,8vw,10rem)] leading-[0.9] font-light italic whitespace-normal">
                      Architectural <br/> <span className="text-[#A69B8D]">Precision.</span>
                   </h2>
                </div>

                <div className="w-[70vw] md:w-[40vw] h-[50vh] md:h-full flex-shrink-0 overflow-hidden relative group">
                   <img src={IMAGES.gallery1} alt="Barber interior" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                </div>
                
                <div className="w-[60vw] md:w-[35vw] h-[40vh] md:h-[80%] flex-shrink-0 overflow-hidden relative group">
                   <img src={IMAGES.ambient} alt="Barber tools" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                </div>

                <div className="w-[80vw] md:w-[45vw] h-[60vh] md:h-full flex-shrink-0 overflow-hidden relative group">
                   <img src={IMAGES.gallery3} alt="Cutting hair" className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                </div>
                
                <div className="w-[30vw] flex-shrink-0 flex items-center justify-center">
                   <span className="font-serif text-3xl italic text-[#A69B8D]">fin.</span>
                </div>

             </motion.div>
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

        {/* 6. Artifacts / Shop Preview */}
        <section className="py-32 md:py-48 px-6 md:px-12 max-w-[1600px] mx-auto w-full text-center flex flex-col items-center">
           <div className="font-sans uppercase text-[10px] tracking-[0.3em] text-[#A69B8D] mb-8">
              Apothecary
           </div>
           
           <h2 className="font-serif text-[clamp(3rem,6vw,5rem)] font-light text-[#F5F2EB] leading-[1.1] mb-24">
              Curated grooming <br/><span className="italic text-[#A69B8D]">artifacts.</span>
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl">
              <a href="#" className="group flex flex-col items-center text-left" data-cursor-hover="true">
                 <div className="w-full aspect-square bg-[#050505] mb-8 overflow-hidden rounded-sm relative flex items-center justify-center p-12">
                   <div className="absolute inset-0 bg-[#C4A962]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <img src={IMAGES.product1} alt="Beard Oil" className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <div className="w-full flex justify-between items-center px-4">
                    <div>
                      <h4 className="font-serif text-2xl mb-2">Signature Beard Oil</h4>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#A69B8D]">Sandalwood & Vetiver</p>
                    </div>
                    <span className="font-serif italic text-[#A69B8D] text-lg">$38</span>
                 </div>
              </a>

              <a href="#" className="group flex flex-col items-center text-left" data-cursor-hover="true">
                 <div className="w-full aspect-square bg-[#050505] mb-8 overflow-hidden rounded-sm relative flex items-center justify-center p-12">
                   <div className="absolute inset-0 bg-[#C4A962]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                   <img src={IMAGES.product2} alt="Pomade" className="w-full h-full object-cover grayscale mix-blend-luminosity group-hover:scale-105 transition-transform duration-700" />
                 </div>
                 <div className="w-full flex justify-between items-center px-4">
                    <div>
                      <h4 className="font-serif text-2xl mb-2">Matte Pomade</h4>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#A69B8D]">Strong Hold</p>
                    </div>
                    <span className="font-serif italic text-[#A69B8D] text-lg">$24</span>
                 </div>
              </a>
           </div>

           <MagneticButton className="mt-24 border-b border-[#A69B8D] pb-2 font-sans text-[10px] uppercase tracking-[0.2em] hover:text-[#A69B8D] transition-colors">
              Explore The Shop
           </MagneticButton>
        </section>

        {/* 7. Grand Footer */}
        <footer className="relative bg-[#000] pt-40 pb-12 px-6 md:px-12 overflow-hidden flex flex-col justify-end border-t border-white/5">
           
           <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-24 border-b border-white/10 pb-20">
              
              <div className="flex flex-col gap-12 w-full lg:w-1/2">
                 <h3 className="font-serif text-[clamp(4rem,8vw,7rem)] font-light leading-[0.9] text-[#F5F2EB]">
                    Reserve your <br/>
                    <span className="italic text-[#A69B8D]">chair.</span>
                 </h3>
                 <div className="flex flex-col sm:flex-row gap-16 md:mt-8">
                   <div className="flex flex-col gap-6">
                      <p className="font-sans text-[#A69B8D] text-[10px] tracking-[0.3em] uppercase flex items-center gap-4">
                        <MapPin className="w-3 h-3" /> Location
                      </p>
                      <p className="font-sans text-white/60 font-light leading-relaxed text-sm">
                         404 Sartorial Ave<br/>
                         Metropolis District 9<br/>
                         NY 10012
                      </p>
                   </div>
                   <div className="flex flex-col gap-6">
                      <p className="font-sans text-[#A69B8D] text-[10px] tracking-[0.3em] uppercase">Hours</p>
                      <p className="font-sans text-white/60 font-light leading-relaxed text-sm">
                         Mon - Fri: 9X - 8X<br/>
                         Sat: 10X - 6X<br/>
                         Sun: Closed
                      </p>
                   </div>
                 </div>
              </div>

              <div className="flex flex-col gap-4 w-full lg:w-4/12 text-left font-sans text-[11px] tracking-[0.25em] uppercase font-light lg:ml-auto">
                 <a href="#" className="flex items-center justify-between border-b border-white/10 py-6 group hover:text-[#A69B8D] transition-colors relative overflow-hidden w-full">
                    <span>Instagram</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                 </a>
                 <a href="#" className="flex items-center justify-between border-b border-white/10 py-6 group hover:text-[#A69B8D] transition-colors relative overflow-hidden w-full">
                    <span>Journal</span>
                    <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
                 </a>
                 <a href="#" className="flex items-center justify-between border-b border-white/10 py-6 group hover:text-[#A69B8D] transition-colors relative overflow-hidden w-full">
                    <span>Book Appointment</span>
                    <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                 </a>
              </div>
           </div>

           <div className="relative z-10 w-full max-w-[1600px] mx-auto mt-12 flex flex-col md:flex-row justify-between items-center gap-8 font-sans text-[10px] uppercase tracking-[0.2em] text-white/30">
              <p>&copy; {new Date().getFullYear()} GENTS & BLADES. EST 2024.</p>
              <div className="flex gap-12">
                 <a href="#" data-cursor-hover="true" className="hover:text-[#A69B8D] transition-colors">Privacy</a>
                 <a href="#" data-cursor-hover="true" className="hover:text-[#A69B8D] transition-colors">Terms</a>
              </div>
           </div>

           {/* Giant Background Typography */}
           <div className="absolute left-1/2 bottom-0 lg:top-[55%] -translate-x-1/2 lg:-translate-y-1/2 w-full flex justify-center pointer-events-none opacity-[0.02] select-none text-[#F5F2EB] z-0 overflow-hidden mix-blend-screen pb-12 lg:pb-0">
              <h1 className="font-serif font-black italic tracking-tighter text-center w-full" style={{ fontSize: 'clamp(8rem, 28vw, 600px)' }}>BLEND</h1>
           </div>
        </footer>

      </div>
    </>
  );
}
`;
fs.writeFileSync('src/App.tsx', appCode);
