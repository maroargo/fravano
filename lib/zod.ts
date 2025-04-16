import { z, object, string, boolean, number, date } from "zod";
 
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
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters")
});

export const userSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  phone: string({ required_error: "Phone is required" })
    .min(1, "Phone is required"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
  idOrganization: string({ required_error: "Organization is required" })
    .min(1, "Organization is required"),
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
    .min(1, "Address is required")
    .min(8, "Address must be more than 8 characters"),
  logo: string().optional(),
  idLocale: string({ required_error: "Locale is required" })
    .min(1, "Locale is required"),
  idTimezone: string({ required_error: "Timezone is required" })
    .min(1, "Timezone is required"),
  idLanguage: string({ required_error: "Language is required" })
    .min(1, "Language is required"),
  idStatus: string().optional()
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

export const addressSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  address: string({ required_error: "Address is required" })
    .min(1, "Address is required"),
  idAddressType: string({ required_error: "Address Type is required" })
    .min(1, "Address Type is required"),
  idOrganization: string({ required_error: "Organization is required" })
    .min(1, "Organization is required"),
  lat: number().optional(),
  lng: number().optional()
});

export const driverSchema = object({
  licensePlate: string({ required_error: "License Plate is required" })
    .min(1, "License Plate is required"),
  vinNumber: string({ required_error: "VIN Number is required" })
    .min(1, "VIN Number is required"),
  licenseNumber: string({ required_error: "License Number Type is required" })
    .min(1, "License Number Type is required"),
  idLicenseState: string({ required_error: "License State is required" })
    .min(1, "License State is required"),
  //dateExpiredLicense:  z.string().transform((str) => new Date(str))
  dateExpiredLicense: date({ required_error: "Date Expired License is required" }).nullable(), 
  idUser: string({ required_error: "User is required" })
    .min(1, "User is required")
});

export const vehicleSchema = object({
  name: string(),
  label: string({ required_error: "Label is required" })
    .min(1, "Label is required"),
  make: string({ required_error: "Make is required" })
    .min(1, "Make is required"),
  model: string({ required_error: "Model is required" })
    .min(1, "Model is required"),
  year: string({ required_error: "Year is required" })
    .min(1, "Year is required"),
  licensePlate: string({ required_error: "License Plate is required" })
    .min(1, "License Plate is required"),
  idVehicleType: string({ required_error: "Vehicle Type is required" })
    .min(1, "Vehicle Type is required"),
  idDriver: string({ required_error: "Driver is required" })
    .min(1, "Driver is required"),
});

export const maintenanceDetailSchema = object({
  date: date({ required_error: "Date is required" }).nullable(),
});

export const maintenanceSchema = object({
  idVehicle: string({ required_error: "Driver is required" })
    .min(1, "Driver is required"),
  description: string({ required_error: "Description is required" })
    .min(1, "Description is required"),
  maintenanceDetails: z.array(maintenanceDetailSchema)  
});

export const patientSchema = object({  
  patientId: string({ required_error: "Patient ID is required" })
    .min(1, "Patient ID is required"),
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required"),
  address: string({ required_error: "Address is required" })
    .min(1, "Address is required"),
  idPatientType: string({ required_error: "Type is required" })
    .min(1, "Type is required"),  
  notes: string(),
  idOrganization: string(),
  idStatus: string().optional()
});

export const pharmacyDetailSchema = object({      
  name: string({ required_error: "Description is required" })
    .min(1, "Description is required"),  
  quenty: string({ required_error: "Quenty is required" })
    .min(1, "Quenty is required")  
});

export const pharmacySchema = object({  
  address: string({ required_error: "Address is required" })
    .min(1, "Address is required"),
  order: string({ required_error: "Order is required" })
    .min(1, "Order is required"),
  idPatient: string({ required_error: "Patient is required" })
    .min(1, "Patient is required"),
  dateOrder: date({ required_error: "Date Order is required" }).nullable(),   
  dateDelivery: date({ required_error: "Date Delivery is required" }).nullable(),
  copay: string(),   
  pharmacyDetails: z.array(pharmacyDetailSchema)
});

export const routeDetailSchema = object({ 
  item: string({ required_error: "Item is required" })
    .min(1, "Item is required"),       
  address: string({ required_error: "Address is required" })
    .min(1, "Address is required"),
  estimation: date({ required_error: "Estimation Time is required" }).nullable(),  
  lat: number().optional(),
  lng: number().optional(),
  notes: string()
});

export const routeSchema = object({  
  name: string(),
  dateRoute: date({ required_error: "Date is required" }).nullable(),  
  idRouteAsign: string({ required_error: "Route Asign is required" }),
  idRouteType: string({ required_error: "Route Type is required" }),
  idRoutePriority: string({ required_error: "Route Priority is required" }),
  idDriver: string({ required_error: "Driver is required" })
    .min(1, "Driver is required"),
  idType: string({ required_error: "Type is required" }),
  idRoutePreference: string({ required_error: "Route Preference is required" }),
  idPatient: string({ required_error: "Patient is required" })
    .min(1, "Patient is required"),
  idTimezone: string(),
  routeDetails: z.array(routeDetailSchema)
});

export type UserSchema = z.infer<typeof userSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export type OrganizationSchema = z.infer<typeof organizationSchema>;
export type RoleSchema = z.infer<typeof roleSchema>;
export type MenuSchema = z.infer<typeof menuSchema>;
export type AccessRoleSchema = z.infer<typeof accessRoleSchema>;

export type AddressSchema = z.infer<typeof addressSchema>;
export type VehicleSchema = z.infer<typeof vehicleSchema>;
export type MaintenanceSchema = z.infer<typeof maintenanceSchema>;
export type MaintenanceDetailSchema = z.infer<typeof maintenanceDetailSchema>;
export type DriverSchema = z.infer<typeof driverSchema>;

export type PatientSchema = z.infer<typeof patientSchema>;
export type PharmacySchema = z.infer<typeof pharmacySchema>;
export type PharmacyDetailSchema = z.infer<typeof pharmacyDetailSchema>;
export type RouteSchema = z.infer<typeof routeSchema>;
export type RouteDetailSchema = z.infer<typeof routeDetailSchema>;