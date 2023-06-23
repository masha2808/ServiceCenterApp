import { createContext } from "react";
import { IServiceCenter } from "../../../types/service-center";

export const ServiceCenterContext = createContext<IServiceCenter | null>(null);