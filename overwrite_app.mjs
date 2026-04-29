import fs from 'fs';

const appCode = `import React, { useEffect, useState, useRef } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const IMAGES = {
  hero: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=2000&auto=format&fit=crop",
  chair: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2000&auto=format&fit=crop",
  tools: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2000&auto=format&fit=crop",
  detail: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=2000&auto=format&fit=crop",
  ambient: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?q=80&w=2000&auto=format&fit=crop"
};

const SERVICES = [
  { title: "The Executive Cut", price: "$65", time: "45 Min", desc: "Detailed consultation, precision cut, hot lather neck shave, and premium styling.", img: IMAGES.hero },
  { title: "Royal Hot Towel Shave", price: "$55", time: "45 Min", desc: "Traditional straight razor hot towel shave featuring pre-shave oils and hot lather.", img: IMAGES.ambient },
  { title: "Beard Sculpting", price: "$40", time: "30 Min", desc: "Expert trimming, shaping, lining, and conditioning with premium beard oils.", img: IMAGES.detail },
  { title: "The Full Treatment", price: "$110", time: "90 Min", desc: "The ultimate grooming package. Executive Cut paired with the Royal Shave.", img: IMAGES.chair }
];

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
      <div className="flex justify-between items-end border-b border-[#F5F2EB]/20 pb-4">
         <div className="font-serif text-2xl md:text-4xl italic font-light tracking-widest text-[#A69B8D]">
           Gents & Blades
         </div>
         <div className="font-sans text-6xl md:text-9xl font-light tabular-nums leading-none">
           {counter}
         </div>
      </div>
    </motion.div>
  );
};

const ServiceList = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let x = 0, y = 0;
    let targetX = 0, targetY = 0;
    let frameId: number;

    const animate = () => {
      x += (targetX - x) * 0.15;
      y += (targetY - y) * 0.15;
      if (imageRef.current) {
        imageRef.current.style.transform = \`translate(\${x}px, \${y}px) translate(-50%, -50%)\`;
      }
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      }
    };

    const container = containerRef.current;
    
    // Check if the device looks like mobile to disable effect
    if (window.innerWidth > 768) {
      container?.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      cancelAnimationFrame(frameId);
      container?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative border-t border-[#F5F2EB]/10 w-full mt-10 md:mt-20" ref={containerRef}>
       {SERVICES.map((service, idx) => (
         <div 
           key={idx}
           className="group border-b border-[#F5F2EB]/10 flex flex-col md:flex-row md:items-center justify-between py-10 px-4 md:px-0 relative cursor-pointer"
           onMouseEnter={() => setHoveredIndex(idx)}
           onMouseLeave={() => setHoveredIndex(null)}
         >
           <div className="flex flex-col md:w-1/3 space-y-2 md:space-y-4">
             <span className="font-serif text-3xl md:text-5xl font-light transition-transform duration-500 ease-out md:group-hover:translate-x-4 md:group-hover:text-[#A69B8D]">
               {service.title}
             </span>
             <span className="font-sans text-xs uppercase tracking-widest text-white/40 md:pl-0 transition-transform duration-500 ease-out md:group-hover:translate-x-4">
               {service.time}
             </span>
           </div>
           
           <div className="mt-6 md:mt-0 font-sans text-white/60 text-sm md:text-base max-w-sm ml-auto mr-16 transition-opacity duration-500 md:opacity-40 md:group-hover:opacity-100">
             {service.desc}
           </div>

           <div className="font-serif text-2xl md:text-3xl mt-6 md:mt-0 text-[#A69B8D] italic">
             {service.price}
           </div>
         </div>
       ))}

       {/* Floating Image Cursor inside container */}
       <div 
         ref={imageRef} 
         className="absolute top-0 left-0 w-64 h-80 pointer-events-none overflow-hidden z-20 transition-opacity duration-300 rounded-sm hidden lg:block shadow-2xl"
         style={{ opacity: hoveredIndex !== null ? 1 : 0 }}
       >
         {SERVICES.map((service, idx) => (
           <img 
             key={idx}
             src={service.img} 
             alt="Service preview"
             className={cn(
               "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
               hoveredIndex === idx ? "opacity-100" : "opacity-0"
             )}
           />
         ))}
       </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // Parallax setup for Hero Image
  const { scrollY } = useScroll();
  const heroImageY = useTransform(scrollY, [0, 1000], ["0%", "25%"]);
  const heroImageScale = useTransform(scrollY, [0, 1000], [1, 1.1]);

  return (
    <ReactLenis root>
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <div className="bg-[#0c0c0c] min-h-screen selection:bg-[#A69B8D] selection:text-[#0c0c0c] flex flex-col">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center mix-blend-difference text-[#F5F2EB]">
           <div className="font-serif italic text-xl tracking-widest font-light">
             G&B<span className="text-[#A69B8D]">.</span>
           </div>
           <div className="flex gap-4 md:gap-8 items-center">
             <button className="font-sans text-xs uppercase tracking-[0.2em] hover:text-[#A69B8D] transition-colors hidden md:block">Book</button>
             <button className="font-sans text-xs uppercase tracking-[0.2em] relative group overflow-hidden pl-4 md:border-l border-white/20">
               <span className="inline-block group-hover:-translate-y-[150%] transition-transform duration-500">Menu</span>
               <span className="absolute left-4 top-full group-hover:-translate-y-full transition-transform duration-500 text-[#A69B8D]">Menu</span>
             </button>
           </div>
        </nav>

        {/* Hero Section */}
        <header className="relative w-full h-[100svh] overflow-hidden flex flex-col justify-center items-center">
          {/* Background Image with Parallax */}
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-30">
            <motion.div 
               style={{ y: heroImageY, scale: heroImageScale }} 
               className="w-full h-full"
            >
              <img src={IMAGES.hero} alt="Luxury Barbering" className="w-full h-full object-cover object-center grayscale" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-[#0c0c0c]/80" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c]/80 via-transparent to-[#0c0c0c]/80" />
          </div>

          <div className="relative z-10 w-full px-6 flex flex-col items-center pt-[10vh] md:pt-20">
             <div className="overflow-hidden mb-2">
                <motion.div 
                   initial={{ y: "120%" }} 
                   animate={{ y: loading ? "120%" : "0%" }} 
                   transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                   className="font-serif text-[clamp(4.5rem,14vw,14rem)] leading-[0.8] tracking-tighter text-center"
                >
                   Mastery
                </motion.div>
             </div>
             
             <div className="overflow-hidden flex items-center justify-center gap-4 md:gap-8 -mt-2">
                <motion.span 
                   initial={{ scale: 0, opacity: 0 }} 
                   animate={{ scale: loading ? 0 : 1, opacity: loading ? 0 : 1 }} 
                   transition={{ duration: 1, delay: 0.8, ease: "backOut" }}
                   className="hidden md:inline-block w-16 h-[2px] bg-[#A69B8D]"
                />
                <motion.div 
                   initial={{ y: "120%" }} 
                   animate={{ y: loading ? "120%" : "0%" }} 
                   transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                   className="font-serif text-[clamp(4.5rem,14vw,14rem)] leading-[0.8] tracking-tighter text-center italic font-light pr-2 text-[#A69B8D] mb-1 pb-2"
                >
                   &amp; Tradition
                </motion.div>
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
               transition={{ duration: 1, delay: 1 }}
               className="mt-16 md:mt-20 text-center max-w-sm text-white/50 font-sans text-sm tracking-wide leading-relaxed"
             >
               Specializing in sartorial grooming, hot towel shaves, and precision engineering for the modern gentleman. Est. 2024.
             </motion.div>
          </div>
        </header>

        {/* Philosophy / About Section (Sticky Stack intro) */}
        <section className="relative py-24 md:py-48 px-6 md:px-20 max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row justify-between items-start gap-16 md:gap-24">
           <div className="w-full lg:w-1/3 flex flex-col gap-8 lg:sticky lg:top-48 z-10">
              <span className="font-sans uppercase text-xs tracking-widest text-[#A69B8D] border-t border-[#A69B8D]/30 pt-4 w-12 block">
                 Ethos
              </span>
              <h2 className="font-serif text-5xl md:text-6xl font-light text-[#F5F2EB] leading-[1.1]">
                Not just a haircut.<br/> 
                <span className="italic text-[#A69B8D]">A restoration.</span>
              </h2>
           </div>
           
           <div className="w-full lg:w-1/2 flex flex-col gap-16 md:gap-24 lg:pt-10">
              <motion.p
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-20%" }}
                 transition={{ duration: 0.8 }}
                 className="font-sans font-light text-xl md:text-2xl leading-relaxed text-white/70"
              >
                 We believe grooming is a fundamental ritual. At Gents & Blades, we merge old-world barbering techniques with modern architectural aesthetics to create a truly transcendent experience.
              </motion.p>
              
              <div className="flex flex-col gap-6 w-full group">
                 <div className="overflow-hidden relative w-full h-[60vh] rounded-md">
                   <motion.img 
                     initial={{ scale: 1.1 }}
                     whileInView={{ scale: 1 }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     viewport={{ once: true }}
                     src={IMAGES.detail} 
                     alt="Craftsmanship" 
                     className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000 ease-out" 
                   />
                 </div>
                 <p className="text-xs uppercase tracking-widest text-[#A69B8D] flex items-center gap-4">
                   <span className="w-8 h-[1px] bg-white/20 inline-block"></span>
                   01. Precision Craftsmanship
                 </p>
              </div>

              <div className="flex flex-col gap-6 w-full lg:w-4/5 lg:ml-auto lg:mt-10 group">
                 <div className="overflow-hidden relative w-full h-[50vh] rounded-md">
                   <motion.img 
                     initial={{ scale: 1.1 }}
                     whileInView={{ scale: 1 }}
                     transition={{ duration: 1.5, ease: "easeOut" }}
                     viewport={{ once: true }}
                     src={IMAGES.tools} 
                     alt="Tools of the trade" 
                     className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000 ease-out" 
                   />
                 </div>
                 <p className="text-xs uppercase tracking-widest text-[#A69B8D] flex items-center gap-4">
                   <span className="w-8 h-[1px] bg-white/20 inline-block"></span>
                   02. Curated Tools
                 </p>
              </div>
           </div>
        </section>

        {/* Fullwidth Immersive Section */}
        <section className="relative w-full h-[90vh] md:h-screen overflow-hidden mt-10 md:mt-20">
           <div className="absolute inset-0 bg-[#000]">
              <motion.div 
                 className="w-full h-full relative"
                 initial={{ scale: 1.2, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: 0.7 }}
                 viewport={{ once: true }}
                 transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
              >
                  <img src={IMAGES.chair} alt="Our Lounge" className="w-full h-full object-cover object-center mix-blend-screen" />
                  <div className="absolute inset-0 bg-[#000]/30 mix-blend-multiply" />
              </motion.div>
           </div>
           
           <div className="absolute inset-0 flex items-center justify-center mix-blend-overlay">
              <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
           </div>

           {/* Text Overlay */}
           <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-10 pointer-events-none">
              <motion.h2 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1, delay: 0.2 }}
                 className="font-serif text-[clamp(3.5rem,10vw,8.5rem)] italic leading-none drop-shadow-2xl"
              >
                 The Inner Sanctum
              </motion.h2>
              <motion.p 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1, delay: 0.5 }}
                 className="mt-8 uppercase font-sans tracking-[0.3em] text-xs max-w-sm text-[#A69B8D] drop-shadow-lg"
              >
                 Where discretion meets exceptional service.
              </motion.p>
           </div>
        </section>

        {/* Services / Menu */}
        <section className="py-24 md:py-48 px-6 md:px-20 max-w-[1400px] mx-auto w-full">
           <div className="flex flex-col md:w-4/5 lg:w-2/3">
              <div className="font-sans uppercase text-xs tracking-[0.2em] text-[#A69B8D] mb-6 flex items-center gap-4">
                 <span className="w-4 h-4 rounded-full border border-[#A69B8D] flex items-center justify-center">
                    <span className="w-1 h-1 bg-[#A69B8D] rounded-full"></span>
                 </span>
                 Service Repertoire
              </div>
              <h2 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#F5F2EB] leading-[1.1] mb-6">
                 Engineering your <br className="hidden md:block"/><span className="italic text-[#A69B8D]">elegance.</span>
              </h2>
           </div>

           <ServiceList />
        </section>

        {/* Footer */}
        <footer className="relative bg-[#000] pt-24 md:pt-40 pb-16 px-6 md:px-20 overflow-hidden text-[#F5F2EB]">
           <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between items-start gap-16 border-b border-white/10 pb-16 md:pb-24">
              <div className="flex flex-col gap-10 max-w-md w-full lg:w-1/2">
                 <h3 className="font-serif text-5xl md:text-6xl font-light italic text-[#F5F2EB]">Visit the Atelier</h3>
                 <div className="flex flex-col md:flex-row gap-10">
                   <div className="flex gap-4">
                      <MapPin className="w-5 h-5 text-[#A69B8D] shrink-0 mt-1" />
                      <p className="font-sans text-white/50 leading-relaxed tracking-wide text-sm">
                         404 Sartorial Avenue,<br/>
                         Metropolis District 9<br/>
                         NY 10012
                      </p>
                   </div>
                   <div className="flex flex-col gap-2">
                      <p className="font-sans text-white/50 leading-relaxed tracking-wide text-sm">Mon - Fri : 9am - 8pm</p>
                      <p className="font-sans text-white/50 leading-relaxed tracking-wide text-sm">Sat - Sun : 10am - 6pm</p>
                   </div>
                 </div>
              </div>

              <div className="flex flex-col gap-6 w-full lg:w-auto text-left lg:text-right font-sans uppercase text-[11px] tracking-[0.25em] font-medium lg:pt-4">
                 <a href="#" className="hover:text-[#A69B8D] transition-colors py-2 flex items-center lg:justify-end gap-6 group w-max lg:ml-auto">
                    Instagram <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#A69B8D]" />
                 </a>
                 <a href="#" className="hover:text-[#A69B8D] transition-colors py-2 flex items-center lg:justify-end gap-6 group w-max lg:ml-auto">
                    Book Appointment <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#A69B8D]" />
                 </a>
                 <a href="#" className="hover:text-[#A69B8D] transition-colors py-2 flex items-center lg:justify-end gap-6 group w-max lg:ml-auto">
                    Journal & Articles <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#A69B8D]" />
                 </a>
              </div>
           </div>

           <div className="relative z-10 mt-12 max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 font-sans text-[10px] uppercase tracking-[0.2em] text-white/30">
              <p>&copy; {new Date().getFullYear()} GENTS & BLADES. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-10">
                 <a href="#" className="hover:text-[#A69B8D] transition-colors">Privacy Policy</a>
                 <a href="#" className="hover:text-[#A69B8D] transition-colors">Terms of Service</a>
              </div>
           </div>

           {/* Massive background text */}
           <div className="absolute top-[60%] lg:top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.03] w-full text-center whitespace-nowrap overflow-hidden z-0">
              <span className="font-serif text-[28vw] leading-none italic font-black tracking-tighter mix-blend-screen text-white">SARTORIAL</span>
           </div>
        </footer>

      </div>
    </ReactLenis>
  );
}
`

fs.writeFileSync('src/App.tsx', appCode);
