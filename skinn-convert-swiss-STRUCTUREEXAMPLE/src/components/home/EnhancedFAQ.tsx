import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { HelpCircle, Stethoscope, CreditCard, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedFAQProps {
  className?: string;
}

/**
 * Enhanced FAQ Section with categorized questions
 * Includes medical, insurance, and usage questions
 */
export function EnhancedFAQ({ className }: EnhancedFAQProps) {
  const translations = useTranslation('home');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Extended FAQ items with v7.2 medical questions
  const faqCategories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: HelpCircle,
      questions: [
        {
          question: "How do I know if SKIIN is right for me?",
          answer: "SKIIN is ideal if you have symptoms like palpitations, dizziness, or chest discomfort, or if you're at risk due to family history, high blood pressure, or age over 50. Our free assessment helps determine if extended monitoring could benefit you."
        },
        {
          question: "What's included in the SKIIN kit?",
          answer: "Your kit includes the SKIIN textile band in your size, a Bluetooth pod, charging cable, detailed instructions, and access to the SKIIN app. Everything ships directly to your home within 24-48 hours."
        },
        ...translations.faq.items.slice(3, 4) // Reuse existing FAQ
      ]
    },
    {
      id: "wearing-skiin",
      name: "Wearing SKIIN",
      icon: Stethoscope,
      questions: [
        {
          question: "Can I shower or exercise while wearing SKIIN?",
          answer: "Yes! SKIIN is water-resistant and designed for continuous wear. You can shower, exercise, and sleep comfortably. For intense activities, you may briefly remove it and put it back on afterward."
        },
        {
          question: "What if I have sensitive skin?",
          answer: "SKIIN uses hypoallergenic, medical-grade textiles with no adhesives or latex. The soft fabric is designed for sensitive skin. Maria from Zurich says: 'I almost forgot I was wearing it – so comfortable!'"
        },
        ...translations.faq.items.slice(1, 2) // Reuse existing FAQ
      ]
    },
    {
      id: "results",
      name: "Results & Reports",
      icon: Clock,
      questions: [
        {
          question: "How accurate is 10-day monitoring compared to 24-hour tests?",
          answer: "Clinical studies show 10-day monitoring detects 66% of arrhythmias compared to just 9% with 24-hour Holter monitors. The extended timeframe captures irregular rhythms that occur sporadically."
        },
        {
          question: "Who reviews my results?",
          answer: "Swiss-certified cardiologists review all AI-flagged events and create your personalized report. You receive both the detailed medical report and a summary in plain language."
        },
        ...translations.faq.items.slice(0, 1) // Reuse existing FAQ
      ]
    },
    {
      id: "insurance",
      name: "Insurance & Costs",
      icon: CreditCard,
      questions: [
        {
          question: "Is SKIIN covered by Swiss health insurance?",
          answer: "Yes, SKIIN is covered by basic insurance when medically prescribed. This includes GP, HMO, and Telmed models. Self-pay options are available for preventive screening at transparent prices."
        },
        {
          question: "What if my insurance model requires pre-approval?",
          answer: "We help navigate your specific insurance requirements. For HMO and Telmed models, we provide documentation for pre-approval. Our team handles the administrative work."
        },
        ...translations.faq.items.slice(2, 3) // Reuse existing FAQ
      ]
    }
  ];

  const filteredQuestions = selectedCategory === "all" 
    ? faqCategories.flatMap(cat => cat.questions.map(q => ({ ...q, category: cat.name })))
    : faqCategories.find(cat => cat.id === selectedCategory)?.questions || [];

  return (
    <section 
      className={cn("section-padding bg-white", className)}
      data-testid="enhanced-faq-section"
    >
      <div className="container-custom max-w-5xl">
        <div className="text-center mb-12">
          <span className="text-primary font-medium">{translations.faq.tagline}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {translations.faq.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about SKIIN cardiac monitoring
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
            data-testid="faq-category-all"
          >
            All Questions
          </Button>
          {faqCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`faq-category-${category.id}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-4">
          {filteredQuestions.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-6 data-[state=open]:bg-muted/50"
              data-testid={`faq-item-${index}`}
            >
              <AccordionTrigger className="text-left text-lg font-medium hover:no-underline py-4">
                <div className="flex-1">
                  {faq.question}
                  {'category' in faq && (
                    <span className="block text-sm text-muted-foreground font-normal mt-1">
                      {faq.category}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still Have Questions CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-br from-medical-teal/5 to-transparent border-medical-teal/20">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">
              Our cardiac care specialists are here to help you understand if SKIIN is right for you
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="default" onClick={() => window.location.href = '/about/contact'}>
                Contact Our Team
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/how-it-works/faq'}>
                View All FAQs
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}