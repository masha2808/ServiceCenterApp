import http from "../http-common";
import { IResponseData, IResponseListData } from "../types/response";

const createResponse = (jwtToken: string, data: IResponseData) => {
  return http.getAuthorizationRequest(jwtToken).post<IResponseListData>("/response/create", data);
};

const listResponsesByServiceCenterId = (id: number) => {
  return http.request.get<IResponseListData>(`/response/listResponsesByServiceCenterId/${id}`);
};


export default {
  createResponse,
  listResponsesByServiceCenterId
};