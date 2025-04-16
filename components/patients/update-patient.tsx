"use client";

import { useState } from "react";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import PatientForm from "@/components/patients/patient-form";
import { type PatientSchema } from "@/lib/zod";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { IPatient } from "@/interfaces/patient";
import { Status } from "@prisma/client";

export default function UpdatePatient({ patient }: { patient: IPatient }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();

  const onSubmit = async (data: PatientSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/patients", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, id: patient.id }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Failed to update patient");
      }

      setErrorMessage("");
      setDialogOpen(false);
      mutate("/api/patients");

      toast({
        title: "Success",
        description: "Patient updated.",
      });
    } catch (error) {
      console.error("Error updating patient:", error);
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
        <Button
          variant="ghost"
          size="icon"
          className="mr-1 text-blue-500 bg-blue-100 hover:text-blue-700 hover:bg-blue-200"
        >
          <Pencil1Icon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Update Patient</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <PatientForm
          defaultValues={{
            patientId: patient.patientId || "",
            name: patient.name || "",
            address: patient.address  || "",
            idPatientType: patient.idPatientType  || "",
            notes: patient.notes  || "",
            idOrganization: patient.idOrganization  || "",
            idStatus: patient.status == Status.active ? "0" : "1",
          }}
          onSubmit={onSubmit}
          submitButtonText="Update"
          isSubmitting={isSubmitting}
          isUpdating={isUpdating}
        />
      </DialogContent>
    </Dialog>
  );
}
