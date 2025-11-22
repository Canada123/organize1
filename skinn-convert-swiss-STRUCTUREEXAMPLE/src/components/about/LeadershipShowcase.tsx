import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressiveSection } from '@/components/ui/progressive-section';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { LinkedinIcon } from 'lucide-react';

interface LeaderProfile {
  name: string;
  title: string;
  description: string;
  image: string;
  linkedIn?: string;
}

export function LeadershipShowcase() {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const leaders: LeaderProfile[] = [
    {
      name: "Vincent Martinez",
      title: "CEO Nanoleq / Head of Europe Business Unit",
      description: "Spearheading SKIIN's expansion across Switzerland, Germany, and Austria. Former ETH Zurich researcher bringing Swiss precision to cardiac care.",
      image: "/assets/images/team/vincent-martinez-official-headshot.jpg"
    },
    {
      name: "Simon Yang",
      title: "Head of Product - Europe",
      description: "Former Head of Product at Nanoleq, now leading product development efforts at Myant and heading Product strategy in Europe.",
      image: "/assets/images/team/Team-CH2.png"
    },
    {
      name: "Pablo Doerig",
      title: "COO Europe",
      description: "Former COO of Nanoleq, now orchestrating operations across European markets with focus on regulatory compliance and market expansion.",
      image: "/assets/images/team/Pablo-Doerig.jpeg"
    },
    {
      name: "Tony Chahine",
      title: "CEO Myant Corporation",
      description: "Visionary leader who recognized Nanoleq's potential and brought Swiss innovation into Myant's global ecosystem.",
      image: "/assets/images/team/tony-chahine-official-headshot-myant-corp.jpg"
    }
  ];

  return (
    <ProgressiveSection className="py-20 md:py-30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Leadership Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Combining Swiss innovation with global expertise to transform cardiac care
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-8 mb-16">
          {leaders.map((leader, index) => (
            <Card
              key={index}
              className={cn(
                "overflow-hidden hover:shadow-lg transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <img 
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <h3 className="text-2xl font-bold mb-2">{leader.name}</h3>
                    <p className="text-primary font-medium mb-4">{leader.title}</p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {leader.description}
                    </p>
                    {leader.linkedIn && (
                      <a 
                        href={leader.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
                      >
                        <LinkedinIcon className="w-5 h-5 mr-2" />
                        Connect on LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team Photo */}
        <div className={cn(
          "transition-all duration-1000",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )} style={{ transitionDelay: "600ms" }}>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <img 
                src="/assets/images/team/Myant-Team.png"
                alt="Myant Global Team"
                className="w-full h-auto"
              />
            </CardContent>
          </Card>
          <p className="text-center text-lg text-muted-foreground mt-6">
            Part of the Myant global family - Over 200 innovators working to transform healthcare
          </p>
        </div>
      </div>
    </ProgressiveSection>
  );
}