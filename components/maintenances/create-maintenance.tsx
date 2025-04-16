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

import { maintenanceSchema, type MaintenanceSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import MaintenanceForm from "./maintenance-form";


export default function CreateMaintenance() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<MaintenanceSchema>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues: {
      idVehicle: "",
      description: "", 
      maintenanceDetails: []     
    },
  });

  const onSubmit = async (data: MaintenanceSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/maintenances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create maintenance"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/maintenances");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating maintenance:", error);
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
        <Button>Add Maintenance</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Maintenance</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <MaintenanceForm
          defaultValues={{
            idVehicle: "",
            description: "",
            maintenanceDetails: []
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
          isDisabled={false}
        />
      </DialogContent>
    </Dialog>
  );
}
