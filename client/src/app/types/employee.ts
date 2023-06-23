import { IUserData } from "./user";

export interface IEmployeeCreateForm {
  firstName: string,
  lastName: string,
  middleName: string,
  dateOfBirth: Date,
  email: string,
  phone: string,
  position: string,
  cooperationStartDate: Date,
  cooperationEndDate: Date | null,
}

export interface IEmployeeUpdateForm {
  firstName: string,
  lastName: string,
  middleName: string,
  dateOfBirth: Date,
  phone: string,
  position: string,
  cooperationStartDate: Date,
  cooperationEndDate: Date | null,
}

export interface IEmployeeListData {
  employeeList: Array<IUserData>
}

export interface IEmployeeList {
  data: IEmployeeListData | null,
  loaded: boolean | null,
  listEmployees: () => void,
  createEmployee: (formData: FormData, handleClose: () => void) => void,
  updateEmployee: (formData: FormData, id: number, handleClose: () => void) => void,
  deleteEmployee: (id: number, handleClose: () => void) => void
}