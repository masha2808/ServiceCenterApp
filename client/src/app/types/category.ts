export interface ICategoryData {
  id: number,
  name: string
}

export interface ICategoryListData {
  categoryList: Array<ICategoryData>
}

export interface ICategoryList {
  data: ICategoryListData | null,
  loaded: boolean | null,
  listCategories: () => void
}