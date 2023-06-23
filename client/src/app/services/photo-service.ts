import http from "../http-common";
import { IPhotoListData } from "../types/photo";

const listPhotosByServiceCenterId = (id: number) => {
  return http.request.get<IPhotoListData>(`/photo/listPhotosByServiceCenterId/${id}`);
};


export default {
  listPhotosByServiceCenterId
};