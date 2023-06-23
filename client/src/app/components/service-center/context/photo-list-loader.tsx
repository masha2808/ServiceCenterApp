import React, { useState, useEffect } from "react";
import { PhotoListContext } from "./photo-list-context";
import { IPhotoList, IPhotoListData } from "../../../types/photo";
import photoService from "../../../services/photo-service";

interface Props {
  children: React.ReactNode;
  serviceCenterId: number;
}

export const PhotoListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IPhotoListData | null>(null);

  const photoList: IPhotoList = {
    data,
    listPhotosByServiceCenterId: () => {
      photoService.listPhotosByServiceCenterId(props.serviceCenterId)
        .then(response => {
          setData(response.data);
        });
    }
  };

  function setInitialValue() {
    photoList.listPhotosByServiceCenterId();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <PhotoListContext.Provider value={photoList}>
      { props.children }
    </PhotoListContext.Provider>
  );
};