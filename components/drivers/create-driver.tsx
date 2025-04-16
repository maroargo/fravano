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

import { driverSchema, type DriverSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import DriverForm from "./driver-form";

export default function CreateDriver() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<DriverSchema>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      licensePlate: "",
      vinNumber: "",
      licenseNumber: "",
      idLicenseState: "",
      dateExpiredLicense: new Date(),
      idUser: ""
    },
  });

  const onSubmit = async (data: DriverSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create driver"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/drivers");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating driver:", error);
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
        <Button>Add Driver</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Driver</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <DriverForm
          defaultValues={{
            licensePlate: "",
            vinNumber: "",
            licenseNumber: "",
            idLicenseState: "",
            dateExpiredLicense: new Date(),
            idUser: ""
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
