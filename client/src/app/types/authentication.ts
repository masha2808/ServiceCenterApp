export interface ILoginData {
  email: string,
  password: string,
}

export interface ILoginResponse {
  jwtToken: string,
  role: string
}

export interface IRegistrationForm {
  firstName: string,
  lastName: string,
  middleName: string,
  dateOfBirth: Date,
  email: string,
  phone: string,
  password: string,
  repetedPassword: string,
}

export interface IChangePasswordData {
  password: string,
  newPassword: string
}

export interface IChangePasswordForm extends IChangePasswordData {
  repetedNewPassword: string
}

export interface IRegistrationResponse {
  message: string
}

export interface IRegistrationResponse {
  message: string
}

export interface IChangePasswordResponse {
  message: string
}