import React from "react";
import ServiceCenterListData from "./service-center-list-data";
import "./styles.scss";
import { ServiceCenterListLoader } from "./context/service-center-list-loader";
import { CityListLoader } from "../service-center/context/city-list-loader";
import { CategoryListLoader } from "../service-center/context/category-list-loader";

const ServiceCenterList = () => {
  return (
    <ServiceCenterListLoader>
      <CategoryListLoader>
        <CityListLoader>
          <ServiceCenterListData />
        </CityListLoader>
      </CategoryListLoader>
    </ServiceCenterListLoader>
  ); 
};

export default ServiceCenterList;