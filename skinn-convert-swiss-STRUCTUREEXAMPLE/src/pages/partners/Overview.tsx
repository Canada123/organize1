import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const PartnersOverview = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24">
        <div className="container-custom section-padding">
          <h1 className="text-4xl font-bold text-center">Partners Overview</h1>
          <p className="text-center text-muted-foreground mt-4">Coming soon...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartnersOverview;