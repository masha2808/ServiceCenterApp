import { createContext } from "react";
import { ITaskList } from "../../../types/task";

export const TaskListContext = createContext<ITaskList | null>(null);