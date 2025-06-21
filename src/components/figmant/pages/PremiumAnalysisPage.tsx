
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export const PremiumAnalysisPage: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className="h-full flex flex-col min-h-0 overflow-hidden">
      <div className={`${isMobile ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-3'} bg-transparent flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>
              Premium Analysis
            </h1>
            <p className={`text-gray-600 mt-1 ${isMobile ? 'text-sm' : ''}`}>
              Advanced AI-powered insights with competitive intelligence
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        {/* Premium Analysis Content */}
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className="text-center max-w-md w-full">
            {/* Premium Icon */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Premium Analysis</h2>
              <p className="text-gray-600 mb-6">
                Get advanced competitive intelligence and strategic insights with our premium analysis features.
              </p>
            </div>

            {/* Premium Features */}
            <div className="space-y-4 mb-6">
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <h3 className="font-medium text-purple-800 mb-2">Competitive Intelligence</h3>
                <p className="text-sm text-purple-600">Deep analysis of competitor strategies and market positioning</p>
              </div>
              
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h3 className="font-medium text-blue-800 mb-2">Advanced Insights</h3>
                <p className="text-sm text-blue-600">AI-powered recommendations with business impact analysis</p>
              </div>
              
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h3 className="font-medium text-green-800 mb-2">Strategic Reports</h3>
                <p className="text-sm text-green-600">Comprehensive reports with actionable business strategies</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                Start Premium Analysis
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                View Premium Templates
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
