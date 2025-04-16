export interface IRole {
    id: string
    name: string    
    status: string
    accessRoles: IAccessRole[]
}

export interface IAccessRole {
    id: string
    idRole: string
    idMenu: string
    menu: string
    access: boolean
    add: boolean
    status: string
}

export interface IRoleSession { 
    id: string   
    name: string
}