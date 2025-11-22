export interface EmergencyInfo {
  title: string;
  message: string;
  severity: 'high' | 'medium';
  urgency: string;
  recommendations: string[];
}

export const getEmergencyMessage = (symptom: string): EmergencyInfo => {
  const lowerSymptom = symptom.toLowerCase();
  
  if (lowerSymptom.includes('fainting') || lowerSymptom.includes('loss of consciousness')) {
    return {
      title: 'Immediate Medical Attention Required',
      message: 'Loss of consciousness or fainting can indicate serious cardiac arrhythmias or other life-threatening conditions.',
      severity: 'high',
      urgency: 'CRITICAL',
      recommendations: [
        'Call 144 immediately if symptoms are ongoing',
        'Do not drive or operate machinery',
        'Have someone stay with you',
        'Seek emergency care within the next hour'
      ]
    };
  }
  
  if (lowerSymptom.includes('chest pain')) {
    return {
      title: 'Urgent Cardiac Assessment Required',
      message: 'Chest pain or discomfort can be a sign of heart attack, angina, or other serious cardiac conditions requiring immediate evaluation.',
      severity: 'high',
      urgency: 'URGENT',
      recommendations: [
        'Call 144 if pain is severe or worsening',
        'Do not delay seeking medical care',
        'Avoid physical exertion',
        'Take prescribed cardiac medications if available'
      ]
    };
  }
  
  return {
    title: 'Medical Review Recommended',
    message: 'Your symptoms may require professional medical evaluation before proceeding with monitoring.',
    severity: 'medium',
    urgency: 'MODERATE',
    recommendations: [
      'Contact your family doctor within 24 hours',
      'Monitor symptoms for changes',
      'Seek immediate care if symptoms worsen'
    ]
  };
};