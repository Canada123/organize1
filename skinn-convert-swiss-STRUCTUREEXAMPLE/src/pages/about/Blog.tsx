import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Heart, TrendingUp, Users, Download, Globe, Calendar } from 'lucide-react';

const Blog = () => {
  const blogCategories = [
    {
      icon: Heart,
      title: "Heart Health Education",
      description: "Complex cardiac topics explained in approachable articles with analogies and simple graphics",
      posts: [
        "Silent but Dangerous: Understanding Atrial Fibrillation",
        "10 Tips for a Heart-Healthy Lifestyle",
        "Understanding Your Heart Rhythm"
      ]
    },
    {
      icon: TrendingUp,
      title: "Industry Trends & Research",
      description: "Latest developments in digital health and cardiology research findings",
      posts: [
        "Why 10 Days? The Science of Long-term ECG",
        "AI in Cardiac Monitoring: Present and Future",
        "Extended Monitoring vs Traditional Holter"
      ]
    },
    {
      icon: Users,
      title: "Patient & Doctor Stories",
      description: "Real-world experiences highlighting the impact of extended cardiac monitoring",
      posts: [
        "Maria's Story: How Extended Monitoring Caught My Arrhythmia",
        "5 Questions with Dr. Keller on SKIIN in Primary Care",
        "A Cardiologist's Perspective on Wearable ECG"
      ]
    },
    {
      icon: BookOpen,
      title: "SKIIN Updates & FAQs",
      description: "Latest features, announcements, and detailed answers to common questions",
      posts: [
        "Holter vs. Smartwatch: Complementary, Not Competing",
        "Understanding Swiss Insurance Coverage",
        "Getting Started with SKIIN: A Complete Guide"
      ]
    }
  ];

  const resources = [
    {
      title: "Living with an Arrhythmia",
      type: "Patient Guide",
      format: "PDF",
      description: "Comprehensive guide for patients diagnosed with cardiac arrhythmias"
    },
    {
      title: "Insurance Pathways for Physicians",
      type: "Clinical Resource", 
      format: "PDF",
      description: "One-page reference for navigating Swiss insurance requirements"
    },
    {
      title: "Home Arrhythmia Detection",
      type: "Educational",
      format: "Interactive",
      description: "Understanding when and how to monitor heart rhythm at home"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container-custom section-padding">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog & Resources</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Educational content, insights, and stories about heart health, preventive care, 
              and the science behind SKIIN
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="mb-16 bg-secondary/30">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Education is Our Mission</h2>
              <p className="text-lg max-w-3xl mx-auto">
                We believe education is a key part of our mission – informed patients make empowered 
                healthcare decisions. Our blog features content to help you understand heart health, 
                make informed decisions, and stay updated on the latest in cardiac care.
              </p>
            </CardContent>
          </Card>

          {/* Blog Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Content Categories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {blogCategories.map((category, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <category.icon className="h-8 w-8 text-primary" />
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Recent Posts:</h4>
                      {category.posts.map((post, postIndex) => (
                        <div key={postIndex} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-muted-foreground">{post}</span>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Posts
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Content */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Recent</span>
                    <Badge variant="secondary">Popular</Badge>
                  </div>
                  <h3 className="font-semibold mb-3">Silent but Dangerous: Understanding Atrial Fibrillation</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how AFib can go unnoticed and why longer monitoring matters, explained 
                    in simple terms with helpful analogies.
                  </p>
                  <Button variant="outline" size="sm">Read Article</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <Badge variant="secondary">Research</Badge>
                  </div>
                  <h3 className="font-semibold mb-3">Why 10 Days? The Science of Long-term ECG</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Research showing that 10-day patches find significantly more arrhythmias 
                    than 24-hour Holter monitoring.
                  </p>
                  <Button variant="outline" size="sm">Read Article</Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Patient Story</span>
                    <Badge variant="secondary">Inspiring</Badge>
                  </div>
                  <h3 className="font-semibold mb-3">Maria's Story: How Extended Monitoring Caught My Arrhythmia</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    A Zurich patient's experience with SKIIN and how it helped avoid 
                    a serious cardiac event.
                  </p>
                  <Button variant="outline" size="sm">Read Story</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Resources Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">Downloadable Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Download className="h-8 w-8 text-primary" />
                      <Badge variant="outline">{resource.format}</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{resource.type}</p>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Multilingual Support */}
          <Card className="mb-16">
            <CardContent className="p-8">
              <div className="text-center">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Multilingual Content</h2>
                <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                  We maintain content in multiple languages to serve all Swiss communities. 
                  German versions are available for Swiss-German readers, with French versions 
                  as we expand in Romandy.
                </p>
                <div className="flex justify-center space-x-4">
                  <Badge variant="outline" className="text-base px-4 py-2">Deutsch</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">Français</Badge>
                  <Badge variant="outline" className="text-base px-4 py-2">English</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quality Assurance */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Medical Accuracy Guarantee</h2>
            <p className="text-lg max-w-4xl mx-auto mb-8">
              Our content team works closely with medical experts to ensure all information is 
              accurate and up-to-date. Each educational article is reviewed by a clinician for 
              medical accuracy, giving you confidence in the information you're reading.
            </p>
            <Button size="lg">
              Subscribe to Our Newsletter
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;