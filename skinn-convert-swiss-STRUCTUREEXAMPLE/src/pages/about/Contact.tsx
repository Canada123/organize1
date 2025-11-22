import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, MapPin, Clock, MessageSquare, Users, Stethoscope, Video, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    userType: '',
    language: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll respond within 24 hours on weekdays.",
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      userType: '',
      language: '',
      message: ''
    });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "0800-SKIIN-CH (0800-754-262)",
      details: "Monday to Friday, 8:00 – 18:00 CET",
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@skiin.ch",
      details: "Response within 1 business day",
      action: "Send Email"
    },
    {
      icon: MessageSquare,
      title: "Contact Form",
      description: "Detailed inquiries",
      details: "Complete the form below",
      action: "Fill Form"
    }
  ];

  const specializedContacts = [
    {
      icon: Users,
      title: "General Information",
      email: "info@skiin.ch",
      description: "General questions about SKIIN services"
    },
    {
      icon: Stethoscope,
      title: "Physician Liaison",
      email: "clinical@skiin.ch",
      description: "Medical professional inquiries and demos"
    },
    {
      icon: Phone,
      title: "Technical Support",
      email: "support@skiin.ch",
      description: "Device troubleshooting and technical issues"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container-custom section-padding">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're here to help. Whether you're a patient, doctor, or have questions, reach out to us
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <method.icon className="h-12 w-12 text-myant-green mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                  <p className="font-medium text-myant-green mb-2">{method.description}</p>
                  <p className="text-sm text-muted-foreground mb-4">{method.details}</p>
                  <Button variant="outline" size="sm">{method.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Multilingual Support */}
          <Card className="mb-16 bg-secondary/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Multilingual Support</h2>
              <p className="text-lg text-muted-foreground mb-6">
                We have multilingual support staff available to assist you in your preferred language
              </p>
              <div className="flex justify-center space-x-4">
                <Badge variant="outline" className="text-base px-4 py-2">Deutsch</Badge>
                <Badge variant="outline" className="text-base px-4 py-2">Français</Badge>
                <Badge variant="outline" className="text-base px-4 py-2">English</Badge>
                <Badge variant="outline" className="text-base px-4 py-2">Schweizerdeutsch</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <MessageSquare className="h-8 w-8 text-myant-green mr-3" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="userType">I am a *</Label>
                      <Select value={formData.userType} onValueChange={(value) => setFormData({...formData, userType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="healthcare">Healthcare Professional</SelectItem>
                          <SelectItem value="corporate">Corporate Partner</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Bevorzugte Sprache / Langue préférée" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Please describe your question or inquiry..."
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Specialized Contacts */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Specialized Contact Points</h2>
              <div className="space-y-4 mb-8">
                {specializedContacts.map((contact, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <contact.icon className="h-6 w-6 text-myant-green mt-1" />
                        <div>
                          <h3 className="font-semibold">{contact.title}</h3>
                          <p className="text-sm text-myant-green">{contact.email}</p>
                          <p className="text-sm text-muted-foreground">{contact.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Physician Demo */}
              <Card className="bg-secondary/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Video className="h-8 w-8 text-myant-green" />
                    <h3 className="text-xl font-semibold">Physician Demo</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Request a 15-minute demo call where we walk you through the SKIIN platform
                  </p>
                  <Button variant="outline" className="w-full">
                    Request Physician Demo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Office Information */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                    <MapPin className="h-8 w-8 text-myant-green mr-3" />
                    Swiss Office
                  </h2>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>SKIIN Switzerland – Myant AG</strong></p>
                    <p>Bahnhofstrasse 123</p>
                    <p>8001 Zürich, Switzerland</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    *This is not a walk-in service center, but our administrative office. 
                    For device returns, please use the provided return packaging.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Clock className="h-6 w-6 text-myant-green mr-2" />
                    Support Hours
                  </h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p><strong>Phone Support:</strong></p>
                    <p>Monday - Friday: 8:00 - 18:00 CET</p>
                    <p>Weekend: Voicemail (next business day callback)</p>
                    <p><strong>Email Support:</strong></p>
                    <p>24/7 submission, 1 business day response</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Returns */}
          <Card className="mb-16">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Device Returns & Logistics</h3>
              <p className="text-muted-foreground mb-4">
                For device returns or shipping questions, contact our logistics partner at logistics@skiin.ch 
                or call our main line. Devices come with prepaid return labels – simply drop the return package 
                at any Post office or pickup point.
              </p>
              <p className="text-sm text-muted-foreground">
                Lost your return label? Contact us and we'll email you a PDF replacement.
              </p>
            </CardContent>
          </Card>

          {/* Emergency Notice */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">Important Medical Notice</h3>
              <p className="text-orange-700">
                <strong>For urgent medical questions after hours, contact your doctor or on-call medical services.</strong><br />
                Our support line is not a 24/7 emergency line.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;