
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle } from 'lucide-react';
import { ClaudePromptManager } from '@/components/owner/claude/ClaudePromptManager';
import { UserManagement } from '@/components/owner/UserManagement';

interface AdminPageProps {
  initialTab?: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({ initialTab }) => {
  const { isOwner, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('prompts');

  // Set initial tab based on the active section
  useEffect(() => {
    if (initialTab === 'users') {
      setActiveTab('users');
    } else {
      setActiveTab('prompts');
    }
  }, [initialTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access the admin panel. Owner access required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-[#E9EFF6]">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-1">Manage prompt templates, users, and system settings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="prompts">Prompt Templates</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
            </TabsList>

            <TabsContent value="prompts" className="space-y-6">
              <ClaudePromptManager />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
