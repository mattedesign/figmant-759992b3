
import React from 'react';
import { Download } from 'lucide-react';

interface DownloadItem {
  title: string;
  description: string;
  gradient: string;
  size: string;
}

const DOWNLOADS: DownloadItem[] = [
  {
    title: 'Visual Design Principles',
    description: 'Professional wallpaper featuring key design principles',
    gradient: 'from-purple-400 to-blue-500',
    size: '4K'
  },
  {
    title: 'UX Laws Poster',
    description: 'Beautiful poster with all essential UX laws and principles',
    gradient: 'from-green-400 to-teal-500',
    size: 'Print'
  },
  {
    title: 'Color Psychology',
    description: 'Comprehensive color psychology reference chart',
    gradient: 'from-orange-400 to-red-500',
    size: 'HD'
  }
];

export const DashboardDownloads: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Download className="h-5 w-5" />
          Free Design Wallpapers
        </h2>
        <p className="text-gray-600 text-sm">
          Professional design resources for your workspace
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DOWNLOADS.map((download) => (
          <div key={download.title} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className={`aspect-video bg-gradient-to-br ${download.gradient} relative`}>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                {download.title}
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-3">{download.description}</p>
              <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Download className="h-3 w-3" />
                Download ({download.size})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
