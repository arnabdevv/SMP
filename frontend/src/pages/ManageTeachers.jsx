import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Edit, Trash2, Users } from "lucide-react";

const teacherFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  qualification: z.string().optional(),
  experience: z.coerce
    .number()
    .min(0, "Experience must be 0 or greater")
    .optional(),
});

// Static Data
const teachers = [
  {
    id: "t1",
    user: {
      name: "Dr. Evelyn Reed",
      email: "evelyn.reed@example.com",
      phone: "555-0103",
    },
    subject: "Physics",
    qualification: "Ph.D. in Physics",
    experience: 10,
  },
  {
    id: "t2",
    user: {
      name: "Mr. Samuel Carter",
      email: "samuel.carter@example.com",
      phone: "555-0104",
    },
    subject: "Mathematics",
    qualification: "M.Sc. in Mathematics",
    experience: 8,
  },
  {
    id: "t3",
    user: {
      name: "Ms. Olivia Chen",
      email: "olivia.chen@example.com",
      phone: "555-0105",
    },
    subject: "Chemistry",
    qualification: "M.Sc. in Chemistry",
    experience: 5,
  },
];

const ManageTeachers = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const form = useForm({
    resolver: zodResolver(teacherFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      subject: "",
      qualification: "",
      experience: 0,
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted (static):", data);
    setIsCreateDialogOpen(false);
    setEditingTeacher(null);
    alert("Action not available in static mode.");
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    form.reset({
      name: teacher.user?.name || "",
      email: teacher.user?.email || "",
      password: "", // Don't prefill password
      phone: teacher.user?.phone || "",
      subject: teacher.subject || "",
      qualification: teacher.qualification || "",
      experience: teacher.experience || 0,
    });
  };

  const handleDelete = (teacherId) => {
    alert(
      `Delete action for teacher ${teacherId} not available in static mode.`
    );
  };

  const resetForm = () => {
    form.reset({
      name: "",
      email: "",
      password: "",
      phone: "",
      subject: "",
      qualification: "",
      experience: 0,
    });
    setEditingTeacher(null);
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
                <Users className="mr-3 text-blue-600 h-8 w-8" />
                Manage Teachers
              </h1>
              <p className="text-muted-foreground mt-2">
                Add, edit, and manage teacher accounts
              </p>
            </div>
          </div>

          <Dialog
            open={isCreateDialogOpen || !!editingTeacher}
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
                data-testid="button-add-teacher"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
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
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-teacher-name" />
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
                            data-testid="input-teacher-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            data-testid="input-teacher-password"
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
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} data-testid="input-teacher-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="input-teacher-subject"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="qualification"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qualification (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="input-teacher-qualification"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (years)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            data-testid="input-teacher-experience"
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
                    <Button type="submit" data-testid="button-save-teacher">
                      {editingTeacher ? "Update Teacher" : "Add Teacher"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Teachers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Teachers ({teachers?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {teachers?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No teachers found</p>
                <p className="text-sm">Click "Add Teacher" to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Qualification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers?.map((teacher, index) => (
                    <TableRow key={teacher.id}>
                      <TableCell>
                        <div className="flex items-center">
                          <div
                            className={`w-10 h-10 ${getRandomColor(
                              index
                            )} rounded-full flex items-center justify-center text-white font-medium mr-3`}
                          >
                            {getInitials(teacher.user?.name || "Unknown")}
                          </div>
                          <div>
                            <p
                              className="font-medium"
                              data-testid={`teacher-name-${index}`}
                            >
                              {teacher.user?.name || "Unknown"}
                            </p>
                            <p
                              className="text-sm text-muted-foreground"
                              data-testid={`teacher-phone-${index}`}
                            >
                              {teacher.user?.phone || "No phone"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell data-testid={`teacher-subject-${index}`}>
                        {teacher.subject}
                      </TableCell>
                      <TableCell data-testid={`teacher-email-${index}`}>
                        {teacher.user?.email}
                      </TableCell>
                      <TableCell data-testid={`teacher-experience-${index}`}>
                        {teacher.experience
                          ? `${teacher.experience} years`
                          : "N/A"}
                      </TableCell>
                      <TableCell data-testid={`teacher-qualification-${index}`}>
                        {teacher.qualification || "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(teacher)}
                            data-testid={`button-edit-teacher-${index}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(teacher.id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-teacher-${index}`}
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

export default ManageTeachers;
