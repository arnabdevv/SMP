import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Plus, Check } from "lucide-react";
import dummyData from "@/assets/dummyData.json";

const ExamManagement = () => {
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [isEnterMarksOpen, setIsEnterMarksOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [marksData, setMarksData] = useState({});

  const handleCreateExam = () => {
    // Handle exam creation
    setIsCreateExamOpen(false);
  };

  const handleSelectExamForMarks = (exam) => {
    setSelectedExam(exam);
    setIsEnterMarksOpen(true);
  };

  const handleSaveMarks = () => {
    setIsEnterMarksOpen(false);
    setSelectedExam(null);
    setMarksData({});
  };

  // Get students for selected batch
  const getStudentsForBatch = (batchId) => {
    return dummyData.students.filter((student) => student.batchId === batchId);
  };

  return (
    <div className="min-h-screen bg-background">
      <TeacherSidebar />
      <div className="pl-64">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Examination Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Create exams and manage student marks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Exams Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Exams</CardTitle>
                  <Button onClick={() => setIsCreateExamOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Exam
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyData.exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.name}</TableCell>
                        <TableCell>{exam.className}</TableCell>
                        <TableCell>
                          {format(new Date(exam.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleSelectExamForMarks(exam)}
                          >
                            Enter Marks
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Results Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyData.examResults.map((result) => {
                      const exam = dummyData.exams.find(
                        (e) => e.id === result.examId
                      );
                      const student = dummyData.students.find(
                        (s) => s.id === result.studentId
                      );
                      const percentage =
                        (result.marksObtained / exam.totalMarks) * 100;

                      return (
                        <TableRow key={`${result.examId}-${result.studentId}`}>
                          <TableCell>{exam.name}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            {result.marksObtained}/{exam.totalMarks}
                          </TableCell>
                          <TableCell>
                            {percentage >= 90
                              ? "Excellent"
                              : percentage >= 70
                              ? "Good"
                              : "Average"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Exam Dialog */}
        <Dialog open={isCreateExamOpen} onOpenChange={setIsCreateExamOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Exam</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="examName">Exam Name</Label>
                <Input id="examName" placeholder="Enter exam name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="examClass">Class</Label>
                <Select
                  id="examClass"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  {dummyData.classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalMarks">Total Marks</Label>
                <Input
                  id="totalMarks"
                  type="number"
                  placeholder="Enter total marks"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCreateExamOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateExam}>Create Exam</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Enter Marks Dialog */}
        <Dialog open={isEnterMarksOpen} onOpenChange={setIsEnterMarksOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Enter Marks - {selectedExam?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="selectBatch">Select Batch</Label>
                <Select
                  id="selectBatch"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="">Select a batch</option>
                  {selectedExam &&
                    dummyData.classes
                      .find((c) => c.id === selectedExam.classId)
                      ?.batches.map((batchId) => {
                        const batch = dummyData.batches.find(
                          (b) => b.id === batchId
                        );
                        return (
                          <option key={batch.id} value={batch.id}>
                            {batch.name}
                          </option>
                        );
                      })}
                </Select>
              </div>

              {selectedBatch && (
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Marks</TableHead>
                        <TableHead>Remarks</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getStudentsForBatch(selectedBatch).map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              max={selectedExam.totalMarks}
                              value={marksData[student.id]?.marks || ""}
                              onChange={(e) =>
                                setMarksData((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    ...prev[student.id],
                                    marks: e.target.value,
                                  },
                                }))
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={marksData[student.id]?.remarks || ""}
                              onChange={(e) =>
                                setMarksData((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    ...prev[student.id],
                                    remarks: e.target.value,
                                  },
                                }))
                              }
                              placeholder="Add remarks"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEnterMarksOpen(false);
                  setSelectedExam(null);
                  setSelectedBatch("");
                  setMarksData({});
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveMarks}>Save Marks</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ExamManagement;
