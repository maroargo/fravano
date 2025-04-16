"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { attendanceSchema, AttendanceSchema } from "@/lib/zod";
import AttendanceForm from "./attendance-form";

export default function CreateAttendance({ onCreated }: { onCreated?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [ipAddress, setIpAddress] = useState("");
  const fetchIp = async () => {
    try {
      const response = await fetch('https://api.ipify.org');
      const data = await response.text();
      setIpAddress(data); 
      console.log(data);     
    } catch (error) {
      setIpAddress("127.0.0.1");
    }
  };

  useEffect(() => {
    fetchIp();
  }, []);

  const { toast } = useToast();
  const form = useForm<AttendanceSchema>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {      
      date: new Date,
      ipAddress: "",
      idEmployee: "",
      idLocation: "",
      type: "",
      typeRegister: ""      
    },
  });

  const onSubmit = async (data: AttendanceSchema) => {
    setIsSubmitting(true);
    try {

      data.ipAddress = ipAddress;

      const response = await fetch("/api/attendances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },        
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create attendance"
        );
      }
      form.reset();
      setDialogOpen(false);      
      setErrorMessage("");

      // luego del éxito
      if (onCreated) onCreated();

      toast({
        title: "Success",
        description: "Attendance created.",
      })
    } catch (error) {      
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setErrorMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create Attendace</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <AttendanceForm
          defaultValues={{                        
            date: new Date,
            ipAddress: "",
            macAddress: "",
            notes: "",
            idEmployee: "",
            idLocation: "",
            type: "", 
            typeRegister: "Manual"                              
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
          isUpdated={isUpdated}
        />
      </DialogContent>
    </Dialog>
  );
}
