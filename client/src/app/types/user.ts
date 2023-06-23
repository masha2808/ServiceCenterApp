export interface IUserData {
  id: number,
  role: "administrator" | "client" | "employee"
  firstName: string,
  lastName: string,
  middleName: string,
  dateOfBirth: Date,
  photo: string | null,
  email: string,
  phone: string,
  position: string | null,
  cooperationStartDate: Date | null,
  cooperationEndDate: Date | null,
  userId: number | null,
}

export interface IUserUpdateForm {
  firstName: string,
  lastName: string,
  middleName: string,
  dateOfBirth: Date,
  photo: Blob | null,
  phone: string,
}

export interface IUser {
  data: IUserData | null,
  loaded: boolean | null,
  getUser: () => void,
  updateUser: (data: FormData, handleClose: () => void) => void,
}