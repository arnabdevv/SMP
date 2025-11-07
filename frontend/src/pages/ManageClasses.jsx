import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "wouter";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Edit, Trash2, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const classFormSchema = z.object({
  name: z.string().min(2, "Class name must be at least 2 characters"),
  teacherId: z.string().optional(),
  description: z.string().optional(),
});

const ManageClasses = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
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

        // Fetch teachers
        try {
          const teachersRes = await axios.get(
            `http://localhost:3000/teacher/getAllTeachers`,
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setTeachers(teachersRes.data.teachers || []);
        } catch (err) {
          console.error("Error fetching teachers:", err);
        }
      } catch (err) {
        console.error("Error fetching classes:", err);
        toast({
          title: "Error",
          description: "Failed to load classes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/class/create`,
        { className: data.name },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast({
        title: "Success",
        description: "Class created successfully",
      });

      // Refresh classes list
      const classesRes = await axios.get(`http://localhost:3000/class/all`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setClasses(classesRes.data.classes || []);

      setIsCreateDialogOpen(false);
      setEditingClass(null);
      form.reset();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create class",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    form.reset({
      name: cls.name || "",
      teacherId: cls.teacher?.id || "",
      description: cls.description || "",
    });
  };

  const handleDelete = (classId) => {
    // Delete functionality would need to be implemented in backend
    toast({
      title: "Not Available",
      description: "Delete functionality not yet implemented",
      variant: "destructive",
    });
  };

  const resetForm = () => {
    form.reset({
      name: "",
      teacherId: "",
      description: "",
    });
    setEditingClass(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/admin">
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
            <div>
              <h1 className="text-3xl font-semibold text-foreground flex items-center">
                <BookOpen className="mr-3 text-green-600 h-8 w-8" />
                Manage Classes
              </h1>
              <p className="text-muted-foreground mt-2">
                Add, edit, and manage class schedules
              </p>
            </div>
          </div>

          <Dialog
            open={isCreateDialogOpen || !!editingClass}
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
                data-testid="button-add-class"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingClass ? "Edit Class" : "Add New Class"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Grade 10-A"
                            data-testid="input-class-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="teacherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assign Teacher (optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-teacher">
                              <SelectValue placeholder="Select a teacher" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">
                              No teacher assigned
                            </SelectItem>
                            {teachers?.map((teacher) => (
                              <SelectItem
                                key={teacher._id || teacher.id}
                                value={teacher._id || teacher.id}
                              >
                                {teacher.user?.name || teacher.fullName} -{" "}
                                {teacher.subject || "N/A"}
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Class description, schedule, or notes"
                            data-testid="input-class-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                    <Button type="submit" data-testid="button-save-class">
                      {editingClass ? "Update Class" : "Add Class"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Classes Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Classes ({classes?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {classes?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No classes found</p>
                <p className="text-sm">Click "Add Class" to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead>Assigned Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classes?.map((cls, index) => (
                    <TableRow key={cls._id || cls.id}>
                      <TableCell>
                        <div
                          className="font-medium"
                          data-testid={`class-name-${index}`}
                        >
                          {cls.name}
                        </div>
                      </TableCell>
                      <TableCell data-testid={`class-teacher-${index}`}>
                        {cls.teacher?.user?.name || "Unassigned"}
                      </TableCell>
                      <TableCell data-testid={`class-subject-${index}`}>
                        {cls.teacher?.subject || "N/A"}
                      </TableCell>
                      <TableCell data-testid={`class-description-${index}`}>
                        <div className="max-w-xs truncate">
                          {cls.description || "No description"}
                        </div>
                      </TableCell>
                      <TableCell data-testid={`class-created-${index}`}>
                        {cls.createdAt
                          ? new Date(cls.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(cls)}
                            data-testid={`button-edit-class-${index}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(cls._id || cls.id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-class-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageClasses;
