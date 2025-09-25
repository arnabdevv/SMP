import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap } from "lucide-react";
import TeacherSidebar from "@/components/TeacherSidebar";
import dummyData from "../assets/dummyData.json";
import {
  getStudentsInClass,
  getStudentsInBatch,
  calculateBatchDues,
  calculateClassDues,
  calculateTeacherStats,
} from "../lib/dataUtils";

// Get current teacher data (using first teacher for demo)
const classes = dummyData.classes;
const batches = dummyData.batches;
const students = dummyData.students;

const TeacherDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/teacher/dashboard`, {
          withCredentials: true, // if using cookies for JWT
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // if using localStorage
          },
        });
        setUserData(res.data);
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

    fetchDashboard();
    // console.log(userData);
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  console.log(userData);

  const getInitials = (name) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Remove Navbar since we have sidebar now
  const teacherStats = calculateTeacherStats(
    userData,
    classes,
    batches,
    students
  );

  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <div className="pl-64">
        <div className="p-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground">
              Teacher Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              View your profile and class information
            </p>
          </div>

          {/* Teacher Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center">
                  <User className="mr-2 text-blue-600 h-5 w-5" />
                  Teacher Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-semibold text-white">
                      {getInitials(userData.fullName)}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {userData.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {userData.subject
                      ? `${userData.subject} Teacher`
                      : "Not provided"}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      ID
                    </span>
                    <span className="text-sm text-foreground">
                      {userData.id}
                    </span>
                  </div> */}
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Subject
                    </span>
                    <span className="text-sm text-foreground">
                      {userData.subject
                        ? `${userData.subject} Teacher`
                        : "Not provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Role
                    </span>
                    <span className="text-sm text-foreground capitalize">
                      {userData.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Class and Batch Information */}
            <Card className="lg:col-span-2">
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center">
                  <GraduationCap className="mr-2 text-green-600 h-5 w-5" />
                  Class & Batch Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {classes.map((cls) => (
                    <div key={cls.id} className="space-y-4">
                      <h3 className="font-medium text-lg text-foreground">
                        {cls.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cls.batches.map((batchId) => {
                          const batch = batches.find((b) => b.id === batchId);
                          const batchStudents = getStudentsInBatch(
                            students,
                            batchId
                          );
                          const batchDues = calculateBatchDues(
                            students,
                            batchId
                          );

                          return (
                            <Card key={batchId}>
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-4">
                                  Batch {batch?.name}
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Total Students
                                    </span>
                                    <span className="text-sm font-medium">
                                      {batchStudents.length}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Total Dues
                                    </span>
                                    <span className="text-sm font-medium text-red-500">
                                      ₹{batchDues}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Summary */}
                  <Card className="mt-6">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Overall Summary</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Total Students
                          </p>
                          <p className="text-2xl font-semibold text-green-600">
                            {teacherStats.totalStudents}
                          </p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">
                            Total Dues
                          </p>
                          <p className="text-2xl font-semibold text-red-600">
                            ₹{teacherStats.totalDues}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
