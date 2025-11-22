import React, { useState } from 'react';
import { MinimalButton } from '@/components/ui/minimal-button';
import {
  MinimalCard,
  MinimalCardHeader,
  MinimalCardTitle,
  MinimalCardDescription,
  MinimalCardContent,
  MinimalCardFooter,
} from '@/components/ui/minimal-card';
import { MinimalInput } from '@/components/ui/minimal-input';
import { MinimalSelect, type SelectOption } from '@/components/ui/minimal-select';
import { MinimalTextarea } from '@/components/ui/minimal-textarea';
import { Heart, Calendar, User, Mail, Phone, MessageSquare } from 'lucide-react';

const MinimalistShowcase: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const departmentOptions: SelectOption[] = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'general', label: 'General Medicine' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.department) newErrors.department = 'Please select a department';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#EEE8E1]/20 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0D0D0D] mb-4">
            Minimalist Design System
          </h1>
          <p className="text-lg text-[#475259]">
            Clean, elegant components for SKIIN Switzerland
          </p>
        </div>

        {/* Buttons Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#0D0D0D] mb-6">Buttons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MinimalCard>
              <MinimalCardHeader>
                <MinimalCardTitle>Primary Buttons</MinimalCardTitle>
                <MinimalCardDescription>Main actions and CTAs</MinimalCardDescription>
              </MinimalCardHeader>
              <MinimalCardContent className="space-y-3">
                <MinimalButton variant="primary" size="sm">Small Button</MinimalButton>
                <MinimalButton variant="primary" size="md">Medium Button</MinimalButton>
                <MinimalButton variant="primary" size="lg" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Start Heart Check
                </MinimalButton>
              </MinimalCardContent>
            </MinimalCard>

            <MinimalCard>
              <MinimalCardHeader>
                <MinimalCardTitle>Secondary Buttons</MinimalCardTitle>
                <MinimalCardDescription>Alternative actions</MinimalCardDescription>
              </MinimalCardHeader>
              <MinimalCardContent className="space-y-3">
                <MinimalButton variant="secondary" size="sm">Learn More</MinimalButton>
                <MinimalButton variant="secondary" size="md">View Details</MinimalButton>
                <MinimalButton variant="secondary" size="lg" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Later
                </MinimalButton>
              </MinimalCardContent>
            </MinimalCard>

            <MinimalCard>
              <MinimalCardHeader>
                <MinimalCardTitle>Ghost & States</MinimalCardTitle>
                <MinimalCardDescription>Text buttons and states</MinimalCardDescription>
              </MinimalCardHeader>
              <MinimalCardContent className="space-y-3">
                <MinimalButton variant="ghost">Cancel</MinimalButton>
                <MinimalButton variant="primary" loading={loading} onClick={() => setLoading(!loading)}>
                  {loading ? 'Processing...' : 'Click to Load'}
                </MinimalButton>
                <MinimalButton variant="secondary" disabled>
                  Disabled Button
                </MinimalButton>
              </MinimalCardContent>
            </MinimalCard>
          </div>
        </section>

        {/* Cards Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#0D0D0D] mb-6">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MinimalCard variant="default">
              <MinimalCardHeader>
                <MinimalCardTitle>Default Card</MinimalCardTitle>
              </MinimalCardHeader>
              <MinimalCardContent>
                <p className="text-sm text-[#475259]">
                  Clean white background with subtle shadow
                </p>
              </MinimalCardContent>
            </MinimalCard>

            <MinimalCard variant="soft">
              <MinimalCardHeader>
                <MinimalCardTitle>Soft Card</MinimalCardTitle>
              </MinimalCardHeader>
              <MinimalCardContent>
                <p className="text-sm text-[#475259]">
                  Warm beige background for comfort
                </p>
              </MinimalCardContent>
            </MinimalCard>

            <MinimalCard variant="outlined">
              <MinimalCardHeader>
                <MinimalCardTitle>Outlined Card</MinimalCardTitle>
              </MinimalCardHeader>
              <MinimalCardContent>
                <p className="text-sm text-[#475259]">
                  Transparent with border only
                </p>
              </MinimalCardContent>
            </MinimalCard>

            <MinimalCard variant="clickable" onClick={() => alert('Card clicked!')}>
              <MinimalCardHeader>
                <MinimalCardTitle>Clickable Card</MinimalCardTitle>
              </MinimalCardHeader>
              <MinimalCardContent>
                <p className="text-sm text-[#475259]">
                  Interactive with hover effects
                </p>
              </MinimalCardContent>
            </MinimalCard>
          </div>
        </section>

        {/* Form Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#0D0D0D] mb-6">Form Components</h2>
          <MinimalCard variant="soft" className="max-w-2xl mx-auto">
            <MinimalCardHeader>
              <MinimalCardTitle>Contact Form Example</MinimalCardTitle>
              <MinimalCardDescription>
                Minimalistic form elements with floating labels
              </MinimalCardDescription>
            </MinimalCardHeader>
            <form onSubmit={handleSubmit}>
              <MinimalCardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MinimalInput
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                  />
                  <MinimalInput
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    required
                  />
                </div>

                <MinimalSelect
                  label="Department"
                  value={formData.department}
                  onChange={(value) => setFormData({ ...formData, department: value })}
                  options={departmentOptions}
                  error={errors.department}
                  required
                />

                <MinimalTextarea
                  label="Your Message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your inquiry..."
                  rows={4}
                />
              </MinimalCardContent>
              <MinimalCardFooter className="justify-end space-x-3">
                <MinimalButton variant="ghost" type="button">
                  Clear
                </MinimalButton>
                <MinimalButton variant="primary" type="submit" loading={loading}>
                  Send Message
                </MinimalButton>
              </MinimalCardFooter>
            </form>
          </MinimalCard>
        </section>

        {/* Medical Context Examples */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#0D0D0D] mb-6">Medical Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MinimalCard variant="clickable">
              <MinimalCardHeader>
                <Heart className="h-8 w-8 text-[#004C96] mb-2" />
                <MinimalCardTitle>Heart Screening</MinimalCardTitle>
              </MinimalCardHeader>
              <MinimalCardContent>
                <p className="text-sm text-[#475259] mb-4">
                  10-day continuous monitoring for comprehensive cardiac assessment
                </p>
                <MinimalButton variant="primary" size="sm" className="w-full">
                  Start Assessment
                </MinimalButton>
              </MinimalCardContent>
            </MinimalCard>

            <MinimalCard variant="clickable">
              <MinimalCardHeader>
                <Calendar className="h-8 w-8 text-[#004C96] mb-2" />
                <MinimalCardTitle>Schedule Appointment</MinimalCardTitle>
              </MinimalCardHeader>
              <MinimalCardContent>
                <p className="text-sm text-[#475259] mb-4">
                  Book a consultation with our cardiac specialists
                </p>
                <MinimalButton variant="secondary" size="sm" className="w-full">
                  View Available Slots
                </MinimalButton>
              </MinimalCardContent>
            </MinimalCard>

            <MinimalCard variant="clickable">
              <MinimalCardHeader>
                <User className="h-8 w-8 text-[#004C96] mb-2" />
                <MinimalCardTitle>Patient Portal</MinimalCardTitle>
              </MinimalCardHeader>
              <MinimalCardContent>
                <p className="text-sm text-[#475259] mb-4">
                  Access your medical records and test results
                </p>
                <MinimalButton variant="ghost" size="sm" className="w-full">
                  Sign In →
                </MinimalButton>
              </MinimalCardContent>
            </MinimalCard>
          </div>
        </section>

        {/* Design Tokens Preview */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-[#0D0D0D] mb-6">Color Palette</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="h-24 rounded-lg bg-[#004C96] mb-2"></div>
              <p className="text-sm font-medium">Navy Blue</p>
              <p className="text-xs text-[#475259]">#004C96</p>
            </div>
            <div className="text-center">
              <div className="h-24 rounded-lg bg-[#5298F2] mb-2"></div>
              <p className="text-sm font-medium">Light Blue</p>
              <p className="text-xs text-[#475259]">#5298F2</p>
            </div>
            <div className="text-center">
              <div className="h-24 rounded-lg bg-[#5549A6] mb-2"></div>
              <p className="text-sm font-medium">Violet Accent</p>
              <p className="text-xs text-[#475259]">#5549A6</p>
            </div>
            <div className="text-center">
              <div className="h-24 rounded-lg bg-[#EEE8E1] mb-2"></div>
              <p className="text-sm font-medium">Soft Beige</p>
              <p className="text-xs text-[#475259]">#EEE8E1</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MinimalistShowcase;