import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TechnicalToggleProps {
  title: string;
  children: React.ReactNode;
}

const TechnicalToggle: React.FC<TechnicalToggleProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between bg-muted hover:bg-muted/80 border text-left"
      >
        <span className="font-medium text-primary">{title}</span>
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      {isOpen && (
        <div className="mt-0 p-4 border border-t-0 rounded-b-md bg-background text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

const TriTestReport: React.FC = () => {
  const t = useTranslation('ui');
  const [activeView, setActiveView] = useState<'patient' | 'clinical'>('patient');

  // Theme-aware color classes
  const colorClasses = {
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-destructive/100',
    primary: 'bg-primary',
    textPrimary: 'text-primary',
    textForeground: 'text-foreground',
    textMuted: 'text-muted-foreground',
    bgMuted: 'bg-muted',
    bgBackground: 'bg-background'
  };

  return (
    <div className="max-w-4xl mx-auto my-8 font-['Inter'] bg-muted/30">
      <div className="bg-background rounded-lg shadow-lg overflow-hidden border">
        {/* Header */}
        <header className="bg-background p-6 text-center border-b">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://i.imgur.com/KFif4xF.png" 
              alt="Myant Health Logo" 
              className="h-10 w-auto object-contain"
            />
          </div>
          <h1 className="text-3xl lg:text-4xl font-light text-primary mb-2 tracking-tight">
            {t.medicalReport.title}
          </h1>
          <div className="text-lg text-muted-foreground font-normal">
            {t.medicalReport.subtitle}
          </div>
        </header>

        {/* View Toggle */}
        <div className="flex justify-center bg-muted/50 p-3 border-b">
          <Button
            variant={activeView === 'patient' ? 'default' : 'outline'}
            onClick={() => setActiveView('patient')}
            className="mx-1 px-6"
          >
            {t.medicalReport.patientView}
          </Button>
          <Button
            variant={activeView === 'clinical' ? 'default' : 'outline'}
            onClick={() => setActiveView('clinical')}
            className="mx-1 px-6"
          >
            {t.medicalReport.clinicalView}
          </Button>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {/* Patient Info */}
          <Card className="mb-6 bg-muted/30">
            <CardContent className="p-4">
              <h3 className="text-lg font-semibold text-foreground mb-4 pb-2 border-b">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-muted mb-1">Patient Name</div>
                  <div className="text-foreground">John Smith</div>
                </div>
                <div>
                  <div className="font-medium text-muted mb-1">Date of Birth</div>
                  <div className="text-foreground">January 15, 1965</div>
                </div>
                <div>
                  <div className="font-medium text-muted mb-1">Patient ID</div>
                  <div className="text-foreground">MYT-2025-10547</div>
                </div>
                <div>
                  <div className="font-medium text-muted mb-1">Date of Report</div>
                  <div className="text-foreground">May 2, 2025</div>
                </div>
                <div>
                  <div className="font-medium text-muted mb-1">Monitoring Period</div>
                  <div className="text-foreground">April 15 - 28, 2025</div>
                </div>
                <div>
                  <div className="font-medium text-muted mb-1">Referring Physician</div>
                  <div className="text-foreground">Dr. Sarah Johnson</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Legend */}
          <Card className="mb-6 bg-gray-50 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <h4 className="font-semibold text-primary mb-3">Result Indicators</h4>
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2 border"></div>
                  <span className="font-medium">Normal Range</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2 border"></div>
                  <span className="font-medium">Needs Attention / Lifestyle Change</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2 border"></div>
                  <span className="font-medium">Requires Discussion with Doctor</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient View Content */}
          {activeView === 'patient' && (
            <div>
              {/* Health Summary */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-primary mb-4 pb-2 border-b">
                    Your Health Summary
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Findings from your 10-day Tricorder study (240 hrs ECG, 48 hrs BP, 3 nights sleep).
                  </p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Key Findings</h3>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                      <Card className="p-4 bg-gray-50">
                        <div className="font-semibold text-primary mb-2">Heart Rhythm</div>
                        <div className="flex items-start">
                          <div className="w-3 h-3 bg-destructive/100 rounded mr-3 mt-1 flex-shrink-0"></div>
                          <div className="text-sm text-muted-foreground">
                            Brief episodes of Atrial Fibrillation detected (3 episodes, longest 16m 58s). 
                            Discuss this irregular rhythm with your doctor.
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 bg-gray-50">
                        <div className="font-semibold text-primary mb-2">Blood Pressure</div>
                        <div className="flex items-start">
                          <div className="w-3 h-3 bg-destructive/100 rounded mr-3 mt-1 flex-shrink-0"></div>
                          <div className="text-sm text-muted-foreground">
                            Mildly elevated average (135/83 mmHg) with increased arterial stiffness (10m/s). 
                            Blood pressure did not dip sufficiently during sleep.
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 bg-gray-50">
                        <div className="font-semibold text-primary mb-2">Sleep Quality</div>
                        <div className="flex items-start">
                          <div className="w-3 h-3 bg-yellow-500 rounded mr-3 mt-1 flex-shrink-0"></div>
                          <div className="text-sm text-muted-foreground">
                            Results suggest mild obstructive sleep apnea (approx. 12 breathing interruptions/hour), 
                            potentially affecting sleep quality.
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Card className="p-4 bg-gray-100">
                    <h3 className="text-lg font-semibold text-primary mb-3">Recommended Next Steps</h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <span>Review this report's details.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <span>
                          <strong className="text-destructive bg-destructive/10 px-1 rounded">
                            Schedule an appointment with your doctor
                          </strong> to discuss these findings, especially Atrial Fibrillation.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <span>Discuss lifestyle recommendations (diet, exercise, sleep habits) with your doctor.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          4
                        </div>
                        <span>Consider annual cardiovascular screening for ongoing monitoring.</span>
                      </li>
                    </ol>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Remember that these tests represent your current health state. As your health is constantly changing, 
                      please consider repeating the tests on a regular basis - for instance once a year or more often as 
                      recommended by your doctor.
                    </p>
                  </Card>
                </CardContent>
              </Card>

              {/* Detailed Results */}
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-6">Detailed Results (Patient View)</h2>

                {/* ECG Module */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      Heart Rhythm (ECG/Holter)
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 border rounded p-2">
                        <img 
                          src="https://imgur.com/0lHwtWr.png" 
                          alt="Heart Rate & Arrhythmia Timeline"
                          className="w-full h-auto rounded"
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Continuous heart rhythm monitoring for 10 days.
                        </p>
                        
                        <div className="bg-white border rounded overflow-hidden">
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b">
                                <td className="px-3 py-2 font-medium">Avg. Heart Rate</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2"></div>
                                  94 bpm
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2 font-medium">Heart Rate Range</td>
                                <td className="px-3 py-2">46 - 174 bpm</td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2 font-medium">Arrhythmias</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2"></div>
                                  Atrial Fibrillation (3 episodes, max 16m 58s)
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2 font-medium">AFib Burden</td>
                                <td className="px-3 py-2">1.2% (~65 mins/day)</td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium">Symptom Match</td>
                                <td className="px-3 py-2">Racing heart matched AFib episodes</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <Card className="mt-4 p-4 bg-gray-100">
                          <p className="text-sm mb-2">
                            <strong className="text-primary">What This Means:</strong> Mostly normal rhythm, 
                            but episodes of Atrial Fibrillation were detected, matching your symptoms.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-primary">Guidance:</strong> AFib needs medical evaluation. 
                            This condition may put you at risk of stroke and congestive heart failure. 
                            Professional guidelines may recommend blood thinners, and medications that can slow your heart rate.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* BP Module */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                      </svg>
                      Blood Pressure (48-hour)
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 border rounded p-2">
                        <img 
                          src="https://imgur.com/IozCydS.png" 
                          alt="24-Hour Blood Pressure Profile"
                          className="w-full h-auto rounded"
                        />
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Regular measurements over 48 hours, day and night.
                        </p>
                        
                        <div className="bg-white border rounded overflow-hidden">
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b">
                                <td className="px-3 py-2 font-medium">Avg. 24-Hour BP</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2"></div>
                                  135/83 mmHg
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2 font-medium">Avg. Daytime BP</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2"></div>
                                  138/85 mmHg
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2 font-medium">Avg. Nighttime BP</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2"></div>
                                  132/81 mmHg
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2 font-medium">Nighttime Dip</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2"></div>
                                  4% (Low - "Non-dipper")
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium">Arterial Stiffness</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mr-2"></div>
                                  10 m/s (Elevated)
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <Card className="mt-4 p-4 bg-gray-100">
                          <p className="text-sm mb-2">
                            <strong className="text-primary">What This Means:</strong> Your average BP is mildly elevated. 
                            It didn't drop enough during sleep (non-dipper pattern), and your arteries show some stiffness.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-primary">Guidance:</strong> Consider lifestyle changes: 
                            reduce salt intake, increase exercise, maintain healthy weight, and ensure consistent sleep schedule.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sleep Module */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V7H1v10h22v-6c0-2.21-1.79-4-4-4zm-2 9h-8V9h6c1.1 0 2 .9 2 2v5z"/>
                      </svg>
                      Sleep Study (3-night)
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 border rounded p-2 min-h-48 flex items-center justify-center">
                        <div className="text-center text-muted-foreground/80">
                          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-sm font-medium">Sleep Stages & Breathing Events</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Monitoring sleep patterns, breathing, and oxygen levels.
                        </p>
                        
                        <div className="bg-white border rounded overflow-hidden">
                          <table className="w-full text-sm">
                            <tbody>
                              <tr className="border-b">
                                <td className="px-3 py-2 font-medium">Avg. Sleep Time</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                                  5.8 hours/night
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2 font-medium">Breathing Events (AHI)</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                                  12.4 events/hour
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2 font-medium">Lowest Oxygen</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                                  91%
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2 font-medium">Time &lt;90% Oxygen</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                                  2.4% of sleep
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2 font-medium">Sleep Efficiency</td>
                                <td className="px-3 py-2 flex items-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                                  78%
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <Card className="mt-4 p-4 bg-gray-100">
                          <p className="text-sm mb-2">
                            <strong className="text-primary">What This Means:</strong> Findings suggest mild obstructive 
                            sleep apnea (OSA), with breathing interrupted ~12 times/hour.
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <strong className="text-primary">Guidance:</strong> Consider weight loss (if needed), 
                            avoiding sleeping on your back, maintaining regular sleep schedule.
                          </p>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Clinical View Content */}
          {activeView === 'clinical' && (
            <div>
              {/* Clinical Summary */}
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-primary mb-4 pb-2 border-b">
                    Clinical Summary
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    10-day RPM study via Myant Tricorder: Extended Holter, ABPM, HST.
                  </p>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Key Clinical Findings</h3>
                    <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                      <Card className="p-4 bg-gray-50">
                        <div className="font-semibold text-primary mb-2">Cardiac</div>
                        <div className="flex items-start">
                          <div className="w-3 h-3 bg-destructive/100 rounded mr-3 mt-1 flex-shrink-0"></div>
                          <div className="text-sm text-muted-foreground">
                            Paroxysmal AFib (1.2% burden), symptomatic correlation. Mild sinus tachycardia. 
                            SVPB/VPB WNL. HRV normal.
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 bg-gray-50">
                        <div className="font-semibold text-primary mb-2">Hemodynamic</div>
                        <div className="flex items-start">
                          <div className="w-3 h-3 bg-destructive/100 rounded mr-3 mt-1 flex-shrink-0"></div>
                          <div className="text-sm text-muted-foreground">
                            Stage 1 HTN (mean 135/83). Non-dipper (4% dip). Elevated PWV (10 m/s). 
                            High nocturnal BP load (67%).
                          </div>
                        </div>
                      </Card>
                      <Card className="p-4 bg-gray-50">
                        <div className="font-semibold text-primary mb-2">Sleep</div>
                        <div className="flex items-start">
                          <div className="w-3 h-3 bg-yellow-500 rounded mr-3 mt-1 flex-shrink-0"></div>
                          <div className="text-sm text-muted-foreground">
                            Mild OSA (AHI 12.4/hr, ODI 8.7). Min SpO2 91%. Reduced TST (5.8h) & efficiency (78%). 
                            Positional component noted.
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>

                  <Card className="p-4 bg-gray-100">
                    <h3 className="text-lg font-semibold text-primary mb-3">Clinical Recommendations</h3>
                    <ol className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          1
                        </div>
                        <span>Assess stroke risk (CHA₂DS₂-VASc) for anticoagulation necessity re: PAF.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          2
                        </div>
                        <span>Consider rate/rhythm control strategy for symptomatic PAF.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          3
                        </div>
                        <span>Initiate HTN management (lifestyle +/- pharmaco), address non-dipping pattern.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          4
                        </div>
                        <span>Recommend formal PSG to confirm OSA & guide therapy.</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold mr-3 flex-shrink-0 mt-0.5">
                          5
                        </div>
                        <span>Investigate OSA contribution to non-dipping HTN.</span>
                      </li>
                    </ol>
                  </Card>
                </CardContent>
              </Card>

              {/* Detailed Clinical Results */}
              <div>
                <h2 className="text-2xl font-semibold text-primary mb-6">Detailed Clinical Results</h2>

                {/* Extended Holter */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
                      Extended Holter Analysis (10-day)
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 border rounded p-2">
                        <img 
                          src="https://imgur.com/0lHwtWr.png" 
                          alt="ECG Strip: Atrial Fibrillation"
                          className="w-full h-auto rounded"
                        />
                      </div>
                      
                      <div>
                        <div className="bg-white border rounded overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-3 py-2 text-left font-semibold">Parameter</th>
                                <th className="px-3 py-2 text-left font-semibold">Value</th>
                                <th className="px-3 py-2 text-left font-semibold">Ref.</th>
                                <th className="px-3 py-2 text-center font-semibold w-12"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="px-3 py-2">HR Mean</td>
                                <td className="px-3 py-2">94 bpm</td>
                                <td className="px-3 py-2">60-100</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2">HR Min / Max</td>
                                <td className="px-3 py-2">46 / 174 bpm</td>
                                <td className="px-3 py-2">40-170</td>
                                <td className="px-3 py-2"></td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2">PAF Episodes</td>
                                <td className="px-3 py-2">3</td>
                                <td className="px-3 py-2">0</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2">PAF Burden</td>
                                <td className="px-3 py-2">1.2%</td>
                                <td className="px-3 py-2">&lt;1%</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2">SVPB (avg/24h)</td>
                                <td className="px-3 py-2">187</td>
                                <td className="px-3 py-2">&lt;200</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-green-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2">VPB (avg/24h)</td>
                                <td className="px-3 py-2">42</td>
                                <td className="px-3 py-2">&lt;500</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-green-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr>
                                <td className="px-3 py-2">SDNN</td>
                                <td className="px-3 py-2">112 ms</td>
                                <td className="px-3 py-2">&gt;100ms</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-green-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <TechnicalToggle title="Detailed Arrhythmia Analysis">
                      <p className="text-foreground/90">
                        Baseline: Sinus rhythm, mild sinus tachycardia. Findings: Paroxysmal AFib (longest 16m 58s on 2025-04-22 @ 14:32), 
                        correlated with patient-reported palpitations. Mean vent. rate during AF: 118 bpm. No significant pauses. 
                        SVPB/VPB counts WNL. SDNN (112ms) suggests preserved autonomic function.
                      </p>
                    </TechnicalToggle>
                  </CardContent>
                </Card>

                {/* ABPM */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
                      Ambulatory BP Monitoring (48-hour)
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 border rounded p-2">
                        <img 
                          src="https://imgur.com/IozCydS.png" 
                          alt="48-Hour ABPM Profile Plot"
                          className="w-full h-auto rounded"
                        />
                      </div>
                      
                      <div>
                        <div className="bg-white border rounded overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-3 py-2 text-left font-semibold">Parameter</th>
                                <th className="px-3 py-2 text-left font-semibold">Value</th>
                                <th className="px-3 py-2 text-left font-semibold">Ref.</th>
                                <th className="px-3 py-2 text-center font-semibold w-12"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="px-3 py-2">24h Mean SBP/DBP</td>
                                <td className="px-3 py-2">135 / 83 mmHg</td>
                                <td className="px-3 py-2">&lt;130/80</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2">Daytime Mean</td>
                                <td className="px-3 py-2">138 / 85 mmHg</td>
                                <td className="px-3 py-2">&lt;135/85</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2">Nighttime Mean</td>
                                <td className="px-3 py-2">132 / 81 mmHg</td>
                                <td className="px-3 py-2">&lt;120/70</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2">Nocturnal Dip</td>
                                <td className="px-3 py-2">4 %</td>
                                <td className="px-3 py-2">&gt;10%</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2">Pulse Wave Vel.</td>
                                <td className="px-3 py-2">10.0 m/s</td>
                                <td className="px-3 py-2">&lt;8</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-destructive/100 rounded mx-auto"></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <TechnicalToggle title="Hemodynamic Assessment Details">
                      <p className="text-foreground/90">
                        ABPM confirms Stage 1 HTN. Non-dipper pattern (4% dip) increases CVD risk. High BP load, particularly 
                        nocturnal (67%). Mildly elevated BP variability index (11.4). Increased arterial stiffness (PWV 10.0 m/s). 
                        Possible link between non-dipping pattern and suspected OSA.
                      </p>
                    </TechnicalToggle>
                  </CardContent>
                </Card>

                {/* Home Sleep Testing */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b">
                      Home Sleep Testing (3-night)
                    </h3>
                    
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="bg-gray-50 border rounded p-2 min-h-48 flex items-center justify-center">
                        <div className="text-center text-muted-foreground/80">
                          <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <span className="text-sm font-medium">Hypnogram & Respiratory Events</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="bg-white border rounded overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-3 py-2 text-left font-semibold">Parameter</th>
                                <th className="px-3 py-2 text-left font-semibold">Value</th>
                                <th className="px-3 py-2 text-left font-semibold">Ref.</th>
                                <th className="px-3 py-2 text-center font-semibold w-12"></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b">
                                <td className="px-3 py-2">Total Sleep Time (avg)</td>
                                <td className="px-3 py-2">5.8 h</td>
                                <td className="px-3 py-2">7-9</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2">AHI (avg)</td>
                                <td className="px-3 py-2">12.4 /h</td>
                                <td className="px-3 py-2">&lt;5</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2">ODI (avg)</td>
                                <td className="px-3 py-2">8.7 /h</td>
                                <td className="px-3 py-2">&lt;5</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b bg-gray-50">
                                <td className="px-3 py-2">SpO2 Baseline / Nadir</td>
                                <td className="px-3 py-2">95% / 91%</td>
                                <td className="px-3 py-2">&gt;90%</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-green-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                              <tr className="border-b">
                                <td className="px-3 py-2">Sleep Efficiency</td>
                                <td className="px-3 py-2">78 %</td>
                                <td className="px-3 py-2">&gt;85%</td>
                                <td className="px-3 py-2 text-center">
                                  <div className="w-3 h-3 bg-yellow-500 rounded mx-auto"></div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <TechnicalToggle title="Detailed Sleep Architecture Analysis">
                      <p className="text-foreground/90">
                        HST indicates mild OSA (AHI 12.4), primarily obstructive. ODI elevated (8.7). Minimal hypoxic burden 
                        (Nadir 91%, Time &lt;90% 2.4%). Reduced sleep efficiency (78%), TST (5.8h), and REM% (16%). 
                        Increased awakenings (17.3/night). Positional component noted (Supine AHI 18.9 vs. Non-supine 8.1). 
                        Formal PSG recommended for confirmation and potential RERA assessment.
                      </p>
                    </TechnicalToggle>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-gray-50 p-6 text-center border-t text-sm">
          <div className="max-w-2xl mx-auto mb-4 text-muted-foreground leading-relaxed">
            <strong className="text-destructive">Important:</strong> This report summarizes collected data and is{' '}
            <strong>not a diagnosis</strong>. Findings require interpretation by a healthcare provider considering 
            your full medical history. Please discuss these results with your doctor. It is recommended that you 
            repeat these tests on a regular basis.
          </div>
          <p className="text-xs text-muted-foreground/80">
            &copy; 2025 Myant Health. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default TriTestReport;