import React, { useState, useContext, useEffect } from "react";
import { Tabs, Tab, Typography, Button } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ukUA } from "@mui/material/locale";
import ApplicationTab from "./tabs/application-tab";
import OrderTab from "./tabs/order-tab";
import TaskTab from "./tabs/task-tab";
import EmployeenTab from "./tabs/employee-tab";
import CreateServiceCenterModal from "../modals/service-center/create-service-center-modal";
import UpdateServiceCenterModal from "../modals/service-center/update-service-center-modal";
import DeleteServiceCenterModal from "../modals/service-center/delete-service-center-modal";
import serviceCenterService from "../../services/service-center-service";
import { ApplicationListLoader } from "./context/application-list-loader";
import { OrderListLoader } from "./context/order-list-loader";
import { PhotoListLoader } from "../service-center/context/photo-list-loader";
import { UserContext } from "../user/context/user-context";
import { ServiceCenterContext } from "../service-center/context/service-center-context";
import { IUserData } from "../../types/user";
import { getImageSrc } from "../../helpers/image-helper";
import { EmployeeListLoader } from "./context/employee-list-loader";
import { TaskListLoader } from "./context/task-list-loader";
import "./styles.scss";

const ServiceCenterManagementData = () => {
  const [ activeTab, setActiveTab ] = useState<number>(0);
  const [ isCreateServiceCenterModalOpened, setIsCreateServiceCenterModalOpened ] = useState(false);
  const [ isUpdateServiceCenterModalOpened, setIsUpdateServiceCenterModalOpened ] = useState(false);
  const [ isDeleteServiceCenterModalOpened, setIsDeleteServiceCenterModalOpened ] = useState(false);
  const [ administrator, setAdministrator ] = useState<IUserData | null>(null);

  const serviceCenter = useContext(ServiceCenterContext);
  const user = useContext(UserContext);

  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken && serviceCenter?.data) {
      serviceCenterService.getServiceCenterAdministratorData(jwtToken, serviceCenter.data.id)
        .then(response => {
          if (response.data) {
            setAdministrator(response.data);
          }
        });
    }
  }, [ serviceCenter?.data ]);

  const handleCreateServiceCenterClick = () => {
    setIsCreateServiceCenterModalOpened(!isCreateServiceCenterModalOpened);
  };

  const handleUpdateServiceCenterClick = () => {
    setIsUpdateServiceCenterModalOpened(!isUpdateServiceCenterModalOpened);
  };

  const handleDeleteServiceCenterClick = () => {
    setIsDeleteServiceCenterModalOpened(!isDeleteServiceCenterModalOpened);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTabContent = (tab: number) => {
    switch(tab) {
    case 0: 
      return (
        <ApplicationListLoader>
          <ApplicationTab />
        </ApplicationListLoader>
      );
    case 1: 
      return (
        <OrderListLoader>
          <EmployeeListLoader>
            <OrderTab />
          </EmployeeListLoader>
        </OrderListLoader>
      );
    case 2: 
      return (
        <TaskListLoader>
          <EmployeeListLoader>
            <TaskTab />
          </EmployeeListLoader>
        </TaskListLoader>
      );
    case 3: 
      return (
        <EmployeeListLoader>
          <EmployeenTab />
        </EmployeeListLoader>
      );
    default: 
      return "Unknown tab";
    }
  };

  return (
    <div className="service-center-management">
      { serviceCenter?.loaded &&
          <div>
            <div className="basic-info">
              <div className="service-center-info">
                { serviceCenter?.data?.mainPhoto ? 
                  <img src={getImageSrc(serviceCenter?.data?.mainPhoto)} /> :
                  <img src="../no-photo-available.png" />
                }
                <div className="text-info">
                  <Typography variant="h4" fontWeight="bold">{ serviceCenter.data?.name }</Typography>
                  <Typography variant="body1" fontWeight="bold">м. { serviceCenter.data?.cityName }</Typography>
                  <div className="administrator-info">
                    <div>
                      <Typography variant="body1" fontWeight="bold">Адміністратор:</Typography>
                      <Typography variant="body1">{ administrator?.lastName } { administrator?.firstName } { administrator?.middleName }</Typography>
                      <Typography variant="body1">{ administrator?.email }</Typography>
                      <Typography variant="body1">{ administrator?.phone }</Typography>
                    </div>
                  </div>
                </div>
              </div>
              { user?.data?.role === "administrator" && <div className="management-buttons">
                <Button className="button" variant="contained" onClick={handleUpdateServiceCenterClick}>Редагувати</Button>
                <Button className="button" variant="outlined" onClick={handleDeleteServiceCenterClick}>Видалити</Button>
              </div> }
              <Tabs variant="scrollable" allowScrollButtonsMobile value={activeTab} onChange={handleTabChange} className="tabs">
                <Tab label="Заяви" />
                <Tab label="Замовлення" />
                <Tab label="Завдання" />
                <Tab label="Працівники" />
              </Tabs>
            </div>
            <ThemeProvider theme={createTheme(ukUA)}>
              { getTabContent(activeTab) }
            </ThemeProvider>
            { isUpdateServiceCenterModalOpened && 
              <PhotoListLoader serviceCenterId={Number(serviceCenter?.data?.id)}>
                <UpdateServiceCenterModal isOpened={isUpdateServiceCenterModalOpened} setIsOpened={setIsUpdateServiceCenterModalOpened} serviceCenter={serviceCenter} />
              </PhotoListLoader> }
            { isDeleteServiceCenterModalOpened && <DeleteServiceCenterModal isOpened={isDeleteServiceCenterModalOpened} setIsOpened={setIsDeleteServiceCenterModalOpened}/> }
          </div> }
      { serviceCenter?.loaded === false && <div className="no-service-center">
        <Typography variant="h4">Сервісний центр ще не створено</Typography>
        <Button variant="contained" onClick={handleCreateServiceCenterClick}>Створити сервісний центр</Button>
        <CreateServiceCenterModal isOpened={isCreateServiceCenterModalOpened} setIsOpened={setIsCreateServiceCenterModalOpened} />
      </div> }
    </div> 
  ); 
};

export default ServiceCenterManagementData;