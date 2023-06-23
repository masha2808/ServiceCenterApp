import React from "react";
import { useNavigate } from "react-router-dom";
import { Rating, Typography, Box } from "@mui/material";
import { IServiceCenterData } from "../../types/service-center";
import { getImageSrc } from "../../helpers/image-helper";
import "./styles.scss";

type PropTypes = {
  serviceCenter: IServiceCenterData
}

const ServiceCenterListItem = (props: PropTypes) => {
  const navigate = useNavigate();
  
  const handleServiceCenterClick = () => {
    navigate(`/service-center/${props.serviceCenter.id}`);
  };

  return (
    <Box className="service-center-list-item" onClick={handleServiceCenterClick}>
      { props.serviceCenter?.mainPhoto ? 
        <img src={getImageSrc(props.serviceCenter?.mainPhoto)} /> :
        <img src="../no-photo-available.png" />
      }
      <div className="info">
        <Typography variant="subtitle1" fontWeight="bold">
          { props.serviceCenter.name }
        </Typography>
        <Typography variant="subtitle2">
          { props.serviceCenter.cityName }, { props.serviceCenter.address }
        </Typography>
        <Rating name="size-small" value={props.serviceCenter.rating} readOnly className="rating" />
        <Typography variant="body2">
          { props.serviceCenter.shortDescription }
        </Typography>
      </div>
    </Box>
  ); 
};

export default ServiceCenterListItem;