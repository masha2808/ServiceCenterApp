import { createContext } from "react";
import { ICityList } from "../../../types/city";

export const CityListContext = createContext<ICityList | null>(null);