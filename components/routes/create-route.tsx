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

import { routeSchema, type RouteSchema } from "@/lib/zod";
import { useState } from "react";

import { mutate } from "swr";
import RouteForm from "./route-form";
import { toast } from "@/hooks/use-toast";
import { IRouteDetail } from "@/interfaces/route";

import RouteMapRoute from "./route-map-route";

export default function CreateRoute() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [fields, setFields] = useState<IRouteDetail[]>([]);
  const form = useForm<RouteSchema>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: "",
      idRouteAsign: "",
      idRoutePriority: "",
      idDriver: "",
      idRoutePreference: "",
      routeDetails: [],
    },
  });

  const onSubmit = async (data: RouteSchema) => {
    setIsSubmitting(true);
    try {
      // Add lat and lng to each route detail
      const updatedRouteDetails = data.routeDetails.map((detail) => {
        return {
          ...detail,
          lat: detail.lat || 0, // Use the lat value set by PlaceAutocomplete
          lng: detail.lng || 0, // Use the lng value set by PlaceAutocomplete
          //scheduledArrival: detail.scheduledArrival ? new Date(detail.scheduledArrival).toISOString() : null,
          //scheduledDeparture: detail.scheduledDeparture ? new Date(detail.scheduledDeparture).toISOString() : null,
        };
      });

      const updatedData = {
        ...data,
        routeDetails: updatedRouteDetails,
      };

      const response = await fetch("/api/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit route");
      }

      form.reset();
      setDialogOpen(false);      
      mutate(`/api/routes/date?dateRoute=${new Date()}`);
    } catch (error) {
      console.log(error);
      toast({
        description: "Error submitting route",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog modal={true} open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Routes</Button>
      </DialogTrigger>

      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-[90%] bg-white z-50 h-[600px]"
      >
        <DialogHeader>
          <DialogTitle>Create New Routes</DialogTitle>
        </DialogHeader>

        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}
        <div className="flex w-full">
          <div className="w-2/3 h-full flex flex-row relative overflow-auto max-h-[500px]">
            <div
              className={`transition-all duration-500 ease-in-out w-full pr-4`}
            >
              <RouteForm
                defaultValues={{
                  name: "",
                  dateRoute: new Date(),
                  idRouteAsign: "",
                  idRouteType: "",
                  idRoutePriority: "",
                  idDriver: "",
                  idType: "",
                  idRoutePreference: "",
                  idPatient: "",
                  idTimezone: "",
                  routeDetails: [
                    {
                      item: "START",
                      address: "",
                      estimation: new Date(),
                      notes: "",
                    },
                    { item: "END", address: "", estimation: null, notes: "" },
                  ],
                }}
                onSubmit={onSubmit}
                submitButtonText="Create"
                isSubmitting={isSubmitting}
                isDisabled={false}
                setFields={setFields}
              />
            </div>
          </div>

          <div className="w-1/3 px-4 h-[450px]">
            <RouteMapRoute fields={fields} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
