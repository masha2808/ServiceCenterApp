import { createContext } from "react";
import { IAlert } from "../../../types/alert";

export const AlertContext = createContext<IAlert | null>(null);