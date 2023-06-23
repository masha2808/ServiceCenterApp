import React, { useContext } from "react";
import { Typography } from "@mui/material";
import { UserContext } from "../user/context/user-context";
import ServiceCenterManagementData from "./service-center-management-data";
import { ServiceCenterLoader } from "../service-center/context/service-center-loader";
import { CategoryListLoader } from "../service-center/context/category-list-loader";
import { CityListLoader } from "../service-center/context/city-list-loader";
import "./styles.scss";

const ServiceCenterManagement = () => {
  const user = useContext(UserContext);

  return (
    <div className="service-center-management">
      { user?.loaded && (user?.data?.role === "administrator" || user?.data?.role === "employee") &&
        <ServiceCenterLoader serviceCenterId={null}>
          <CategoryListLoader>
            <CityListLoader>
              <ServiceCenterManagementData />
            </CityListLoader>
          </CategoryListLoader>
        </ServiceCenterLoader> }
      { user?.loaded === false && <div className="no-service-center">
        <Typography variant="h4">Немає прав доступу до сторінки</Typography>
      </div> }
    </div> 
  ); 
};

export default ServiceCenterManagement;