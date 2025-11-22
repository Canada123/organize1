import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TestimonialCard {
  id: number;
  name: string;
  age: string;
  location: string;
  condition: string;
  quote: string;
  image: string;
}

interface TestimonialScrollCarouselProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

export const TestimonialScrollCarousel: React.FC<TestimonialScrollCarouselProps> = ({ 
  className,
  title = "What Our Patients Say",
  subtitle = "Join thousands of Swiss families who have discovered peace of mind with SKIIN's comfortable, continuous heart monitoring"
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-50%"]); // Slower scroll

  return (
    <section ref={targetRef} className={cn("relative h-[200vh] bg-background", className)}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto px-6">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-medium">
            REAL STORIES
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Carousel */}
        <motion.div style={{ x }} className="flex gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const TestimonialCard: React.FC<{ testimonial: TestimonialCard }> = ({ testimonial }) => {
  return (
    <motion.div
      className="group relative flex-shrink-0 w-[500px] bg-white rounded-2xl shadow-lg overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Section */}
      <div className="relative h-80 overflow-hidden">
        <div
          style={{
            backgroundImage: `url(${testimonial.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Patient Info Overlay */}
        <div className="absolute bottom-4 left-6 text-white">
          <h3 className="text-2xl font-bold">{testimonial.name}</h3>
          <p className="text-sm opacity-90">
            {testimonial.age} • {testimonial.location}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
            {testimonial.condition}
          </span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          "{testimonial.quote}"
        </p>
      </div>
    </motion.div>
  );
};

const testimonials: TestimonialCard[] = [
  {
    id: 1,
    name: "Maria S.",
    age: "72 years old",
    location: "Zurich",
    condition: "Atrial Fibrillation",
    quote: "After my AFib diagnosis, SKIIN gave me confidence. It's so comfortable I forget I'm wearing it, yet my cardiologist gets detailed reports that have helped adjust my treatment twice already.",
    image: "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=800&q=80&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Thomas K.",
    age: "58 years old",
    location: "Basel",
    condition: "Post-Surgery Monitoring",
    quote: "After my heart surgery, wearing SKIIN at home meant fewer hospital visits. The 10-day monitoring caught irregularities my doctor said we would have missed with traditional methods.",
    image: "https://images.unsplash.com/photo-1581579186913-aa3a27025166?w=800&q=80&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Elisabeth M.",
    age: "45 years old",
    location: "Geneva",
    condition: "Family History",
    quote: "As someone with a family history of heart issues, early detection is crucial. SKIIN found an arrhythmia that short tests missed. My cardiologist said catching it early made all the difference.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Hans P.",
    age: "65 years old",
    location: "Bern",
    condition: "Silent AFib",
    quote: "I had no symptoms at all. SKIIN detected silent AFib episodes during my routine screening. Now I'm on the right medication and feel more secure about my future.",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Anna L.",
    age: "68 years old",
    location: "Lucerne",
    condition: "Palpitations",
    quote: "For years, I experienced occasional palpitations that never happened during doctor visits. SKIIN finally captured them, leading to a proper diagnosis and treatment plan.",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Robert G.",
    age: "70 years old",
    location: "Lausanne",
    condition: "Preventive Care",
    quote: "At my age, prevention is key. The 10-day monitoring gives my doctor a complete picture of my heart health. It's reassuring to know everything is being watched so carefully.",
    image: "https://images.unsplash.com/photo-1582461683408-8e5d8eb07d8e?w=800&q=80&auto=format&fit=crop"
  }
];

export default TestimonialScrollCarousel;