import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import TeacherSidebar from "@/components/TeacherSidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  BookOpen,
  GraduationCap,
} from "lucide-react";

const StudentManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState([]);
  const [error, setError] = useState("");
  const [selectedClass, setSelectedClass] = useState(undefined);
  const [selectedBatch, setSelectedBatch] = useState(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showStudents, setShowStudents] = useState(false);
  const [students, setStudents] = useState([]);
  const [addStudentForm, setAddStudentForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    parentPhoneNumber: "",
    classId: undefined,
    batchId: undefined,
  });
  const [editStudentForm, setEditStudentForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    parentPhoneNumber: "",
    newClassId: undefined,
    newBatchId: undefined,
  });

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/class/all`, {
          withCredentials: true,
        });
        setClassData(res.data.classes || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login");
          return;
        }
        if (err.response && err.response.status === 403) {
          setError(
            "Access Denied: You do not have permission to view classes."
          );
          return;
        }
        if (err.response) {
          setError(err.response.data.error || err.response.data.message);
        } else {
          setError("Network error. Check backend connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [navigate]);

  // Fetch students when class and batch are selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass || !selectedBatch) {
        setStudents([]);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:3000/student/list`, {
          params: {
            classId: selectedClass,
            batchId: selectedBatch,
          },
          withCredentials: true,
        });
        setStudents(res.data.students || []);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/login");
          return;
        }
        console.error("Error fetching students:", err);
        setStudents([]);
      }
    };

    if (showStudents && selectedClass && selectedBatch) {
      fetchStudents();
    }
  }, [showStudents, selectedClass, selectedBatch, navigate]);

  // Get available batches for selected class
  const getBatches = (clsId) => {
    if (!clsId) return [];
    return (
      classData.find((cls) => (cls._id || cls.id) === clsId)?.batches || []
    );
  };

  const availableBatches = getBatches(selectedClass);

  // Filter students based on selected class and batch (already filtered by API)
  const filteredStudents = students;

  // Calculate summary statistics with real counts
  const classStats = classData.map((cls) => {
    const totalStudents =
      cls.batches?.reduce((sum, batch) => sum + (batch.studentCount || 0), 0) ||
      0;

    const totalBatches = cls.batches?.length || 0;

    return {
      ...cls,
      studentCount: totalStudents,
      batchCount: totalBatches,
    };
  });

  const handleAddStudent = async () => {
    try {
      // Validate required fields
      const requiredFields = [
        "fullName",
        "email",
        "phoneNumber",
        "parentPhoneNumber",
        "password",
        "classId",
        "batchId",
      ];

      const missingFields = requiredFields.filter(
        (field) => !addStudentForm[field]
      );

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        return;
      }

      const response = await axios.post(
        "http://localhost:3000/student/register",
        addStudentForm,
        {
          withCredentials: true,
        }
      );

      // If successful, refresh the students list if the current class/batch matches
      if (
        selectedClass === addStudentForm.classId &&
        selectedBatch === addStudentForm.batchId
      ) {
        setStudents((prev) => [...prev, response.data]);
      }

      // Update classData to reflect the new student count immediately
      setClassData((prevData) =>
        prevData.map((cls) => {
          if (
            cls._id === addStudentForm.classId ||
            cls.id === addStudentForm.classId
          ) {
            return {
              ...cls,
              batches: cls.batches.map((batch) => {
                if (
                  batch._id === addStudentForm.batchId ||
                  batch.id === addStudentForm.batchId
                ) {
                  return {
                    ...batch,
                    studentCount: (batch.studentCount || 0) + 1,
                  };
                }
                return batch;
              }),
            };
          }
          return cls;
        })
      );

      // Reset form and close dialog
      setAddStudentForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        parentPhoneNumber: "",
        password: "",
        classId: undefined,
        batchId: undefined,
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error("Error adding student:", err.response?.data || err.message);
    }
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setEditStudentForm({
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      parentPhoneNumber: student.parentPhoneNumber,
      newClassId: student.classRef?._id || student.classRef || selectedClass,
      newBatchId: student.batchRef?._id || student.batchRef || selectedBatch,
    });
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

    try {
      // Assuming the endpoint is DELETE /student/:id
      await axios.delete(`http://localhost:3000/student/${studentId}`, {
        withCredentials: true,
      });

      // Remove student from the local list
      setStudents((prev) =>
        prev.filter((student) => (student._id || student.id) !== studentId)
      );

      // Update the student count in the summary cards
      setClassData((prevData) =>
        prevData.map((cls) => {
          if ((cls._id || cls.id) === selectedClass) {
            return {
              ...cls,
              batches: cls.batches.map((batch) => {
                if ((batch._id || batch.id) === selectedBatch) {
                  return {
                    ...batch,
                    studentCount: Math.max(0, (batch.studentCount || 0) - 1),
                  };
                }
                return batch;
              }),
            };
          }
          return cls;
        })
      );
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete student. Please try again.");
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudent) return;

    try {
      const studentId = editingStudent._id || editingStudent.id;
      const res = await axios.post(
        `http://localhost:3000/student/update/${studentId}`,
        editStudentForm,
        { withCredentials: true }
      );

      // Update the student in the local list
      setStudents((prev) =>
        prev.map((s) =>
          (s._id || s.id) === studentId
            ? { ...s, ...res.data.student } // Merge updated fields
            : s
        )
      );

      // If the batch was changed, remove the student from the current view if filtering
      if (
        selectedBatch &&
        editStudentForm.newBatchId &&
        editStudentForm.newBatchId !== selectedBatch
      ) {
        setStudents((prev) =>
          prev.filter((s) => (s._id || s.id) !== studentId)
        );
        // Ideally, we should also update classData counts here, but for simplicity
        // we might want to trigger a refetch or handle it manually.
      }

      setEditingStudent(null);
    } catch (err) {
      console.error(
        "Error updating student:",
        err.response?.data || err.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <div className="pl-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Student Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage student information and enrollment
              </p>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Student
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {classStats.map((stat) => (
              <Card key={stat._id || stat.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{stat.name}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{stat.studentCount} Students</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{stat.batchCount} Batches</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="h-fit">
                    Class {stat.name}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
          {/* Filters */}
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filter Students</h2>
            <div className="flex gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="class">Select Class</Label>
                <Select
                  value={selectedClass}
                  onValueChange={(value) => {
                    setSelectedClass(value);
                    setSelectedBatch("");
                    setShowStudents(false);
                  }}
                >
                  <SelectTrigger id="class">
                    <SelectValue placeholder="Choose a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classData.map((cls) => (
                      <SelectItem
                        key={cls._id || cls.id}
                        value={cls._id || cls.id}
                      >
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="batch">Select Batch</Label>
                <Select
                  value={selectedBatch}
                  onValueChange={(value) => {
                    setSelectedBatch(value);
                    setShowStudents(false);
                  }}
                  disabled={!selectedClass}
                >
                  <SelectTrigger id="batch">
                    <SelectValue placeholder="Choose a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableBatches.map((batch) => (
                      <SelectItem
                        key={batch._id || batch.id}
                        value={batch._id || batch.id}
                      >
                        {batch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => setShowStudents(true)}
                disabled={!selectedClass || !selectedBatch}
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Show Students
              </Button>
            </div>
          </Card>
          {showStudents && selectedClass && selectedBatch && (
            <Card className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Parent's Phone</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center text-muted-foreground">
                          <Users className="h-8 w-8 mb-2" />
                          <p>No students found in this batch</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((student) => (
                      <TableRow key={student._id || student.id}>
                        <TableCell className="font-medium">
                          {student.fullName || student.name}
                        </TableCell>
                        <TableCell>{student.email || "N/A"}</TableCell>
                        <TableCell>
                          {student.phoneNumber || student.phone || "N/A"}
                        </TableCell>
                        <TableCell>
                          {student.parentPhoneNumber ||
                            student.parentPhone ||
                            "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditStudent(student)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleDeleteStudent(student._id || student.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>

        {/* Add Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Student Name</Label>
                <Input
                  id="fullName"
                  value={addStudentForm.fullName}
                  onChange={(e) =>
                    setAddStudentForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                  placeholder="Enter student name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={addStudentForm.email}
                  onChange={(e) =>
                    setAddStudentForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter student email"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dialog-class">Class</Label>
                  <Select
                    value={addStudentForm.classId}
                    onValueChange={(value) => {
                      setAddStudentForm((prev) => ({
                        ...prev,
                        classId: value,
                        batchId: undefined,
                      }));
                    }}
                  >
                    <SelectTrigger id="dialog-class">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classData.map((cls) => (
                        <SelectItem
                          key={cls._id || cls.id}
                          value={cls._id || cls.id}
                        >
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dialog-batch">Batch</Label>
                  <Select
                    value={addStudentForm.batchId}
                    onValueChange={(value) =>
                      setAddStudentForm((prev) => ({
                        ...prev,
                        batchId: value,
                      }))
                    }
                    disabled={!addStudentForm.classId}
                  >
                    <SelectTrigger id="dialog-batch">
                      <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {getBatches(addStudentForm.classId).map((batch) => (
                        <SelectItem
                          key={batch._id || batch.id}
                          value={batch._id || batch.id}
                        >
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Student's Phone</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={addStudentForm.phoneNumber}
                  onChange={(e) =>
                    setAddStudentForm((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter student's phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhoneNumber">Parent's Phone</Label>
                <Input
                  id="parentPhoneNumber"
                  type="tel"
                  value={addStudentForm.parentPhoneNumber}
                  onChange={(e) =>
                    setAddStudentForm((prev) => ({
                      ...prev,
                      parentPhoneNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter parent's phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={addStudentForm.password}
                  onChange={(e) =>
                    setAddStudentForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter password"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => handleAddStudent({})}>Add Student</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Student Dialog */}
        <Dialog
          open={!!editingStudent}
          onOpenChange={() => setEditingStudent(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Student Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Student Name</Label>
                <Input
                  id="edit-fullName"
                  value={editStudentForm.fullName}
                  onChange={(e) =>
                    setEditStudentForm((prev) => ({
                      ...prev,
                      fullName: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editStudentForm.email}
                  onChange={(e) =>
                    setEditStudentForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-class">Class</Label>
                  <Select
                    value={editStudentForm.newClassId}
                    onValueChange={(value) => {
                      setEditStudentForm((prev) => ({
                        ...prev,
                        newClassId: value,
                        newBatchId: undefined, // Reset batch when class changes
                      }));
                    }}
                  >
                    <SelectTrigger id="edit-class">
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classData.map((cls) => (
                        <SelectItem
                          key={cls._id || cls.id}
                          value={cls._id || cls.id}
                        >
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-batch">Batch</Label>
                  <Select
                    value={editStudentForm.newBatchId}
                    onValueChange={(value) =>
                      setEditStudentForm((prev) => ({
                        ...prev,
                        newBatchId: value,
                      }))
                    }
                    disabled={!editStudentForm.newClassId}
                  >
                    <SelectTrigger id="edit-batch">
                      <SelectValue placeholder="Select a batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {getBatches(editStudentForm.newClassId).map((batch) => (
                        <SelectItem
                          key={batch._id || batch.id}
                          value={batch._id || batch.id}
                        >
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber">Student's Phone</Label>
                <Input
                  id="edit-phoneNumber"
                  value={editStudentForm.phoneNumber}
                  onChange={(e) =>
                    setEditStudentForm((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parentPhoneNumber">Parent's Phone</Label>
                <Input
                  id="edit-parentPhoneNumber"
                  value={editStudentForm.parentPhoneNumber}
                  onChange={(e) =>
                    setEditStudentForm((prev) => ({
                      ...prev,
                      parentPhoneNumber: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateStudent}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentManagement;
