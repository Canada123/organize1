import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DoctorUploadPortal } from '@/components/forms/eligibility/DoctorUploadPortal';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const DoctorReferralUpload: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>GP Referral Upload | SKIIN Switzerland</title>
        <meta 
          name="description" 
          content="Secure document upload portal for healthcare providers to submit patient referrals for SKIIN heart monitoring." 
        />
        <meta name="keywords" content="doctor portal, GP referral, medical upload, SKIIN, healthcare professional" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <Navbar />
        <main className="py-8">
          <DoctorUploadPortal />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default DoctorReferralUpload;