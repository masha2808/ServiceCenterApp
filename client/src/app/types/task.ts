import { IUserData } from "./user";

export interface ITaskCreateForm {
  orderId: number | null,
  plannedDateCompleted: Date | null,
  employeeId: number,
  description: string,
  name: string
}

export interface ITaskData extends ITaskCreateForm, IUserData {
  id: number,
  orderNumber: string,
  dateTimeCreated: Date,
  dateCompleted: Date | null,
  statusName: string,
  comment: string | null,
}

export interface ITaskUpdateAsEmployeeForm {
  plannedDateCompleted: Date | null,
  dateCompleted: Date | null,
  statusName: string,
  comment: string | null,
}

export interface ITaskUpdateForm extends ITaskUpdateAsEmployeeForm {
  employeeId: number,
  description: string,
  name: string,
}

export interface ITaskListData {
  taskList: Array<ITaskData>
}

export interface ITaskList {
  data: ITaskListData | null,
  loaded: boolean | null,
  listTasks: () => void,
  createTask: (formData: ITaskCreateForm, handleClose: () => void) => void,
  updateTask: (formData: ITaskUpdateForm, id: number, handleClose: () => void) => void,
  updateTaskAsEmployee: (formData: ITaskUpdateAsEmployeeForm, id: number, handleClose: () => void) => void,
  deleteTask: (id: number, handleClose: () => void) => void,
}