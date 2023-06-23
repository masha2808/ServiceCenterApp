import http from "../http-common";
import { IUserData } from "../types/user";

const getUser = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<IUserData>("/user/get");
};

const updateUser = (data: FormData, jwtToken: string) => {
  return http.getAuthorizationFormDataRequest(jwtToken).put<IUserData>("/user/update", data);
};

export default {
  getUser,
  updateUser
};