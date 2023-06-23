import http from "../http-common";
import { IChangePasswordResponse, ILoginData, ILoginResponse, IChangePasswordData, IRegistrationResponse } from "../types/authentication";

const register = (data: FormData) => {
  return http.formDataRequest.post<IRegistrationResponse>("/authentication/register", data);
};

const login = (data: ILoginData) => {
  return http.request.post<ILoginResponse>("/authentication/login", data);
};

const changePassword = (data: IChangePasswordData, jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).post<IChangePasswordResponse>("/authentication/changePassword", data);
};

export default {
  register,
  login,
  changePassword
};