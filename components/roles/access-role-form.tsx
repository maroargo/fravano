"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator";

import { roleSchema, RoleSchema } from "@/lib/zod";
import { Menu } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AccessRoleFormProps {
  idRole: string;
  defaultValues: RoleSchema;
  onSubmit: (data: RoleSchema) => Promise<void>;
  submitButtonText: string;
  isSubmitting: boolean;
}

export default function AccessRoleForm({
  idRole,
  defaultValues,
  onSubmit,
  submitButtonText,
  isSubmitting,
}: AccessRoleFormProps) {
  const form = useForm<RoleSchema>({
    resolver: zodResolver(roleSchema),
    defaultValues,
  });

  const { data: menus } = useSWR<Menu[]>("/api/menus", fetcher);

  const { fields, append } = useFieldArray({
    name: "accessRoles",
    control: form.control,
  });

  const menuList = menus || [];    

  if (fields.length == 0) {
    menuList.map((m) =>
      append({
        idRole: idRole,
        idMenu: m.id,
        menu: m.name || "-",
        access: false,
        add: false,
      })
    );
  }  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField          
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse text-sm">
            <thead className="bg-rojo1 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Menu</th>
                <th className="px-4 py-2 text-left">Access</th>
                <th className="px-4 py-2 text-left">Add</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {fields.length > 0 ? (
                fields.map((r, index) => (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50 border-b border-[#D3D3D3] "
                  >
                    <td className="px-4 py-2">{r.menu}</td>
                    <td className="px-4 py-2">
                      <FormField
                        control={form.control}
                        name={`accessRoles.${index}.access`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>                            
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-4 py-2">
                    <FormField
                        control={form.control}
                        name={`accessRoles.${index}.add`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>                            
                          </FormItem>
                        )}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-2">No results found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
