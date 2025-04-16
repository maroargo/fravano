import { Mode } from "@prisma/client"
import { ILocation } from "./location"

export interface IEmployee {
  id: string
  firstName: string
  lastName: string
  identifier: string
  email: string
  phone: string
  clockIn: string
  clockOut: string

  fullName: string
  completeName: string

  status: string      
  idLocation: string
  location?: ILocation
  idMode: string
  mode?: Mode
}