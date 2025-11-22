import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: string[];
  severity: 'high' | 'medium';
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  severity
}) => {
  const numberBgColor = severity === 'high' ? 'bg-red-600' : 'bg-amber-600';
  
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-amber-600" />
        Immediate Recommendations
      </h3>
      <ul className="space-y-2">
        {recommendations.map((recommendation, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 ${numberBgColor} text-white`}>
              {index + 1}
            </div>
            <p className="text-gray-700 leading-relaxed">{recommendation}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};