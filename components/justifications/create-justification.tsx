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

import { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import { justificationSchema, JustificationSchema } from "@/lib/zod";
import JustificationForm from "./justification-form";

export default function Createjustification() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);  

  const { toast } = useToast();
  const form = useForm<JustificationSchema>({
    resolver: zodResolver(justificationSchema),
    defaultValues: {      
      idEmployee: "",
      dateIni: new Date,
      dateEnd: new Date,
      notes: "",
      idTypeJustification: ""
    },
  });

  const onSubmit = async (data: JustificationSchema) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/justifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },        
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || "Failed to create la justificación"
        );
      }
      form.reset();
      setDialogOpen(false);
      mutate("/api/justifications");
      setErrorMessage("");

      toast({
        title: "Success",
        description: "Compliance created.",
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
        <Button>Add Compliance</Button>
      </DialogTrigger>      

      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>Create Compliance</DialogTitle>
        </DialogHeader>
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <JustificationForm
          defaultValues={{                        
            idEmployee: "",
            dateIni: new Date,
            dateEnd: new Date,
            notes: "",
            idTypeJustification: ""            
          }}
          onSubmit={onSubmit}
          submitButtonText="Create"
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
