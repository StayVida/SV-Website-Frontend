import { useAuth } from '@/contexts/AuthContext';
import { User, Shield, LogOut } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Not Authenticated</h1>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <User className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Username</label>
                    <p className="text-gray-900">{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Role</label>
                    <p className="text-gray-900 capitalize">{user.role}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p className="text-green-600 font-medium">Active</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-center">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center space-x-2 px-6 py-2 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
