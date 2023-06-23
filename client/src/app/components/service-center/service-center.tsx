import React from "react";
import { useParams } from "react-router-dom";
import { UserLoader } from "../user/context/user-loader";
import { ServiceCenterLoader } from "./context/service-center-loader";
import ServiceCenterData from "./service-center-data";
import "./styles.scss";

const ServiceCenter = () => {
  const { id } = useParams();
  
  return (
    <UserLoader>
      <ServiceCenterLoader serviceCenterId={Number(id)}>
        <ServiceCenterData />
      </ServiceCenterLoader>
    </UserLoader>
  ); 
};

export default ServiceCenter;