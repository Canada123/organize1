import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft, Calendar, Clock, Video, FileText } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

const requestDemoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  organization: z.string().min(2, 'Organization name is required'),
  role: z.string().min(1, 'Please select your role'),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, 'You must agree to the privacy policy'),
});

type RequestDemoFormData = z.infer<typeof requestDemoSchema>;

const RequestDemo = () => {
  const navigate = useNavigate();
  const t = useTranslation('demo');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RequestDemoFormData>({
    resolver: zodResolver(requestDemoSchema),
  });

  const onSubmit = async (data: RequestDemoFormData) => {
    try {
      // Here you would integrate with your backend API
  // Console statement removed by ESLint fix
      // Show success message
      toast.success('Demo request submitted successfully! We will contact you within 24 hours.');
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit demo request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form Section */}
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Request a Demo
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the future of cardiac monitoring. Fill out the form below and our team will contact you within 24 hours to schedule a personalized demonstration.
              </p>

              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          {...register('firstName')}
                          placeholder="John"
                        />
                        {errors.firstName && (
                          <p className="text-sm text-destructive mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          {...register('lastName')}
                          placeholder="Doe"
                        />
                        {errors.lastName && (
                          <p className="text-sm text-destructive mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...register('phone')}
                        placeholder="+41 XX XXX XX XX"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="organization">Organization/Practice *</Label>
                      <Input
                        id="organization"
                        {...register('organization')}
                        placeholder="Your organization name"
                      />
                      {errors.organization && (
                        <p className="text-sm text-destructive mt-1">{errors.organization.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="role">Your Role *</Label>
                      <Select onValueChange={(value) => setValue('role', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="physician">Physician</SelectItem>
                          <SelectItem value="cardiologist">Cardiologist</SelectItem>
                          <SelectItem value="practice-manager">Practice Manager</SelectItem>
                          <SelectItem value="hospital-admin">Hospital Administrator</SelectItem>
                          <SelectItem value="insurance">Insurance Representative</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.role && (
                        <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Information (Optional)</Label>
                      <Textarea
                        id="message"
                        {...register('message')}
                        placeholder="Tell us about your specific needs or questions..."
                        rows={4}
                      />
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="consent"
                        onCheckedChange={(checked) => setValue('consent', checked as boolean)}
                      />
                      <Label htmlFor="consent" className="text-sm leading-relaxed">
                        I agree to the{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          privacy policy
                        </a>{' '}
                        and consent to be contacted regarding this demo request. *
                      </Label>
                    </div>
                    {errors.consent && (
                      <p className="text-sm text-destructive mt-1">{errors.consent.message}</p>
                    )}

                    <Button type="submit" size="lg" className="w-full">
                      Request Demo
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Information Section */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>What to Expect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Quick Response</h3>
                      <p className="text-sm text-muted-foreground">
                        Our team will contact you within 24 hours to schedule your demo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Video className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Personalized Demo</h3>
                      <p className="text-sm text-muted-foreground">
                        30-minute video call tailored to your specific needs and use cases
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Comprehensive Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn about features, reimbursement, implementation, and support
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-semibold">Q&A Session</h3>
                      <p className="text-sm text-muted-foreground">
                        Get all your questions answered by our medical experts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Demo Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">SKIIN smart textile technology overview</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">Live ECG monitoring demonstration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">MVCP (Myant Virtual Clinic Portal) walkthrough</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">Patient app features and reports</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">Insurance reimbursement process</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">Implementation timeline and support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestDemo;