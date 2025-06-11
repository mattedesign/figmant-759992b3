
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useAdminSettings } from '@/hooks/useAdminSettings';
import { AdminSettingsLoading } from './AdminSettingsLoading';
import { AdminSettingsForm } from './AdminSettingsForm';

export const AdminSettings = () => {
  const {
    settings,
    isLoading,
    isEditing,
    setIsEditing,
    formData,
    setFormData,
    handleSave,
    resetFormData,
    isPending
  } = useAdminSettings();

  if (isLoading) {
    return <AdminSettingsLoading />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Configuration</span>
          </CardTitle>
          <CardDescription>
            Manage global system settings and configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AdminSettingsForm
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
            resetFormData={resetFormData}
            isPending={isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};
