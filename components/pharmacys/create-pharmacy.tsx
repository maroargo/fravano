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

import { pharmacySchema, type PharmacySchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import PharmacyForm from "./pharmacy-form";
import { useToast } from "@/hooks/use-toast";

export default function CreatePharmacy() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const { toast } = useToast();
  const form = useForm<PharmacySchema>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: {
      address: "",
      idPatient: ""
    },
  });

  const onSubmit = async (data: PharmacySchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/pharmacys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create pharmacy"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate(`/api/pharmacys/date?dateOrder=${new Date()}`);
      setErrorMessage("");

      toast({
        title: "Success",
        description: "Order Pharmacy created.",
      })
    } catch (error) {
      console.error("Error creating pharmacy:", error);
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
        <Button>Add Pharmacy</Button>
      </DialogTrigger>      

      <DialogContent className="max-w-[95%] w-[520px] overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Create New Order Pharmacy</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <PharmacyForm
          defaultValues={{ 
            order: "",           
            address: "",
            idPatient: "",
            dateOrder: new Date(),
            dateDelivery: new Date(),
            copay: "",
            pharmacyDetails: []
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
