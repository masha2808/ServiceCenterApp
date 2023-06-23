export interface ICityData {
  id: number,
  name: string
}

export interface ICityListData {
  cityList: Array<ICityData>
}

export interface ICityList {
  data: ICityListData | null,
  loaded: boolean | null,
  listCities: () => void
}