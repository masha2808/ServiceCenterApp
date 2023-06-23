import http from "../http-common";
import { ITaskCreateForm, ITaskData, ITaskListData, ITaskUpdateForm, ITaskUpdateAsEmployeeForm } from "../types/task";

const createTask = (data: ITaskCreateForm, jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).post<ITaskData>("/task/create", data);
};

const updateTask = (data: ITaskUpdateForm, jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).put<ITaskData>(`/task/update/${id}`, data);
};

const updateTaskAsEmployee = (data: ITaskUpdateAsEmployeeForm, jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).put<ITaskData>(`/task/updateAsEmployee/${id}`, data);
};

const deleteTask = (jwtToken: string, id: number) => {
  return http.getAuthorizationRequest(jwtToken).delete<ITaskData>(`/task/delete/${id}`);
};

const listTasks = (jwtToken: string) => {
  return http.getAuthorizationRequest(jwtToken).get<ITaskListData>("/task/list");
};

export default {
  createTask,
  updateTask,
  updateTaskAsEmployee,
  deleteTask,
  listTasks,
};