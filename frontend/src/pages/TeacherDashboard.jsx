import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, GraduationCap } from "lucide-react";
import TeacherSidebar from "@/components/TeacherSidebar";
import { calculateTeacherStats } from "../lib/dataUtils";

/**
 * TeacherDashboard Component
 * Displays teacher profile, assigned classes, batches, and student statistics
 * Uses sidebar navigation for teacher-specific options
 */
const TeacherDashboard = () => {
  // State management
  const [userData, setUserData] = useState(null); // Teacher profile data from backend
  const [loading, setLoading] = useState(true); // API loading state
  const [error, setError] = useState(""); // Error message display

  /**
   * Effect Hook: Fetch teacher dashboard data on component mount
   * Retrieves teacher profile, assigned classes, batches, and fee data
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // Fetch teacher dashboard data
        const res = await axios.get(`http://localhost:3000/teacher/dashboard`, {
          withCredentials: true, // Include cookies for session
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // JWT token
          },
        });
        setUserData(res.data);
      } catch (err) {
        // Error handling
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
  }, []);

  // Show loading state while fetching data
  if (loading) return <p>Loading dashboard...</p>;

  /**
   * Helper: Extract initials from name for avatar display
   * @param {string} name - Teacher name
   * @returns {string} Uppercase initials or default "T"
   */
  const getInitials = (name) => {
    if (!name) return "T";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Calculate comprehensive statistics for this teacher
  const teacherStats = calculateTeacherStats(userData);
  const classes = userData.classes; // Classes assigned to this teacher
  const feeData = userData.feeData; // Fee collection data by class/batch

  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <div className="pl-64">
        <div className="p-8">
          {/* Page Header */}
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
                  {classes.map((cls, classIndex) => (
                    <div key={classIndex} className="space-y-4">
                      <h3 className="font-medium text-lg text-foreground">
                        {cls.className}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cls.batches.map((batch, batchIndex) => {
                          const batchStudents = batch.studentCount || 0;

                          // Get the dues data for this class and batch
                          const batchFeeData =
                            feeData?.[cls.className]?.[batch.batchName];

                          const batchUnpaidMonths =
                            batchFeeData?.unpaidMonths || 0;
                          const batchDues = batchFeeData?.totalDue || 0;

                          return (
                            <Card key={batchIndex}>
                              <CardContent className="p-4">
                                <h4 className="font-medium mb-4">
                                  Batch {batch.batchName}
                                </h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Total Students
                                    </span>
                                    <span className="text-sm font-medium">
                                      {batchStudents}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Unpaid Months
                                    </span>
                                    <span className="text-sm font-medium text-orange-500">
                                      {batchUnpaidMonths}
                                    </span>
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">
                                      Total Dues
                                    </span>
                                    <span className="text-sm font-medium text-red-500">
                                      ₹{batchDues.toLocaleString("en-IN")}
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
