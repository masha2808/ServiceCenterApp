export interface IServiceCenterForm {
  name: string,
  shortDescription: string,
  description: string,
  cityId: number,
  categoryIdArray: Array<number>,
  email: string,
  phone: string,
  address: string,
  mapLatitude: number | null,
  mapLongitude: number | null,
  mainPhoto: Blob | null,
  photoList: Array<Blob> | null
}

export interface IServiceCenterData {
  id: number,
  name: string,
  shortDescription: string,
  description: string,
  cityId: number,
  cityName: string,
  categoryNameArray: Array<string>,
  categoryIdArray: Array<number>,
  email: string,
  phone: string,
  address: string,
  mapLatitude: number | null,
  mapLongitude: number | null,
  rating: number,
  mainPhoto: string | null,
}

export interface IServiceCenter {
  data: IServiceCenterData | null,
  loaded: boolean | null,
  getServiceCenter: () => void,
  getServiceCenterManagement: () => void,
  createServiceCenter: (data: FormData, handleClose: () => void) => void
  updateServiceCenter: (data: FormData, handleClose: () => void) => void
  deleteServiceCenter: (handleClose: () => void) => void
}

export interface IServiceCenterListData {
  serviceCenterList: Array<IServiceCenterData>
}

export interface IServiceCenterList {
  data: IServiceCenterListData | null,
  listServiceCenters: () => void
}