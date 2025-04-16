"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { maintenanceSchema, type MaintenanceSchema } from "@/lib/zod";
import useSWR from "swr";
import { IVehicle } from "@/interfaces/vehicle";
import { CirclePlus, Trash2 } from "lucide-react";
import { DateTimePicker } from "../ui/datetimepicker";

interface MaintenanceFormProps {
  defaultValues: MaintenanceSchema;
  onSubmit: (data: MaintenanceSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isDisabled: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MaintenanceForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isDisabled,
}: MaintenanceFormProps) {
  const form = useForm<MaintenanceSchema>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "maintenanceDetails",
    control: form.control,
  });

  const { data: vehicles } = useSWR<IVehicle[]>("/api/vehicles/active", fetcher);

  const vehicleList = vehicles || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          disabled={isDisabled}
          control={form.control}
          name="idVehicle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <Select
                disabled={isDisabled}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicleList.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.driver.user.name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isDisabled}
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          {!isDisabled && (
            <Button type="button" onClick={() => append({ date: new Date() })}>
              <CirclePlus />
            </Button>
          )}
        </div>

        <Separator className="my-4" />

        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex justify-between items-end mb-4 min-w-full gap-3">
              <div className="w-full">
                <FormField                   
                  name={`maintenanceDetails.${index}.date`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DateTimePicker {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />                
              </div>
              {!isDisabled && (
                <div className="flex">
                  <Button
                    disabled={isDisabled}
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}

        {!isDisabled && (
          <Button
            disabled={isSubmitting}
            className="w-full relative"
            type="submit"
          >
            {isSubmitting && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/50 rounded-md">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            {submitButtonText}
          </Button>
        )}
      </form>
    </Form>
  );
}
