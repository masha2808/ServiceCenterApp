export interface IOrderCreateForm {
  applicationId: number | null,
  lastName: string,
  firstName: string,
  middleName: string | null,
  phone: string,
  email: string,
  objectType: string,
  model: string | null,
  deliveryToServiceCenter: boolean,
  deliveryFromServiceCenter: boolean,
  address: string | null,
  description: string,
  plannedDateCompleted: Date | null,
  price: number,
  clientId: number | null
}

export interface IOrderUpdateForm {
  lastName: string,
  firstName: string,
  middleName: string | null,
  phone: string,
  email: string,
  objectType: string,
  model: string | null,
  deliveryToServiceCenter: boolean,
  deliveryFromServiceCenter: boolean,
  address: string | null,
  description: string,
  plannedDateCompleted: Date | null,
  dateCompleted: Date | null,
  price: number,
  payed: boolean,
  statusName: string,
  comment: string | null,
}

export interface IOrderData extends IOrderCreateForm {
  id: number,
  number: string,
  dateTimeCreated: Date,
  dateCompleted: Date | null,
  statusName: string,
  comment: string | null,
  payed: boolean,
  applicationNumber: string | null
}

export interface IOrderGetByNumberForm {
  number: string,
}

export interface IOrderControlData {
  id: number,
  number: string,
  dateTimeCreated: Date,
  plannedDateCompleted: Date | null,
  dateCompleted: Date | null,
  statusName: string,
  comment: string | null,
  price: number,
  payed: boolean,
  applicationNumber: string | null
  objectType: string,
  model: string | null,
  description: string,
  name: string,
  address: string,
  cityName: string,
  email: string,
  phone: string
}

export interface IOrderClientList {
  orderClientList: Array<IOrderControlData>
}

export interface IOrderListData {
  orderList: Array<IOrderData>
}

export interface IOrderList {
  data: IOrderListData | null,
  loaded: boolean | null,
  listOrders: () => void,
  createOrder: (formData: IOrderCreateForm, handleClose: () => void) => void,
  updateOrder: (updatedData: IOrderUpdateForm, id: number, handleClose: () => void) => void,
  deleteOrder: (id: number, handleClose: () => void) => void
}