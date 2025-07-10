import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LogOut, Globe, User } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">
              {t('common.dashboard')}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={handleLanguageToggle}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;