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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { format } from "date-fns";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Layers,
  CalendarIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const batchFormSchema = z.object({
  name: z.string().min(2, "Batch name must be at least 2 characters"),
  classId: z.string().min(1, "Class is required"),
  academicYear: z.string().min(4, "Academic year is required").optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const ManageBatches = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classes to get batches
        const classesRes = await axios.get(`http://localhost:3000/class/all`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const classesData = classesRes.data.classes || [];
        setClasses(classesData);

        // Extract all batches from classes
        const allBatches = [];
        classesData.forEach((cls) => {
          if (cls.batches && Array.isArray(cls.batches)) {
            cls.batches.forEach((batch) => {
              allBatches.push({ ...batch, className: cls.name });
            });
          }
        });
        setBatches(allBatches);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load batches",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const form = useForm({
    resolver: zodResolver(batchFormSchema),
    defaultValues: {
      name: "",
      classId: "",
      academicYear: "",
      startDate: undefined,
      endDate: undefined,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/batch/create`,
        {
          batchName: data.name,
          classId: data.classId,
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
        description: "Batch created successfully",
      });

      // Refresh batches list
      const classesRes = await axios.get(`http://localhost:3000/class/all`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const classesData = classesRes.data.classes || [];
      setClasses(classesData);

      const allBatches = [];
      classesData.forEach((cls) => {
        if (cls.batches && Array.isArray(cls.batches)) {
          cls.batches.forEach((batch) => {
            allBatches.push({ ...batch, className: cls.name });
          });
        }
      });
      setBatches(allBatches);

      setIsCreateDialogOpen(false);
      setEditingBatch(null);
      form.reset();
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create batch",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    form.reset({
      name: batch.name || "",
      classId: batch.classRef?._id || batch.classRef || "",
      academicYear: batch.academicYear || "",
      startDate: batch.startDate ? new Date(batch.startDate) : undefined,
      endDate: batch.endDate ? new Date(batch.endDate) : undefined,
    });
  };

  const handleDelete = (batchId) => {
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
      academicYear: "",
      startDate: undefined,
      endDate: undefined,
    });
    setEditingBatch(null);
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
                <Layers className="mr-3 text-purple-600 h-8 w-8" />
                Manage Batches
              </h1>
              <p className="text-muted-foreground mt-2">
                Add, edit, and manage academic batches
              </p>
            </div>
          </div>

          <Dialog
            open={isCreateDialogOpen || !!editingBatch}
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
                data-testid="button-add-batch"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Batch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {editingBatch ? "Edit Batch" : "Add New Batch"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="classId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class</FormLabel>
                        <Select
                          onValueChange={field.onChange}
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Batch Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., Batch 2024-A"
                            data-testid="input-batch-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="academicYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Year (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="e.g., 2024-2025"
                            data-testid="input-academic-year"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date (optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                data-testid="button-start-date"
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
                    name="endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date (optional)</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                data-testid="button-end-date"
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
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                    <Button type="submit" data-testid="button-save-batch">
                      {editingBatch ? "Update Batch" : "Add Batch"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Batches Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Batches ({batches?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent>
            {batches?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Layers className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>No batches found</p>
                <p className="text-sm">Click "Add Batch" to get started</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches?.map((batch, index) => (
                    <TableRow key={batch._id || batch.id}>
                      <TableCell>
                        <div
                          className="font-medium"
                          data-testid={`batch-name-${index}`}
                        >
                          {batch.name}
                        </div>
                      </TableCell>
                      <TableCell data-testid={`batch-year-${index}`}>
                        {batch.className || "N/A"}
                      </TableCell>
                      <TableCell data-testid={`batch-start-date-${index}`}>
                        {batch.startDate
                          ? new Date(batch.startDate).toLocaleDateString()
                          : "Not set"}
                      </TableCell>
                      <TableCell data-testid={`batch-end-date-${index}`}>
                        {batch.endDate
                          ? new Date(batch.endDate).toLocaleDateString()
                          : "Not set"}
                      </TableCell>
                      <TableCell data-testid={`batch-created-${index}`}>
                        {batch.createdAt
                          ? new Date(batch.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(batch)}
                            data-testid={`button-edit-batch-${index}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(batch._id || batch.id)}
                            className="text-destructive hover:text-destructive"
                            data-testid={`button-delete-batch-${index}`}
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

export default ManageBatches;
