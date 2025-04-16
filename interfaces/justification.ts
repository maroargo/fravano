import { Employee, TypeJustification } from "@prisma/client"

export interface IJustification {
  id: string

  idEmployee: string
  employee?: Employee

  dateIni: Date
  dateEnd: Date
  notes: string
  status: string
  
  idTypeJustification: string
  typeJustification?: TypeJustification  
  
}