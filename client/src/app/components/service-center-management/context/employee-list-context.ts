import { createContext } from "react";
import { IEmployeeList } from "../../../types/employee";

export const EmployeeListContext = createContext<IEmployeeList | null>(null);