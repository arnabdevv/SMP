import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  CalendarIcon,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const studentFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  classId: z.string().min(1, "Class is required"),
  batchId: z.string().min(1, "Batch is required"),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  parentPhone: z.string().min(1, "Parent phone is required"),
  parentName: z.string().optional(),
});

const ManageStudents = () => {
  const [adminData, setAdminData] = useState(null); // Admin user data
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterClass, setFilterClass] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setAdminData(JSON.parse(userStr));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    const fetchData = async () => {
      try {
        // Fetch classes
        const classesRes = await axios.get(`http://localhost:3000/class/all`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setClasses(classesRes.data.classes || []);

        // Fetch all students
        const studentsRes = await axios.get(
          `http://localhost:3000/student/list`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudents(studentsRes.data.students || []);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Update batches when class is selected
  useEffect(() => {
    if (selectedClass) {
      const selectedClassData = classes.find(
        (cls) => (cls._id || cls.id) === selectedClass
      );
      setBatches(selectedClassData?.batches || []);
    } else {
      setBatches([]);
    }
  }, [selectedClass, classes]);

  const form = useForm({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      classId: "",
      batchId: "",
      dateOfBirth: undefined,
      address: "",
      parentPhone: "",
      parentName: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      if (editingStudent) {
        // Check for changes
        const changes = {};
        if (
          data.name !== (editingStudent.fullName || editingStudent.user?.name)
        )
          changes.fullName = data.name;
        if (data.email !== (editingStudent.email || editingStudent.user?.email))
          changes.email = data.email;
        if (data.password) changes.password = data.password;
        if (
          data.phone !==
          (editingStudent.phoneNumber || editingStudent.user?.phone)
        )
          changes.phoneNumber = data.phone;
        if (
          data.parentPhone !==
          (editingStudent.parentPhoneNumber || editingStudent.parentPhone)
        )
          changes.parentPhoneNumber = data.parentPhone;

        const currentClassId =
          editingStudent.classRef?._id ||
          editingStudent.classRef ||
          editingStudent.classId;
        if (data.classId !== currentClassId) changes.classId = data.classId;

        const currentBatchId =
          editingStudent.batchRef?._id ||
          editingStudent.batchRef ||
          editingStudent.batchId;
        if (data.batchId !== currentBatchId) changes.batchId = data.batchId;

        if (data.address !== editingStudent.address)
          changes.address = data.address;
        if (data.parentName !== editingStudent.parentName)
          changes.parentName = data.parentName;

        // Date comparison
        const currentDate = editingStudent.dateOfBirth
          ? new Date(editingStudent.dateOfBirth).toDateString()
          : null;
        const newDate = data.dateOfBirth
          ? data.dateOfBirth.toDateString()
          : null;
        if (currentDate !== newDate) changes.dateOfBirth = data.dateOfBirth;

        if (Object.keys(changes).length === 0) {
          toast({
            title: "No changes",
            description: "No changes were made to the student.",
          });
          return;
        }

        await axios.post(
          `http://localhost:3000/student/update/${
            editingStudent._id || editingStudent.id
          }`,
          changes,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        if (!data.password || data.password.length < 6) {
          form.setError("password", {
            message: "Password must be at least 6 characters",
          });
          return;
        }

        await axios.post(
          `http://localhost:3000/student/register`,
          {
            fullName: data.name,
            email: data.email,
            password: data.password,
            phoneNumber: data.phone,
            parentPhoneNumber: data.parentPhone,
            classId: data.classId,
            batchId: data.batchId,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        toast({
          title: "Success",
          description: "Student registered successfully",
        });
      }

      // Refresh students list
      const studentsRes = await axios.get(
        `http://localhost:3000/student/list`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStudents(studentsRes.data.students || []);

      setIsCreateDialogOpen(false);
      setEditingStudent(null);
      form.reset();
      setSelectedClass("");
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.response?.data?.message || "Failed to register student",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    const classId = student.classRef?._id || student.classRef || "";
    setSelectedClass(classId);
    form.reset({
      name: student.fullName || student.user?.name || "",
      email: student.email || student.user?.email || "",
      password: "", // Don't prefill password
      phone: student.phoneNumber || student.user?.phone || "",
      classId: classId,
      batchId: student.batchRef?._id || student.batchRef || "",
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth)
        : undefined,
      address: student.address || "",
      parentPhone: student.parentPhoneNumber || student.parentPhone || "",
      parentName: student.parentName || "",
    });
  };

  const handleDelete = async (studentId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this student? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/student/${studentId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast({
        title: "Success",
        description: "Student deleted successfully",
      });

      // Refresh list
      const studentsRes = await axios.get(
        `http://localhost:3000/student/list`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStudents(studentsRes.data.students || []);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete student",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      phone: "",
      classId: "",
      batchId: "",
      dateOfBirth: undefined,
      address: "",
      parentPhone: "",
      parentName: "",
    });
    setEditingStudent(null);
    setSelectedClass("");
  };

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

  const filterBatches = filterClass
    ? classes.find((cls) => (cls._id || cls.id) === filterClass)?.batches || []
    : [];

  const filteredStudents = students.filter((student) => {
    const sClassId =
      student.class?._id ||
      student.class?.id ||
      student.classRef?._id ||
      student.classRef?.id ||
      student.classId;
    const sBatchId =
      student.batch?._id ||
      student.batch?.id ||
      student.batchRef?._id ||
      student.batchRef?.id ||
      student.batchId;

    if (filterClass && sClassId !== filterClass) return false;
    if (filterBatch && sBatchId !== filterBatch) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar adminData={adminData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link to="/admin">
            <Button
              variant="outline"
              size="sm"
              className="mr-4"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div>
              <h1 className="text-3xl font-semibold text-foreground flex items-center">
                <GraduationCap className="mr-3 text-orange-600 h-8 w-8" />
                Manage Students
              </h1>
              <p className="text-muted-foreground mt-2">
                Add, edit, and manage student accounts
              </p>
            </div>
          </div>

          <Dialog
            open={isCreateDialogOpen || !!editingStudent}
            onOpenChange={(open) => {
              if (!open) {
                setIsCreateDialogOpen(false);
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                data-testid="button-add-student"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Form fields remain the same for UI purposes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-student-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              data-testid="input-student-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              {...field}
                              data-testid="input-student-password"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-student-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign Class</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedClass(value);
                              form.setValue("batchId", "");
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-class">
                                <SelectValue placeholder="Select a class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes.map((cls) => (
                                <SelectItem
                                  key={cls._id || cls.id}
                                  value={cls._id || cls.id}
                                >
                                  {cls.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="batchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Assign Batch</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedClass}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-batch">
                                <SelectValue placeholder="Select a batch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {batches.map((batch) => (
                                <SelectItem
                                  key={batch._id || batch.id}
                                  value={batch._id || batch.id}
                                >
                                  {batch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-parent-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>
                          Date of Birth{editingStudent ? "" : " (optional)"}
                        </FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                data-testid="button-date-of-birth"
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Address{editingStudent ? "" : " (optional)"}
                        </FormLabel>
                        <FormControl>
                          <Textarea {...field} data-testid="input-address" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Parent Name{editingStudent ? "" : " (optional)"}
                          </FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-parent-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* <FormField
                      control={form.control}
                      name="parentPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Parent Phone (optional)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              data-testid="input-parent-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    /> */}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsCreateDialogOpen(false);
                        resetForm();
                      }}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" data-testid="button-save-student">
                      {editingStudent ? "Update Student" : "Add Student"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={filterClass}
                onValueChange={(val) => {
                  setFilterClass(val);
                  setFilterBatch("");
                }}
              >
                <SelectTrigger data-testid="filter-class">
                  <SelectValue placeholder="Filter by Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls) => (
                    <SelectItem
                      key={cls._id || cls.id}
                      value={cls._id || cls.id}
                    >
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterBatch}
                onValueChange={setFilterBatch}
                disabled={!filterClass}
              >
                <SelectTrigger data-testid="filter-batch">
                  <SelectValue placeholder="Filter by Batch" />
                </SelectTrigger>
                <SelectContent>
                  {filterBatches.map((batch) => (
                    <SelectItem
                      key={batch._id || batch.id}
                      value={batch._id || batch.id}
                    >
                      {batch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                data-testid="button-clear-filters"
                onClick={() => {
                  setFilterClass("");
                  setFilterBatch("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Students ({filteredStudents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No students found</p>
                <p className="text-sm">Click "Add Student" to get started</p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student, index) => (
                      <TableRow key={student._id || student.id || index}>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`w-10 h-10 ${getRandomColor(
                                index
                              )} rounded-full flex items-center justify-center text-white font-medium mr-3`}
                            >
                              {getInitials(
                                student.fullName ||
                                  student.user?.name ||
                                  "Unknown"
                              )}
                            </div>
                            <div>
                              <p
                                className="font-medium"
                                data-testid={`student-name-${index}`}
                              >
                                {student.fullName ||
                                  student.user?.name ||
                                  "Unknown"}
                              </p>
                              <p
                                className="text-sm text-muted-foreground"
                                data-testid={`student-roll-${index}`}
                              >
                                Roll: {student.rollNumber || "N/A"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell data-testid={`student-id-${index}`}>
                          {student.studentId}
                        </TableCell>
                        <TableCell data-testid={`student-class-${index}`}>
                          {student.class?.name ||
                            student.classRef?.name ||
                            "Not assigned"}
                        </TableCell>
                        <TableCell data-testid={`student-batch-${index}`}>
                          {student.batch?.name ||
                            student.batchRef?.name ||
                            "Not assigned"}
                        </TableCell>
                        <TableCell data-testid={`student-email-${index}`}>
                          {student.email || student.user?.email}
                        </TableCell>
                        <TableCell data-testid={`student-parent-${index}`}>
                          <div>
                            <p className="text-sm">
                              {student.parentName || "N/A"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {student.parentPhoneNumber ||
                                student.parentPhone ||
                                ""}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(student)}
                              data-testid={`button-edit-student-${index}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleDelete(student._id || student.id)
                              }
                              className="text-destructive hover:text-destructive"
                              data-testid={`button-delete-student-${index}`}
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageStudents;
