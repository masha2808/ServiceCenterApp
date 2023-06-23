import http from "../http-common";
import { ICityListData } from "../types/city";

const listCities = () => {
  return http.request.get<ICityListData>("/city/list");
};

export default {
  listCities
};