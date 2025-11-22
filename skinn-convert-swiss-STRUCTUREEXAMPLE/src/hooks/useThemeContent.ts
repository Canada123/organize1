import { useTheme } from '@/contexts/ThemeContext';

export const useThemeContent = () => {
  const { currentTheme } = useTheme();

  const getThemeContent = () => {
    switch (currentTheme) {
      case 'medical-blue':
        return {
          heroTitle: {
            primary: 'Clinical',
            secondary: 'Precision Healthcare'
          },
          heroSubtitle: 'Medical-grade monitoring with clinical accuracy. Trusted by healthcare professionals worldwide.',
          ctaText: 'Start Clinical Assessment',
          trustMessage: 'Clinically Validated',
          personality: 'medical'
        };
      
      case 'professional-teal':
        return {
          heroTitle: {
            primary: 'Innovative',
            secondary: 'Health Solutions'
          },
          heroSubtitle: 'Modern healthcare technology that adapts to your lifestyle. Experience the future of health monitoring.',
          ctaText: 'Explore Solutions',
          trustMessage: 'Innovation Driven',
          personality: 'innovative'
        };
      
      case 'swiss-innovation':
        return {
          heroTitle: {
            primary: 'Swiss',
            secondary: 'Excellence'
          },
          heroSubtitle: 'Precision-engineered health monitoring with traditional Swiss quality. Excellence in every detail.',
          ctaText: 'Discover Excellence',
          trustMessage: 'Myant Technology',
          personality: 'premium'
        };
      
      case 'soft-blue-teal':
        return {
          heroTitle: {
            primary: 'Gentle',
            secondary: 'Wellness Care'
          },
          heroSubtitle: 'Calm, approachable health monitoring that fits naturally into your wellness journey.',
          ctaText: 'Begin Wellness Journey',
          trustMessage: 'Wellness Focused',
          personality: 'wellness'
        };
      
      default:
        return {
          heroTitle: {
            primary: 'Clinical',
            secondary: 'Precision Healthcare'
          },
          heroSubtitle: 'Medical-grade monitoring with clinical accuracy.',
          ctaText: 'Start Assessment',
          trustMessage: 'Medically Approved',
          personality: 'medical'
        };
    }
  };

  return getThemeContent();
};