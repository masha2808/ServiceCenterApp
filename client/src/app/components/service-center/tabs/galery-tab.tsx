import React, { useContext } from "react";
import { ImageList, ImageListItem } from "@mui/material";
import { PhotoListContext } from "../context/photo-list-context";
import { getImageSrc } from "../../../helpers/image-helper";

const GaleryTab = () => {
  const photoList = useContext(PhotoListContext);

  return (
    <div className="tab-content">
      { photoList?.data?.photoList && <ImageList variant="masonry">
        { photoList.data.photoList.map(photoItem => 
          <ImageListItem key={photoItem.id}>
            <img src={getImageSrc(photoItem.photo)} />
          </ImageListItem>
        ) }
      </ImageList>
      }
    </div>
  ); 
};

export default GaleryTab;