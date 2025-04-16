"use client";

import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { DateTimePicker } from "../ui/datetimepicker";

import { justificationSchema, JustificationSchema } from "@/lib/zod";
import { Employee, TypeJustification } from "@prisma/client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface JustificationFormProps {
  defaultValues: JustificationSchema;
  onSubmit: (data: JustificationSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

export default function JustificationForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
}: JustificationFormProps) {
  const form = useForm<JustificationSchema>({
    resolver: zodResolver(justificationSchema),
    defaultValues,
  });

  const { data: employees } = useSWR<Employee[]>("/api/employees", fetcher);
  const { data: typeJustifications } = useSWR<TypeJustification[]>(
    "/api/typeJustifications",
    fetcher
  );

  const employeeList = employees || [];
  const typeJustificationList = typeJustifications || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="idTypeJustification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type Compliance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select any" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {typeJustificationList.map((typ) => (
                    <SelectItem key={typ.id} value={typ.id}>
                      {typ.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idEmployee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {employeeList.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <FormField
            name="dateIni"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date Ini</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="dateEnd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date End</FormLabel>
                <FormControl>
                  <DateTimePicker {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notes"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
      </form>
    </Form>
  );
}
