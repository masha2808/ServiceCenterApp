import http from "../http-common";
import { IApplicationClientList, IApplicationControlData, IApplicationCreateForm, IApplicationData, IApplicationListData, IApplicationUpdateForm } from "../types/application";

const createApplication = (data: IApplicationCreateForm, jwtToken: string | null) => {
  if (jwtToken) {
    return http.getAuthorizationRequest(jwtToken).post<IApplicationData>("/application/createAsClient", data);
  } else {
    return http.request.post<IApplicationData>("/application/create", data);
  }
};

const updateApplication = (data: IApplicationUpdateForm, jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).put<IApplicationData>(`/application/update/${id}`, data);
};

const deleteApplication = (jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).delete<void>(`/application/delete/${id}`);
};

const listApplications = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<IApplicationListData>("/application/list");
};

const listClientApplications = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<IApplicationClientList>("/application/listClientApplications");
};

const getApplicationByNumber = (number: string) => {
  return http.request.get<IApplicationControlData>(`/application/getByNumber/${number}`);
};

export default {
  createApplication,
  updateApplication,
  deleteApplication,
  listApplications,
  listClientApplications,
  getApplicationByNumber
};