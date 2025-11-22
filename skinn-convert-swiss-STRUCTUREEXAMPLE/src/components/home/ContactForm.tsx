
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

const ContactForm = () => {
  const { toast } = useToast();
  const translations = useTranslation('home');
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: translations.contact.form.successTitle,
        description: translations.contact.form.successDescription,
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        message: "",
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {translations.contact.form.name}
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={translations.contact.form.namePlaceholder}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {translations.contact.form.email}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={translations.contact.form.emailPlaceholder}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            {translations.contact.form.phone}
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder={translations.contact.form.phonePlaceholder}
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            {translations.contact.form.role}
          </label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger id="role">
              <SelectValue placeholder={translations.contact.form.rolePlaceholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">{translations.contact.form.roleOptions.patient}</SelectItem>
              <SelectItem value="physician">{translations.contact.form.roleOptions.physician}</SelectItem>
              <SelectItem value="healthcare_admin">{translations.contact.form.roleOptions.healthcareAdmin}</SelectItem>
              <SelectItem value="other">{translations.contact.form.roleOptions.other}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          {translations.contact.form.message}
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder={translations.contact.form.messagePlaceholder}
          rows={4}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="consent"
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          required
        />
        <label htmlFor="consent" className="text-sm text-muted-foreground">
          {translations.contact.form.consent}{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            {translations.contact.form.privacyPolicy}
          </Link>.
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-primary hover:bg-primary/90" 
        disabled={isSubmitting}
      >
        {isSubmitting ? translations.contact.form.submitting : translations.contact.form.submit}
      </Button>
    </form>
  );
};

export default ContactForm;
