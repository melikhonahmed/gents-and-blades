import fs from 'fs';
const appCode = `import React, { useEffect, useState, useRef } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, Scissors, Sparkles, MapPin } from 'lucide-react';
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

// Split text animation component
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
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

// Premium Preloader
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 2400; // Counter duration

    const updateCounter = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuart
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

// Service Item with trailing image effect
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
    container?.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(frameId);
      container?.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative border-t border-[#F5F2EB]/10 w-full" ref={containerRef}>
       {SERVICES.map((service, idx) => (
         <div 
           key={idx}
           className="group border-b border-[#F5F2EB]/10 flex flex-col md:flex-row md:items-center justify-between py-10 px-4 md:px-0 relative cursor-pointer"
           onMouseEnter={() => setHoveredIndex(idx)}
           onMouseLeave={() => setHoveredIndex(null)}
         >
           <div className="flex flex-col md:w-1/3">
             <span className="font-serif text-3xl md:text-5xl font-light mb-2 transition-transform duration-500 ease-out group-hover:translate-x-4 group-hover:text-[#A69B8D]">
               {service.title}
             </span>
             <span className="font-sans text-xs uppercase tracking-widest text-white/40 md:pl-0 transition-transform duration-500 ease-out group-hover:translate-x-4">
               {service.time}
             </span>
           </div>
           
           <div className="mt-4 md:mt-0 font-sans text-white/50 text-sm md:text-base max-w-sm ml-auto mr-16 transition-opacity duration-500 md:opacity-40 group-hover:opacity-100">
             {service.desc}
           </div>

           <div className="font-serif text-2xl md:text-3xl mt-4 md:mt-0 text-[#A69B8D] italic">
             {service.price}
           </div>
         </div>
       ))}

       {/* Floating Image Cursor inside container */}
       <div 
         ref={imageRef} 
         className="absolute top-0 left-0 w-64 h-80 pointer-events-none overflow-hidden z-20 transition-opacity duration-300 rounded-sm hidden md:block"
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

      <div className="bg-[#0c0c0c] min-h-screen selection:bg-[#A69B8D] selection:text-[#0c0c0c]">
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-10 flex justify-between items-center mix-blend-difference text-[#F5F2EB]">
           <div className="font-sans text-xs uppercase tracking-widest font-bold">
             GB<span className="text-[#A69B8D]">.</span>
           </div>
           <div className="flex gap-4 items-center">
             <button className="font-sans text-xs uppercase tracking-[0.2em] hover:text-[#A69B8D] transition-colors">Book</button>
             <button className="font-sans text-xs uppercase tracking-[0.2em] relative group overflow-hidden pl-4 border-l border-white/20">
               <span className="inline-block group-hover:-translate-y-[150%] transition-transform duration-500">Menu</span>
               <span className="absolute left-4 top-full group-hover:-translate-y-full transition-transform duration-500 text-[#A69B8D]">Menu</span>
             </button>
           </div>
        </nav>

        {/* Hero Section */}
        <header className="relative w-full h-screen overflow-hidden flex flex-col justify-center items-center">
          {/* Background Image with Parallax */}
          <div className="absolute inset-0 w-full h-full overflow-hidden opacity-40">
            <motion.div 
               style={{ y: heroImageY, scale: heroImageScale }} 
               className="w-full h-full"
            >
              <img src={IMAGES.hero} alt="Luxury Barbering" className="w-full h-full object-cover object-center" />
            </motion.div>
            {/* Elegant vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-[#0c0c0c]/80" />
          </div>

          <div className="relative z-10 w-full px-6 flex flex-col items-center pt-20">
             <div className="overflow-hidden">
                <motion.div 
                   initial={{ y: "120%" }} 
                   animate={{ y: loading ? "120%" : "0%" }} 
                   transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                   className="font-serif text-[clamp(4.5rem,15vw,16rem)] leading-[0.85] tracking-tighter text-center italic font-light pr-4 md:pr-10"
                >
                   Mastery
                </motion.div>
             </div>
             <div className="overflow-hidden flex items-center justify-center gap-4 md:gap-8 -mt-2 md:-mt-8">
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
                   className="font-serif text-[clamp(4.5rem,15vw,16rem)] leading-[0.85] tracking-tighter text-center pr-2"
                >
                   & Tradition
                </motion.div>
             </div>

             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
               transition={{ duration: 1, delay: 1 }}
               className="mt-16 text-center max-w-sm text-white/50 font-sans text-sm tracking-wide leading-relaxed"
             >
               Specializing in sartorial grooming, hot towel shaves, and precision engineering for the modern gentleman. Est. 2024.
             </motion.div>
          </div>
        </header>

        {/* Philosophy / About Section (Sticky Stack intro) */}
        <section className="relative py-32 md:py-48 px-6 md:px-20 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16 text-center md:text-left">
           <div className="md:w-1/3 flex flex-col gap-8 md:sticky md:top-40">
              <span className="font-sans uppercase text-xs tracking-widest text-[#A69B8D] border-t border-[#A69B8D]/30 pt-4 w-12 text-left">
                 Ethos
              </span>
              <h2 className="font-serif text-4xl md:text-5xl font-light italic text-[#F5F2EB] leading-tight">
                Not just a haircut.<br/> A <SplitText text="restoration." />
              </h2>
           </div>
           
           <div className="md:w-1/2 flex flex-col gap-12 font-sans font-light text-lg md:text-2xl leading-relaxed text-white/70">
              <motion.p
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-20%" }}
                 transition={{ duration: 0.8 }}
                 className="text-left"
              >
                 We believe grooming is a fundamental ritual. At Gents & Blades, we merge old-world barbering techniques with modern architectural aesthetics. 
              </motion.p>
              <div className="flex flex-col gap-6 w-full">
                 <img src={IMAGES.detail} alt="Craftsmanship" className="w-full h-[50vh] object-cover grayscale opacity-80" />
                 <p className="text-sm uppercase tracking-widest text-white/40 text-left">01. Precision Craftsmanship</p>
              </div>
           </div>
        </section>

        {/* Fullwidth Immersive Section */}
        <section className="relative w-full h-screen overflow-hidden mt-20">
           <div className="absolute inset-0 bg-[#000]">
              <motion.div 
                 className="w-full h-full relative"
                 initial={{ scale: 1.2, opacity: 0 }}
                 whileInView={{ scale: 1, opacity: 0.6 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeOut" }}
              >
                  <img src={IMAGES.chair} alt="Our Lounge" className="w-full h-full object-cover object-center grayscale mix-blend-screen" />
              </motion.div>
           </div>
           {/* Text Overlay */}
           <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 mix-blend-difference pointer-events-none">
              <h2 className="font-serif text-[clamp(3rem,10vw,8rem)] italic leading-none">
                 The Inner Sanctum
              </h2>
              <p className="mt-8 uppercase font-sans tracking-[0.3em] text-xs max-w-sm">
                 Where discretion meets exceptional service.
              </p>
           </div>
        </section>

        {/* Services / Menu */}
        <section className="py-32 px-6 md:px-20 max-w-7xl mx-auto">
           <div className="flex flex-col mb-20 md:w-2/3">
              <div className="font-sans uppercase text-xs tracking-[0.2em] text-[#A69B8D] mb-6">Service Repertoire</div>
              <h2 className="font-serif text-5xl md:text-7xl font-light tracking-tight text-[#F5F2EB] leading-[1.1]">
                 Engineering your <span className="italic">elegance.</span>
              </h2>
           </div>

           <ServiceList />
        </section>

        {/* Footer */}
        <footer className="relative bg-[#050505] pt-32 pb-16 px-6 md:px-20 overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-16 border-b border-white/10 pb-16">
              <div className="flex flex-col gap-8 max-w-md">
                 <h3 className="font-serif text-4xl italic text-[#A69B8D]">Visit the Atelier</h3>
                 <div className="flex gap-4">
                    <MapPin className="w-5 h-5 text-white/50 shrink-0 mt-1" />
                    <p className="font-sans text-white/50 leading-relaxed font-light">
                       404 Sartorial Avenue,<br/>
                       Metropolis District 9<br/>
                       NY 10012
                    </p>
                 </div>
              </div>

              <div className="flex flex-col gap-4 w-full md:w-auto text-left md:text-right font-sans uppercase text-xs tracking-widest text-[#F5F2EB]">
                 <a href="#" className="hover:text-[#A69B8D] transition-colors py-2 flex items-center md:justify-end gap-4 group">
                    Instagram <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                 </a>
                 <a href="#" className="hover:text-[#A69B8D] transition-colors py-2 flex items-center md:justify-end gap-4 group">
                    Book Appointment <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                 </a>
                 <a href="#" className="hover:text-[#A69B8D] transition-colors py-2 flex items-center md:justify-end gap-4 group">
                    Journal <ArrowRight className="w-4 h-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                 </a>
              </div>
           </div>

           <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8 font-sans text-xs uppercase tracking-widest text-white/30">
              <p>&copy; {new Date().getFullYear()} GENTS & BLADES. ALL RIGHTS RESERVED.</p>
              <div className="flex gap-8">
                 <a href="#" className="hover:text-white/60">Privacy</a>
                 <a href="#" className="hover:text-white/60">Terms</a>
              </div>
           </div>

           {/* Massive background text */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.02] w-full text-center whitespace-nowrap hidden md:block">
              <span className="font-serif text-[28vw] leading-none italic font-black">SARTORIAL</span>
           </div>
        </footer>

      </div>
    </ReactLenis>
  );
}
`;
fs.writeFileSync('src/App.tsx', appCode);
