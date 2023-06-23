import { createContext } from "react";
import { IApplicationList } from "../../../types/application";

export const ApplicationListContext = createContext<IApplicationList | null>(null);