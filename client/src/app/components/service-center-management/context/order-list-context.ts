import { createContext } from "react";
import { IOrderList } from "../../../types/order";

export const OrderListContext = createContext<IOrderList | null>(null);