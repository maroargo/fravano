import { z, object, string, number, date, boolean } from "zod";
 
export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(12, "Password must be less than 12 characters")
});

export const registerSchema = object({
  identifier: string({ required_error: "User ID required" })
    .min(1, "User ID required")
    .max(4, "User ID required"),
  ipAddress: string().optional(),
  idLocation: string().optional(),
  type: string().optional()
});

export const joinSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  organization: string({ required_error: "Organization is required" })
    .min(1, "Organization is required"),
  address: string({ required_error: "Organization Address is required" })
    .min(1, "Organization Address is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  phone: string({ required_error: "Phone is required" })
    .min(1, "Phone is required"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(12, "Password must be less than 12 characters"),
  repeatPassword: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(12, "Password must be less than 12 characters")
});

export const companySchema = object({
  identifier: string({ required_error: "User ID is required" })
    .min(1, "User ID is required"),   
  idTimezone: string({ required_error: "Timezone is required" })
    .min(1, "Timezone is required"),
  idTimeformat: string({ required_error: "Timeformat is required" })
    .min(1, "Timeformat is required"),
  logo: string().optional() 
});

export const userSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  phone: string().optional(),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(12, "Password must be less than 12 characters"),
  idOrganization: string(),
  idRole: string({ required_error: "Role is required" })
    .min(1, "Role is required")  
});

export const userUpdateSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),  
  phone: string({ required_error: "Phone is required" })
    .min(1, "Phone is required"),
  idOrganization: string({ required_error: "Organization is required" })
    .min(1, "Organization is required"),
  idRole: string({ required_error: "Role is required" })
    .min(1, "Role is required"),
  idStatus: string().optional()
});

export const organizationSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  address: string({ required_error: "Address is required" })
    .min(1, "Address is required"),
  idTimezone: string({ required_error: "Timezone is required" })
    .min(1, "Timezone is required"),
  idTimeformat: string({ required_error: "Timeformat is required" })
    .min(1, "Timeformat is required"),
  logo: string(),
  idStatus: string().optional()  
});

export const organizationParamSchema = object({
  identifier: string().optional(),
  clockIn: string().optional(),
  clockOut: string().optional(),
  idPayPeriodType: string().optional(),
  payPeriodStart: date().nullable(),  
  analyticTitle: string().optional(),
  analyticSrc: string().optional() 
});

export const locationSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  address: string({ required_error: "Address is required" })
    .min(1, "Address is required"),  
  idOrganization: string(),
  idStatus: string().optional()  
});

export const selectLocationSchema = object({
  idLocation: string({ required_error: "Location is required" })
    .min(1, "Location is required")  
});

export const accessRoleSchema = object({
  idRole: string(),    
  idMenu: string(),
  menu: string(),  
  access: boolean(),
  add: boolean()
});

export const roleSchema = object({ 
  name: string(),   
  idStatus: string().optional(), 
  accessRoles: z.array(accessRoleSchema)
});

export const menuSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  url: string(),    
  icon: string(),
  idMenu: string()
});

export const employeeSchema = object({
  firstName: string({ required_error: "First Name is required" })
    .min(1, "First Name is required"),  
  lastName: string({ required_error: "Last Name is required" })
    .min(1, "Last Name is required"),  
  identifier: string({ required_error: "User ID is required" })
    .min(1, "User ID is required"),
  email: string(),
  phone: string(),  
  clockIn: string().optional(),
  clockOut: string().optional(),
  idLocation: string({ required_error: "Location is required" })
    .min(1, "Location is required"),
  idMode: string({ required_error: "Mode is required" })
    .min(1, "Mode is required"),
  idStatus: string().optional()
});

export const attendanceSchema = object({    
  date: date({ required_error: "Date is required" }).nullable(), 
  ipAddress: string().optional(),  
  macAddress: string().optional(),  
  lat: number().optional(),
  lng: number().optional(),  
  notes: string().optional(),
  idEmployee: string({ required_error: "Employee is required" })
    .min(1, "Employee is required"),
  idLocation: string({ required_error: "Location is required" })
    .min(1, "Location is required"),
  type: string().optional(),
  typeRegister: string().optional()
});

export const downloadSchema = object({    
  dateIni: date({ required_error: "Date Ini is required" }), 
  dateEnd: date({ required_error: "Date End is required" }),   
});

export const justificationSchema = object({    
  idEmployee: string({ required_error: "Employee is required" })
    .min(1, "Employee is required"),
  dateIni: date({ required_error: "Date Ini is required" }).nullable(), 
  dateEnd: date({ required_error: "Date End is required" }).nullable(), 
  notes: string(),
  idTypeJustification: string({ required_error: "Justification Type is required" })
    .min(1, "Justification Type is required")  
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type OrganizationSchema = z.infer<typeof organizationSchema>;
export type OrganizationParamSchema = z.infer<typeof organizationParamSchema>;
export type LocationSchema = z.infer<typeof locationSchema>;
export type SelectLocationSchema = z.infer<typeof selectLocationSchema>;
export type RoleSchema = z.infer<typeof roleSchema>;
export type MenuSchema = z.infer<typeof menuSchema>;
export type AccessRoleSchema = z.infer<typeof accessRoleSchema>;

export type EmployeeSchema = z.infer<typeof employeeSchema>;
export type AttendanceSchema = z.infer<typeof attendanceSchema>;
export type DownloadSchema = z.infer<typeof downloadSchema>;
export type JustificationSchema = z.infer<typeof justificationSchema>;