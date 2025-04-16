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
import { Input } from "@/components/ui/input";

import { driverSchema, type DriverSchema } from "@/lib/zod";
import useSWR from "swr";
import { IUser } from "@/interfaces/user";
import { DateTimePicker } from "../ui/datetimepicker";

interface DriverFormProps {
  defaultValues: DriverSchema;
  onSubmit: (data: DriverSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DriverForm({
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
}: DriverFormProps) {
  const form = useForm<DriverSchema>({
    resolver: zodResolver(driverSchema),
    defaultValues,
  });

  const { data: users } = useSWR<IUser[]>("/api/users/active", fetcher);

  const { data: licenseStates } = useSWR<IUser[]>(
    "/api/licenseStates",
    fetcher
  );

  const userList = users?.filter((u) => u.role?.name === "Driver");
  const licenseStateList = licenseStates || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Plate</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vinNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VIN Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="idLicenseState"
          render={({ field }) => (
            <FormItem>
              <FormLabel>License State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a license state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {licenseStateList.map((lic) => (
                    <SelectItem key={lic.id} value={lic.id || ""}>
                      {lic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField          
          name="dateExpiredLicense"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Expired License</FormLabel>
              <FormControl>
                <DateTimePicker {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />        

        <FormField
          control={form.control}
          name="idUser"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Asign User</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {userList?.map((user) => (
                    <SelectItem key={user.id} value={user.id || ""}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
