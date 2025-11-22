
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "@/hooks/useTranslation";

const FaqSection = () => {
  const translations = useTranslation('home');
  
  return (
    <section className="section-padding bg-white">
      <div className="container-custom max-w-4xl">
        <div className="text-center mb-12">
          <span className="text-primary font-medium">{translations.faq.tagline}</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
            {translations.faq.title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {translations.faq.subtitle}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {translations.faq.items.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FaqSection;
