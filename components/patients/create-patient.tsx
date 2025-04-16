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

import { patientSchema, type PatientSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import PatientForm from "./patient-form";
import { useToast } from "@/hooks/use-toast";

export default function CreatePatient() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  const form = useForm<PatientSchema>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientId: "",
      name: "",
      address: "",
      idPatientType: "",
      notes: "",
      idOrganization: ""
    },
  });

  const onSubmit = async (data: PatientSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create patient"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/patients");
      setErrorMessage("");

      toast({
        title: "Success",
        description: "Patient created.",
      })
    } catch (error) {
      console.error("Error creating patient:", error);
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
        <Button>Add Patient</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Patient</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <PatientForm
          defaultValues={{
            patientId: "",
            name: "",
            address: "",
            idPatientType: "",
            notes: "",
            idOrganization: "",
            idStatus: "0"            
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
