import { createContext } from "react";
import { ICategoryList } from "../../../types/category";

export const CategoryListContext = createContext<ICategoryList | null>(null);