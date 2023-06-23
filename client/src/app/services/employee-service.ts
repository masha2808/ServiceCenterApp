import http from "../http-common";
import { IEmployeeListData } from "../types/employee";
import { IUserData } from "../types/user";

const createEmployee = (data: FormData, jwtToken: string) => {
  return http.getAuthorizationFormDataRequest(jwtToken).post<IUserData>("/employee/create", data);
};

const updateEmployee = (data: FormData, jwtToken: string, id: number) => {
  return http.getAuthorizationFormDataRequest(jwtToken).put<IUserData>(`/employee/update/${id}`, data);
};

const deleteEmployee = (jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).delete<IUserData>(`/employee/delete/${id}`);
};

const listEmployees = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<IEmployeeListData>("/employee/list");
};

export default {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  listEmployees,
};