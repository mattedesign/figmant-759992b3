
import React from 'react';
import { Search } from 'lucide-react';

export const SidebarSearchBar: React.FC = () => {
  return (
    <div className="px-4 mt-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <kbd className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs text-gray-500 bg-white border border-gray-200 rounded">
          ⌘K
        </kbd>
      </div>
    </div>
  );
};
