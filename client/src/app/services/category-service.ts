import http from "../http-common";
import { ICategoryListData } from "../types/category";

const listCategories = () => {
  return http.request.get<ICategoryListData>("/category/list");
};

export default {
  listCategories
};