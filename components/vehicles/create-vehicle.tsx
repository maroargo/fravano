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

import { vehicleSchema, type VehicleSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import VehicleForm from "./vehicle-form";

export default function CreateVehicle() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const form = useForm<VehicleSchema>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: "",
      label: "",
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      idVehicleType: "",
      idDriver: ""
    },
  });

  const onSubmit = async (data: VehicleSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create vehicle"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/vehicles");
      setErrorMessage("");
    } catch (error) {
      console.error("Error creating vehicle:", error);
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
        <Button>Add Vehicle</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Create New Vehicle</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <VehicleForm
          defaultValues={{
            name: "",
            label: "",
            make: "",
            model: "",
            year: "",
            licensePlate: "",
            idVehicleType: "",
            idDriver: ""
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
