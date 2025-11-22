import React from 'react';
import { Helmet } from 'react-helmet-async';
import EligibilityChecker from '@/components/home/EligibilityChecker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const EligibilityFlow: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>SKIIN Eligibility Assessment | Heart Monitoring Questionnaire</title>
        <meta 
          name="description" 
          content="Complete your SKIIN heart monitoring eligibility assessment. Quick questionnaire to determine coverage and next steps for cardiac screening." 
        />
        <meta name="keywords" content="heart monitoring, eligibility, cardiac screening, SKIIN, health assessment" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <EligibilityChecker />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default EligibilityFlow;