import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import StatsCard from '../Common/StatsCard';
import { Calendar, FileText, DollarSign, TrendingUp } from 'lucide-react';

const StudentDashboard = () => {
  const { t } = useLanguage();
  const { exams, marks, fees } = useData();
  const { user } = useAuth();

  // Get student's data
  const studentExams = exams.filter(exam => 
    exam.classId === user?.classId && exam.batchId === user?.batchId
  );
  const studentMarks = marks.filter(mark => mark.studentId === user?.id);
  const studentFees = fees.filter(fee => fee.studentId === user?.id);

  const upcomingExams = studentExams.filter(exam => new Date(exam.date) > new Date());
  const recentMarks = studentMarks.slice(-3);
  const pendingFees = studentFees.filter(fee => fee.status === 'pending' || fee.status === 'overdue');
  const averageMarks = studentMarks.length > 0 
    ? Math.round(studentMarks.reduce((sum, mark) => sum + (mark.marksObtained / mark.totalMarks * 100), 0) / studentMarks.length)
    : 0;

  const stats = [
    {
      title: t('student.upcomingExams'),
      value: upcomingExams.length,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: t('student.recentMarks'),
      value: recentMarks.length,
      icon: FileText,
      color: 'green'
    },
    {
      title: t('student.feeStatus'),
      value: pendingFees.length,
      icon: DollarSign,
      color: pendingFees.length > 0 ? 'red' : 'green'
    },
    {
      title: 'Average Score',
      value: `${averageMarks}%`,
      icon: TrendingUp,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('dashboard.welcome')}, {user?.name}
        </h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Class Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('student.classInfo')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">{t('common.class')}</p>
            <p className="text-lg font-medium text-gray-900">{user?.className}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('common.batch')}</p>
            <p className="text-lg font-medium text-gray-900">{user?.batchName}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('student.upcomingExams')}
          </h3>
          <div className="space-y-3">
            {upcomingExams.length > 0 ? (
              upcomingExams.slice(0, 3).map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{exam.title}</p>
                    <p className="text-sm text-gray-600">{exam.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{exam.date}</p>
                    <p className="text-xs text-gray-500">{exam.totalMarks} marks</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">{t('message.noExamsFound')}</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('student.recentMarks')}
          </h3>
          <div className="space-y-3">
            {recentMarks.length > 0 ? (
              recentMarks.map((mark) => (
                <div key={mark.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{mark.examTitle}</p>
                    <p className="text-sm text-gray-600">Grade: {mark.grade}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{mark.marksObtained}/{mark.totalMarks}</p>
                    <p className="text-sm text-gray-500">
                      {Math.round((mark.marksObtained / mark.totalMarks) * 100)}%
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">{t('message.noMarksFound')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;