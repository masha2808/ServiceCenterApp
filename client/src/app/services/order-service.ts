import http from "../http-common";
import { IOrderClientList, IOrderControlData, IOrderCreateForm, IOrderData, IOrderListData, IOrderUpdateForm } from "../types/order";

const createOrder = (data: IOrderCreateForm, jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).post<IOrderData>("/order/create", data);
};

const updateOrder = (data: IOrderUpdateForm, jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).put<IOrderData>(`/order/update/${id}`, data);
};

const deleteOrder = (jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).delete<void>(`/order/delete/${id}`);
};

const listOrders = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<IOrderListData>("/order/list");
};

const listClientOrders = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<IOrderClientList>("/order/listClientOrders");
};

const getOrderByNumber = (number: string) => {
  return http.request.get<IOrderControlData>(`/order/getByNumber/${number}`);
};

export default {
  createOrder,
  updateOrder,
  deleteOrder,
  listOrders,
  listClientOrders,
  getOrderByNumber
};