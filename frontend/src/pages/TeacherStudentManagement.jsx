import React, { useState } from "react";
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
import { Select } from "@/components/ui/select";
import dummyData from "@/assets/dummyData.json";
import { Plus, Edit2, Trash2 } from "lucide-react";

const StudentManagement = () => {
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  // Filter students based on selected class and batch
  const filteredStudents = dummyData.students.filter((student) => {
    if (selectedClass !== "all" && student.classId !== selectedClass)
      return false;
    if (selectedBatch !== "all" && student.batchId !== selectedBatch)
      return false;
    return true;
  });

  const handleAddStudent = (formData) => {
    // Handle adding new student - in real app this would be an API call
    console.log("Adding student:", formData);
    setIsAddDialogOpen(false);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
  };

  const handleDeleteStudent = (studentId) => {
    // Handle deleting student - in real app this would be an API call
    console.log("Deleting student:", studentId);
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

          <div className="flex gap-4 mb-6">
            <div className="w-48">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <option value="all">All Classes</option>
                {dummyData.classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="w-48">
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <option value="all">All Batches</option>
                {dummyData.batches.map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Parent's Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>{student.batchName}</TableCell>
                    <TableCell>{student.personalPhone}</TableCell>
                    <TableCell>{student.parentPhone}</TableCell>
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
                          onClick={() => handleDeleteStudent(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Add Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name</Label>
                <Input id="name" placeholder="Enter student name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <Select id="class">
                    {dummyData.classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch</Label>
                  <Select id="batch">
                    {dummyData.batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Student's Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter student's phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Parent's Phone</Label>
                <Input
                  id="parentPhone"
                  type="tel"
                  placeholder="Enter parent's phone number"
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
            {/* Similar form fields as Add Student Dialog but pre-filled */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingStudent(null)}>
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentManagement;
