export interface IApplicationCreateForm {
  serviceCenterId: number,
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
  description: string
}

export interface IApplicationUpdateForm {
  status: string, 
  comment: string | null
}

export interface IApplicationGetByNumberForm {
  number: string,
}

export interface IApplicationControlData {
  id: number,
  number: string,
  dateTimeCreated: Date,
  status: string,
  comment: string | null,
  objectType: string,
  model: string | null,
  description: string,
  name: string,
  address: string,
  cityName: string,
  email: string,
  phone: string
}

export interface IApplicationClientList {
  applicationClientList: Array<IApplicationControlData>
}

export interface IApplicationData extends IApplicationCreateForm {
  id: number,
  number: string,
  dateTimeCreated: Date,
  status: string,
  comment: string | null,
  clientId: number | null,
  objectDataId: number
}

export interface IApplicationListData {
  applicationList: Array<IApplicationData>
}

export interface IApplicationList {
  data: IApplicationListData | null,
  loaded: boolean | null,
  listApplications: () => void,
  updateApplication: (data: IApplicationUpdateForm, id: number, handleClose: () => void) => void,
  deleteApplication: (id: number, handleClose: () => void) => void
}