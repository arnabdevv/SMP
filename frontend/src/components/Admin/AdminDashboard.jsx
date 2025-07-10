import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import StatsCard from '../Common/StatsCard';
import { Users, GraduationCap, BookOpen, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { students, teachers, classes, fees, exams } = useData();

  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalClasses = classes.length;
  const pendingFees = fees.filter(fee => fee.status === 'pending' || fee.status === 'overdue').length;
  const upcomingExams = exams.filter(exam => new Date(exam.date) > new Date()).length;
  const totalRevenue = fees.filter(fee => fee.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);

  const stats = [
    {
      title: t('admin.totalStudents'),
      value: totalStudents,
      icon: Users,
      color: 'blue',
      change: '+12%'
    },
    {
      title: t('admin.totalTeachers'),
      value: totalTeachers,
      icon: GraduationCap,
      color: 'green',
      change: '+5%'
    },
    {
      title: t('admin.totalClasses'),
      value: totalClasses,
      icon: BookOpen,
      color: 'purple',
      change: '+2%'
    },
    {
      title: t('admin.pendingFees'),
      value: pendingFees,
      icon: DollarSign,
      color: 'yellow',
      change: '-8%'
    },
    {
      title: t('admin.upcomingExams'),
      value: upcomingExams,
      icon: Calendar,
      color: 'teal',
      change: '+3%'
    },
    {
      title: 'Total Revenue',
      value: `৳${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'green',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome')}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType="increase"
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('dashboard.recentActivity')}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New student registered in Class 10</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Teacher marked attendance for Batch A</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">New exam scheduled for next week</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Fee payment received from student</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('dashboard.quickActions')}
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <span className="text-sm font-medium text-blue-900">{t('admin.createClass')}</span>
              <p className="text-xs text-blue-700 mt-1">Add a new class to the system</p>
            </button>
            <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <span className="text-sm font-medium text-green-900">{t('admin.registerStudent')}</span>
              <p className="text-xs text-green-700 mt-1">Register a new student</p>
            </button>
            <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <span className="text-sm font-medium text-purple-900">{t('admin.registerTeacher')}</span>
              <p className="text-xs text-purple-700 mt-1">Add a new teacher to the system</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;