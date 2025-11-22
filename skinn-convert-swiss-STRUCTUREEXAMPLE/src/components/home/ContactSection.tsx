
import React from "react";
import ContactForm from "./ContactForm";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

const ContactSection = () => {
  const translations = useTranslation('home');
  
  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-primary" />,
      title: translations.contact.contactInfo.email.title,
      content: translations.contact.contactInfo.email.content,
      link: `mailto:${translations.contact.contactInfo.email.content}`,
    },
    {
      icon: <Phone className="h-5 w-5 text-primary" />,
      title: translations.contact.contactInfo.phone.title,
      content: translations.contact.contactInfo.phone.content,
      link: `tel:${translations.contact.contactInfo.phone.content.replace(/\s/g, "")}`,
    },
    {
      icon: <MapPin className="h-5 w-5 text-primary" />,
      title: translations.contact.contactInfo.address.title,
      content: translations.contact.contactInfo.address.content,
      link: `https://maps.google.com/?q=${encodeURIComponent(translations.contact.contactInfo.address.content)}`,
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="text-primary font-medium">{translations.contact.tagline}</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              {translations.contact.title}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {translations.contact.description}
            </p>

            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-secondary p-2 rounded-full">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <a 
                      href={item.link} 
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.content}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary/20 transition-colors group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-medical-teal group-hover:text-primary">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary/20 transition-colors group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-medical-teal group-hover:text-primary">
                  <path d="M22 4C22 4 21.3 6.1 20 7.4C21.6 17.4 10.6 24.7 2 19C4.2 19.1 6.4 18.4 8 17C3 15.5 0.5 9.6 3 5C5.2 7.6 8.6 9.1 12 9C11.1 4.8 16 2.4 19 5.2C20.1 5.2 22 4 22 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary/20 transition-colors group">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-medical-teal group-hover:text-primary">
                  <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11.37C16.1234 12.2022 15.9812 13.0522 15.5937 13.799C15.2062 14.5458 14.5931 15.1514 13.8416 15.5297C13.0901 15.9079 12.2384 16.0396 11.4077 15.9059C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1902 8.22768 13.4229 8.09402 12.5922C7.96035 11.7616 8.09202 10.9099 8.47028 10.1584C8.84854 9.40685 9.45414 8.79374 10.201 8.40624C10.9478 8.01874 11.7978 7.87658 12.63 8C13.4789 8.12588 14.2648 8.52146 14.8717 9.1283C15.4785 9.73515 15.8741 10.5211 16 11.37Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="bg-secondary p-6 md:p-8 rounded-xl">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
