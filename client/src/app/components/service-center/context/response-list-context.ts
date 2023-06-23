import { createContext } from "react";
import { IResponseList } from "../../../types/response";

export const ResponseListContext = createContext<IResponseList | null>(null);