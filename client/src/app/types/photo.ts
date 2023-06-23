export interface IPhotoData {
  id: number,
  photo: string,
  serviceCenterId: number
}

export interface IPhotoListData {
  photoList: Array<IPhotoData>
}

export interface IPhotoList {
  data: IPhotoListData | null,
  listPhotosByServiceCenterId: () => void
}