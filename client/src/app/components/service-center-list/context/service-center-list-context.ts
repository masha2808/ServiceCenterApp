import { createContext } from "react";
import { IServiceCenterList } from "../../../types/service-center";

export const ServiceCenterListContext = createContext<IServiceCenterList | null>(null);