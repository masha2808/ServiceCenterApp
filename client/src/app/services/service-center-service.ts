import http from "../http-common";
import { IServiceCenterData, IServiceCenterListData } from "../types/service-center";
import { IUserData } from "../types/user";

const getServiceCenterManagement = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<IServiceCenterData>("/serviceCenter/getServiceCenterManagement");
};


const getServiceCenter = (id: number) => {
  return http.request.get<IServiceCenterData>(`/serviceCenter/get/${id}`);
};

const getServiceCenterAdministratorData = (jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).get<IUserData>(`/serviceCenter/getServiceCenterAdministratorData/${id}`);
};

const listServiceCenters = () => {
  return http.request.get<IServiceCenterListData>("/serviceCenter/list");
};

const createServiceCenter = (jwtToken: string, data: FormData) => {
  return http.getAuthorizationFormDataRequest(jwtToken).post<IServiceCenterData>("/serviceCenter/create", data);
};

const updateServiceCenter = (jwtToken: string, data: FormData) => {
  return http.getAuthorizationFormDataRequest(jwtToken).put<IServiceCenterData>("/serviceCenter/update", data);
};

const deleteServiceCenter = (jwtToken: string) => {
  return http.getAuthorizationFormDataRequest(jwtToken).delete<void>("/serviceCenter/delete");
};

export default {
  getServiceCenterManagement,
  getServiceCenter,
  getServiceCenterAdministratorData,
  listServiceCenters,
  createServiceCenter,
  updateServiceCenter,
  deleteServiceCenter
};