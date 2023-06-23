export interface IResponseForm {
  rating: number,
  text: string
}

export interface IResponseData {
  rating: number,
  text: string,
  serviceCenterId: number
}

export interface IResponseListDataItem extends IResponseData {
  id: number,
  date: Date,
  firstName: string,
  lastName: string,
  middleName: string | null,
  photo: string | null
}

export interface IResponseListData {
  responseList: Array<IResponseListDataItem>
}

export interface IResponseList {
  data: IResponseListData | null,
  createResponse: (data: IResponseData) => void,
  listResponsesByServiceCenterId: () => void
}