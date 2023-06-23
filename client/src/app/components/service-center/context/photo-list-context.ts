import { createContext } from "react";
import { IPhotoList } from "../../../types/photo";

export const PhotoListContext = createContext<IPhotoList | null>(null);