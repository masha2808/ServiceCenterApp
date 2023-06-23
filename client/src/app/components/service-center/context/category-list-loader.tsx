import React, { useState, useEffect } from "react";
import { CategoryListContext } from "./category-list-context";
import { ICategoryList, ICategoryListData } from "../../../types/category";
import categoryService from "../../../services/category-service";

interface Props {
  children: React.ReactNode;
}

export const CategoryListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<ICategoryListData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const categoryList: ICategoryList = {
    data,
    loaded,
    listCategories: () => {
      categoryService.listCategories()
        .then(response => {
          setData(response.data);
          setLoaded(true);
        })
        .catch(() => setLoaded(false));
    }
  };

  async function setInitialValue() {
    await categoryList.listCategories();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <CategoryListContext.Provider value={categoryList}>
      { props.children }
    </CategoryListContext.Provider>
  );
};