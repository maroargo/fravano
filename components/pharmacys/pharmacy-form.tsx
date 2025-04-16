"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DateTimePicker } from "../ui/datetimepicker";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { pharmacySchema, type PharmacySchema } from "@/lib/zod";
import useSWR from "swr";
import { Patient } from "@prisma/client";
import { CirclePlus, Trash2 } from "lucide-react";

interface PharmacyFormProps {
  defaultValues: PharmacySchema;
  onSubmit: (data: PharmacySchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
  isUpdated: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PharmacyForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
  isUpdated,
}: PharmacyFormProps) {
  const form = useForm<PharmacySchema>({
    resolver: zodResolver(pharmacySchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: "pharmacyDetails",
    control: form.control,
  });

  const { data: patients } = useSWR<Patient[]>("/api/patients/active", fetcher);

  const patientList = patients || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          name="dateOrder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Order</FormLabel>
              <FormControl>
                <DateTimePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            disabled={isUpdated}
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Order</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            disabled={isUpdated}
            control={form.control}
            name="copay"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Copay</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          disabled={isUpdated}
          control={form.control}
          name="idPatient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asign Patient</FormLabel>
              <Select
                disabled={isUpdated}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {patientList.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name} ({patient.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          disabled={isUpdated}
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          {!isUpdated && (
            <Button
              type="button"
              onClick={() => append({ name: "", quenty: "" })}
            >
              <CirclePlus />
            </Button>
          )}
        </div>

        <Separator className="my-2" />

        {fields.map((field, index) => (
          <div key={field.id}>
            <div className="flex justify-between items-end mb-4 min-w-full gap-2 md:grid-cols-3">
              <div className="grid auto-rows-min gap-1 md:grid-cols-1">
                <FormField
                  disabled={isUpdated}
                  control={form.control}
                  name={`pharmacyDetails.${index}.name`}
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
              </div>
              <div className="grid auto-rows-min gap-1 md:grid-cols-1">
                <FormField
                  disabled={isUpdated}
                  control={form.control}
                  name={`pharmacyDetails.${index}.quenty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quenty</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!isUpdated && (
                <div className="flex">
                  <Button
                    disabled={isUpdated}
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

        {!isUpdated && (
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
