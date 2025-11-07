'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  Save, 
  Bell, 
  Shield, 
  Database,
  Mail,
  Lock
} from 'lucide-react';

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your application settings and preferences</p>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2 text-purple-600" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" defaultValue="Quiz App" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="app-url">Application URL</Label>
                <Input id="app-url" defaultValue="https://quiz-app.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" defaultValue="A fun and interactive quiz platform for students" />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-blue-600" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Send email notifications for quiz completions</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Quiz Reminders</h4>
                <p className="text-sm text-gray-600">Send reminders for incomplete quizzes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">New User Notifications</h4>
                <p className="text-sm text-gray-600">Notify when new users register</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-attempts">Max Login Attempts</Label>
                <Input id="max-attempts" type="number" defaultValue="5" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Require Email Verification</h4>
                <p className="text-sm text-gray-600">Users must verify their email before accessing quizzes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Enable 2FA for admin accounts</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Database Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2 text-yellow-600" />
              Database Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-days">Data Retention (days)</Label>
                <Input id="retention-days" type="number" defaultValue="365" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Auto Backup</h4>
                <p className="text-sm text-gray-600">Automatically backup database</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-red-600" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" type="number" defaultValue="587" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email-username">Email Username</Label>
                <Input id="email-username" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-password">Email Password</Label>
                <Input id="email-password" type="password" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Lock className="h-5 w-5 mr-2" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">Reset All Data</h4>
              <p className="text-sm text-red-600 mb-4">
                This will permanently delete all quizzes, users, and attempts. This action cannot be undone.
              </p>
              <Button variant="destructive" size="sm">
                Reset All Data
              </Button>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Export Data</h4>
              <p className="text-sm text-yellow-600 mb-4">
                Download all data as a backup before making any changes.
              </p>
              <Button variant="outline" size="sm" className="text-yellow-700 border-yellow-300">
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
