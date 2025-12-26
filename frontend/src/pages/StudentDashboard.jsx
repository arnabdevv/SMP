import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, BookOpen, Layers } from "lucide-react";
import { calculateStudentFeesStats } from "../lib/dataUtils";

/**
 * StudentDashboard Component
 * Displays student profile, performance metrics, and fees information
 * Fetches data from backend on component mount
 */
const StudentDashboard = () => {
  // State variables
  const [userData, setUserData] = useState(null); // Student profile and data from backend
  const [loading, setLoading] = useState(true); // API loading state
  const [error, setError] = useState(""); // Error message from API call

  /**
   * Effect Hook: Fetch student dashboard data on component mount
   * Calls /student/dashboard endpoint to get student profile, classes, batches, and fees
   */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // API call to fetch student dashboard data
        const res = await axios.get(`http://localhost:3000/student/dashboard`, {
          withCredentials: true, // Include cookies for session
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT token
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

  if (loading) return <p>Loading dashboard...</p>;

  /**
   * Helper: Extract initials from name for avatar
   * @param {string} name - Student name
   * @returns {string} Uppercase initials
   */
  const getInitials = (name) => {
    if (!name) return "ST";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const feesStats = calculateStudentFeesStats(userData.fees.monthlyFees);
  const monthlyFee = 300;
  const mockTests = userData.mockTests || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userData={userData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Student Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            View your profile, performance, and fees information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Profile */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center">
                  <User className="mr-2 text-blue-600 h-5 w-5" />
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span
                      className="text-2xl font-semibold text-white"
                      data-testid="student-initials"
                    >
                      {getInitials(userData.fullName)}
                    </span>
                  </div>
                  <h3
                    className="text-lg font-semibold text-foreground"
                    data-testid="student-name"
                  >
                    {userData.fullName}
                  </h3>
                  <p
                    className="text-sm text-muted-foreground"
                    data-testid="student-id"
                  >
                    Student ID: {userData.id}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Class
                    </span>
                    <span
                      className="text-sm text-foreground"
                      data-testid="student-class"
                    >
                      {userData.classRef.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Batch
                    </span>
                    <span
                      className="text-sm text-foreground"
                      data-testid="student-batch"
                    >
                      {userData.batchRef.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Session
                    </span>
                    <span
                      className="text-sm text-foreground"
                      data-testid="student-session"
                    >
                      {userData.session
                        ? `${userData.session}`
                        : "Not Provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Email
                    </span>
                    <span
                      className="text-sm text-foreground"
                      data-testid="student-email"
                    >
                      {userData.email || "Not Provided"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Personal Phone
                    </span>
                    <span
                      className="text-sm text-foreground"
                      data-testid="student-phone"
                    >
                      {userData.phoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">
                      Parent Phone
                    </span>
                    <span
                      className="text-sm text-foreground"
                      data-testid="student-phone"
                    >
                      {userData.parentPhoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </span>
                    <span
                      className="text-sm text-foreground"
                      data-testid="student-dob"
                    >
                      {userData.dateOfBirth
                        ? new Date(userData.dateOfBirth).toLocaleDateString()
                        : "Not provided"}
                    </span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  data-testid="button-edit-profile"
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Mock Tests and Fees Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mock Tests */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center">
                  <BookOpen className="mr-2 text-green-600 h-5 w-5" />
                  Mock Test Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {mockTests.length > 0 ? (
                  <div className="space-y-4">
                    {mockTests.map((test) => (
                      <div key={test.id} className="p-4 bg-muted/50 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-foreground">
                            {test.name}
                          </h3>
                          <Badge
                            variant={
                              test.marks >= 90
                                ? "success"
                                : test.marks >= 80
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {((test.marks / test.totalMarks) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Date: {new Date(test.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Marks: {test.marks} out of {test.totalMarks}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No mock test results available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Fees Information */}
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle className="flex items-center">
                  <Layers className="mr-2 text-purple-600 h-5 w-5" />
                  Fees Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-md">
                    <h3 className="font-medium text-foreground mb-4">
                      Monthly Fees Status
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(userData.fees.monthlyFees).map(
                          ([month, status]) => (
                            <div
                              key={month}
                              className="flex items-center justify-between p-2 border rounded-md"
                            >
                              <span className="text-sm">{month}</span>
                              <Badge
                                variant={
                                  status === "paid" ? "success" : "destructive"
                                }
                                className="capitalize"
                              >
                                {status}
                              </Badge>
                            </div>
                          )
                        )}
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Monthly Fees Amount
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              ₹{monthlyFee}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Pending Months
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {feesStats.dueMonths.length} months
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              Total Due Amount
                            </span>
                            <span className="text-sm font-medium text-red-500">
                              ₹{feesStats.totalDue}
                            </span>
                          </div>
                        </div>
                      </div>

                      {feesStats.dueMonths.length > 0 && (
                        <div className="mt-4">
                          <Button className="w-full" variant="destructive">
                            Pay Due Fees
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
