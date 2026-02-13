import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "wouter";
import Navbar from "../components/Navbar";
import LoadingDashboard from "../components/LoadingDashboard.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  BookOpen,
  Layers,
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";

/**
 * AdminDashboard Component
 * Main admin control panel showing statistics and management options
 * Displays counts and lists of teachers, classes, batches, and students
 */

// Axios config with authentication headers for all API calls
const axiosConfig = {
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

const AdminDashboard = () => {
  // State management
  const [adminData, setAdminData] = useState(null); // Admin user data
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(""); // Error messages
  const [stats, setStats] = useState({
    totalTeachers: 0, // Count of all teachers
    totalClasses: 0, // Count of all classes
    totalBatches: 0, // Count of all batches
    totalStudents: 0, // Count of all students
  });
  const [teachers, setTeachers] = useState([]); // List of teachers for preview
  const [classes, setClasses] = useState([]); // List of classes
  const [batches, setBatches] = useState([]); // List of batches
  const [students, setStudents] = useState([]); // List of students

  /**
   * Effect Hook: Fetch all dashboard data on component mount
   * Makes 4 API calls: admin dashboard, teachers, classes/batches, students
   * Updates statistics and lists from responses
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch admin dashboard overview data
        const dashboardRes = await axios.get(
          `http://localhost:3000/admin/dashboard`,
          axiosConfig
        );
        setAdminData(dashboardRes.data);

        // Fetch teachers
        try {
          const teachersRes = await axios.get(
            `http://localhost:3000/teacher/getAllTeachers`,
            axiosConfig
          );
          const teachersData = teachersRes.data.teachers || [];
          setTeachers(teachersData);
          setStats((prev) => ({ ...prev, totalTeachers: teachersData.length }));
        } catch (err) {
          console.error("Error fetching teachers:", err);
        }

        // Fetch classes
        try {
          const classesRes = await axios.get(
            `http://localhost:3000/class/all`,
            axiosConfig
          );
          const classesData = classesRes.data.classes || [];
          setClasses(classesData);
          setStats((prev) => ({ ...prev, totalClasses: classesData.length }));

          // Extract batches from classes
          const allBatches = [];
          let totalBatches = 0;
          classesData.forEach((cls) => {
            if (cls.batches && Array.isArray(cls.batches)) {
              allBatches.push(...cls.batches);
              totalBatches += cls.batches.length;
            }
          });
          setBatches(allBatches);
          setStats((prev) => ({ ...prev, totalBatches }));
        } catch (err) {
          console.error("Error fetching classes:", err);
        }

        // Fetch students (using student list endpoint)
        try {
          const studentsRes = await axios.get(
            `http://localhost:3000/student/list`,
            axiosConfig
          );
          const studentsData = studentsRes.data.students || [];
          setStudents(studentsData);
          setStats((prev) => ({ ...prev, totalStudents: studentsData.length }));
        } catch (err) {
          console.error("Error fetching students:", err);
        }
      } catch (err) {
        if (err.response) {
          setError(err.response.data.error || err.response.data.message);
        } else {
          setError("Network error. Check backend connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingDashboard variant="admin" />;

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRandomColor = (index) => {
    const colors = [
      "bg-blue-600",
      "bg-green-600",
      "bg-purple-600",
      "bg-orange-600",
      "bg-indigo-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar adminData={adminData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your school's teachers, classes, batches, and students
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Teachers
                  </p>
                  <p
                    className="text-3xl font-semibold text-foreground"
                    data-testid="stat-teachers"
                  >
                    {stats.totalTeachers}
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Classes
                  </p>
                  <p
                    className="text-3xl font-semibold text-foreground"
                    data-testid="stat-classes"
                  >
                    {stats.totalClasses}
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Batches
                  </p>
                  <p
                    className="text-3xl font-semibold text-foreground"
                    data-testid="stat-batches"
                  >
                    {stats.totalBatches}
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
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Students
                  </p>
                  <p
                    className="text-3xl font-semibold text-foreground"
                    data-testid="stat-students"
                  >
                    {stats.totalStudents}
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
                  <div
                    key={teacher._id || teacher.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${getRandomColor(
                          index
                        )} rounded-full flex items-center justify-center text-white font-medium`}
                      >
                        {getInitials(
                          teacher.user?.name || teacher.fullName || "Unknown"
                        )}
                      </div>
                      <div className="ml-3">
                        <p
                          className="font-medium text-foreground"
                          data-testid={`teacher-name-${index}`}
                        >
                          {teacher.user?.name || teacher.fullName || "Unknown"}
                        </p>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid={`teacher-subject-${index}`}
                        >
                          {teacher.subject || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-edit-teacher-${index}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-delete-teacher-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/teachers">
                <Button
                  variant="link"
                  className="w-full mt-4 p-0"
                  data-testid="link-view-all-teachers"
                >
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
                  <div
                    key={cls._id || cls.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-md"
                  >
                    <div>
                      <p
                        className="font-medium text-foreground"
                        data-testid={`class-name-${index}`}
                      >
                        {cls.name}
                      </p>
                      <p
                        className="text-sm text-muted-foreground"
                        data-testid={`class-teacher-${index}`}
                      >
                        Batches: {cls.batches?.length || 0}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-edit-class-${index}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-delete-class-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/classes">
                <Button
                  variant="link"
                  className="w-full mt-4 p-0"
                  data-testid="link-view-all-classes"
                >
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
                  <div
                    key={batch._id || batch.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-md"
                  >
                    <div>
                      <p
                        className="font-medium text-foreground"
                        data-testid={`batch-name-${index}`}
                      >
                        {batch.name}
                      </p>
                      <p
                        className="text-sm text-muted-foreground"
                        data-testid={`batch-year-${index}`}
                      >
                        ID: {batch._id || batch.id}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-edit-batch-${index}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-delete-batch-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/batches">
                <Button
                  variant="link"
                  className="w-full mt-4 p-0"
                  data-testid="link-view-all-batches"
                >
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
                  <div
                    key={student._id || student.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-md"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 ${getRandomColor(
                          index + 2
                        )} rounded-full flex items-center justify-center text-white font-medium`}
                      >
                        {getInitials(
                          student.fullName || student.user?.name || "Unknown"
                        )}
                      </div>
                      <div className="ml-3">
                        <p
                          className="font-medium text-foreground"
                          data-testid={`student-name-${index}`}
                        >
                          {student.fullName || student.user?.name || "Unknown"}
                        </p>
                        <p
                          className="text-sm text-muted-foreground"
                          data-testid={`student-class-${index}`}
                        >
                          Class: {student.classRef?.name || "No class assigned"}
                        </p>
                        <p
                          className="text-xs text-muted-foreground"
                          data-testid={`student-id-${index}`}
                        >
                          Email: {student.email || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-edit-student-${index}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-delete-student-${index}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/admin/students">
                <Button
                  variant="link"
                  className="w-full mt-4 p-0"
                  data-testid="link-view-all-students"
                >
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
