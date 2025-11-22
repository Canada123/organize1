import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeTest = () => {
  const { setTheme, currentTheme } = useTheme();

  return (
    <div className="p-8 space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Landing Page 2025 Theme Test</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setTheme('medical-blue')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Medical Blue
          </button>
          <button 
            onClick={() => setTheme('landing-page-2025')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded"
          >
            Landing Page 2025
          </button>
        </div>
        <p>Current theme: {currentTheme}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">New Landing Page Colors</h3>
          <div className="space-y-2">
            <div className="p-4 bg-lp-primary-blue text-white rounded">Primary Blue (#5298F2)</div>
            <div className="p-4 bg-lp-dark-blue text-white rounded">Dark Blue (#004C96)</div>
            <div className="p-4 bg-lp-charcoal text-white rounded">Charcoal (#475259)</div>
            <div className="p-4 bg-lp-black text-white rounded">Black (#0D0D0D)</div>
            <div className="p-4 bg-lp-purple text-white rounded">Purple (#5549A6)</div>
            <div className="p-4 bg-lp-purple-light text-lp-black rounded">Light Purple (#BCA2F2)</div>
            <div className="p-4 bg-lp-cream text-lp-charcoal rounded">Cream (#EEE8E1)</div>
            <div className="p-4 bg-lp-white text-lp-charcoal rounded border">Off White (#F2F2F2)</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Gradients</h3>
          <div className="space-y-2">
            <div className="p-8 bg-gradient-lp-hero text-white rounded">Hero Gradient</div>
            <div className="p-8 bg-gradient-lp-timeline text-white rounded">Timeline Gradient</div>
            <div className="p-8 bg-gradient-lp-purple text-white rounded">Purple Gradient</div>
            <div className="p-8 bg-gradient-lp-cream text-lp-charcoal rounded">Cream Gradient</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Theme-aware Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded">Primary</div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded">Secondary</div>
          <div className="p-4 bg-accent text-accent-foreground rounded">Accent</div>
          <div className="p-4 bg-muted text-muted-foreground rounded">Muted</div>
          <div className="p-4 border border-border rounded">Border</div>
          <div className="p-4 bg-card text-card-foreground rounded border">Card</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Typography Test</h3>
        <h1 className="text-4xl font-bold text-lp-dark-blue mb-2">Headline (Dark Blue)</h1>
        <h2 className="text-2xl font-semibold text-lp-dark-blue mb-2">Subheadline</h2>
        <p className="text-lp-charcoal mb-2">Body text in charcoal color for optimal readability.</p>
        <a href="#" className="text-lp-primary-blue hover:underline">Link in primary blue</a>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Button Styles</h3>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-lp-primary-blue text-white rounded-lg hover:scale-105 transition-transform">
            Primary CTA
          </button>
          <button className="px-6 py-3 bg-gradient-lp-timeline text-white rounded-lg hover:scale-105 transition-transform">
            Gradient Button
          </button>
          <button className="px-6 py-3 border-2 border-lp-primary-blue text-lp-primary-blue rounded-lg hover:bg-lp-primary-blue hover:text-white transition-colors">
            Secondary CTA
          </button>
        </div>
      </div>
    </div>
  );
};