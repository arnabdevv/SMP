import { Link } from 'wouter';
import Navbar from '../components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Layers, GraduationCap, Plus, Edit, Trash2, ArrowRight } from 'lucide-react';

// Static Data
const stats = {
  totalTeachers: 5,
  totalClasses: 3,
  totalBatches: 2,
  totalStudents: 2,
};

const teachers = [
  { id: 't1', user: { name: 'Dr. Evelyn Reed' }, subject: 'Physics' },
  { id: 't2', user: { name: 'Mr. Samuel Carter' }, subject: 'Mathematics' },
];

const classes = [
  { id: 'c1', name: 'Class 10A', teacher: { user: { name: 'Dr. Evelyn Reed' } } },
  { id: 'c2', name: 'Class 10B', teacher: { user: { name: 'Mr. Samuel Carter' } } },
];

const batches = [
  { id: 'b1', name: '2024-2025', academicYear: '2024' },
  { id: 'b2', name: '2023-2024', academicYear: '2023' },
];

const students = [
  { id: 's1', user: { name: 'Alice Johnson' }, studentId: 'STU2024001', class: { name: 'Class 10A' } },
  { id: 's2', user: { name: 'Bob Williams' }, studentId: 'STU2024002', class: { name: 'Class 10B' } },
];

const AdminDashboard = () => {
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRandomColor = (index) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-orange-600', 'bg-indigo-600'];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your school's teachers, classes, batches, and students</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Teachers</p>
                  <p className="text-3xl font-semibold text-foreground" data-testid="stat-teachers">
                    {stats?.totalTeachers || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Classes</p>
                  <p className="text-3xl font-semibold text-foreground" data-testid="stat-classes">
                    {stats?.totalClasses || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="text-green-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Batches</p>
                  <p className="text-3xl font-semibold text-foreground" data-testid="stat-batches">
                    {stats?.totalBatches || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Layers className="text-purple-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-semibold text-foreground" data-testid="stat-students">
                    {stats?.totalStudents || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-orange-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manage Teachers */}
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="mr-2 text-blue-600 h-5 w-5" />
                  Manage Teachers
                </CardTitle>
                <Link href="/admin/teachers">
                  <Button size="sm" data-testid="button-add-teacher">
                    <Plus className="mr-1 h-4 w-4" /> Add Teacher
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {teachers?.slice(0, 2).map((teacher, index) => (
                  <div key={teacher.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${getRandomColor(index)} rounded-full flex items-center justify-center text-white font-medium`}>
                        {getInitials(teacher.user?.name || 'Unknown')}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-foreground" data-testid={`teacher-name-${index}`}>
                          {teacher.user?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`teacher-subject-${index}`}>
                          {teacher.subject}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-teacher-${index}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-delete-teacher-${index}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/teachers">
                <Button variant="link" className="w-full mt-4 p-0" data-testid="link-view-all-teachers">
                  View All Teachers <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Manage Classes */}
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 text-green-600 h-5 w-5" />
                  Manage Classes
                </CardTitle>
                <Link href="/admin/classes">
                  <Button size="sm" data-testid="button-add-class">
                    <Plus className="mr-1 h-4 w-4" /> Add Class
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {classes?.slice(0, 2).map((cls, index) => (
                  <div key={cls.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium text-foreground" data-testid={`class-name-${index}`}>
                        {cls.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`class-teacher-${index}`}>
                        Teacher: {cls.teacher?.user?.name || 'Unassigned'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-class-${index}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-delete-class-${index}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/classes">
                <Button variant="link" className="w-full mt-4 p-0" data-testid="link-view-all-classes">
                  View All Classes <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Manage Batches */}
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Layers className="mr-2 text-purple-600 h-5 w-5" />
                  Manage Batches
                </CardTitle>
                <Link href="/admin/batches">
                  <Button size="sm" data-testid="button-add-batch">
                    <Plus className="mr-1 h-4 w-4" /> Add Batch
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {batches?.slice(0, 2).map((batch, index) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium text-foreground" data-testid={`batch-name-${index}`}>
                        {batch.name}
                      </p>
                      <p className="text-sm text-muted-foreground" data-testid={`batch-year-${index}`}>
                        Academic Year: {batch.academicYear}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-batch-${index}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-delete-batch-${index}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/batches">
                <Button variant="link" className="w-full mt-4 p-0" data-testid="link-view-all-batches">
                  View All Batches <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Manage Students */}
          <Card>
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 text-orange-600 h-5 w-5" />
                  Manage Students
                </CardTitle>
                <Link href="/admin/students">
                  <Button size="sm" data-testid="button-add-student">
                    <Plus className="mr-1 h-4 w-4" /> Add Student
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {students?.slice(0, 2).map((student, index) => (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${getRandomColor(index + 2)} rounded-full flex items-center justify-center text-white font-medium`}>
                        {getInitials(student.user?.name || 'Unknown')}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-foreground" data-testid={`student-name-${index}`}>
                          {student.user?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground" data-testid={`student-class-${index}`}>
                          {student.class?.name || 'No class assigned'}
                        </p>
                        <p className="text-xs text-muted-foreground" data-testid={`student-id-${index}`}>
                          ID: {student.studentId}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" data-testid={`button-edit-student-${index}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-delete-student-${index}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/students">
                <Button variant="link" className="w-full mt-4 p-0" data-testid="link-view-all-students">
                  View All Students <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;