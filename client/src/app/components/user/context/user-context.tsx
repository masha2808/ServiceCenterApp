import { createContext } from "react";
import { IUser } from "../../../types/user";

export const UserContext = createContext<IUser | null>(null);