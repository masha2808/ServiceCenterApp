import React, { useContext, useState } from "react";
import { Button, Tabs, Tab, Rating, Typography } from "@mui/material";
import { ServiceCenterContext } from "./context/service-center-context";
import { ResponseListLoader } from "./context/response-list-loader";
import { PhotoListLoader } from "./context/photo-list-loader";
import { getImageSrc } from "../../helpers/image-helper";
import CreateApplicationModal from "../modals/application/create-application-modal";
import DetailsTab from "./tabs/details-tab";
import GaleryTab from "./tabs/galery-tab";
import ResponseTab from "./tabs/response-tab";
import MapTab from "./tabs/map-tab";
import "./styles.scss";

const ServiceCenterData = () => {
  const [ isApplicationOpened, setIsApplicationOpened ] = useState(false);
  const [ activeTab, setActiveTab ] = useState<number>(0);

  const serviceCenter = useContext(ServiceCenterContext);

  const handleCreateApplicationClick = () => {
    setIsApplicationOpened(!isApplicationOpened);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getTabContent = (tab: number) => {
    switch(tab) {
    case 0: 
      return (
        <DetailsTab categoryNameArray={serviceCenter?.data?.categoryNameArray || null} description={serviceCenter?.data?.description || null} />
      );
    case 1: 
      return (
        <PhotoListLoader serviceCenterId={Number(serviceCenter?.data?.id)}>
          <GaleryTab />
        </PhotoListLoader>
      );
    case 2: 
      return (
        <ResponseListLoader serviceCenterId={Number(serviceCenter?.data?.id)}>
          <ResponseTab />
        </ResponseListLoader>
      );
    case 3: 
      return (
        (serviceCenter?.data?.mapLatitude && serviceCenter?.data?.mapLongitude && serviceCenter?.data?.name) &&
          <MapTab mapLatitude={serviceCenter?.data?.mapLatitude} mapLongitude={serviceCenter?.data?.mapLongitude} name={serviceCenter?.data?.name} />
      );
    default: 
      return "Unknown tab";
    }
  };
  
  return (
    <div className="service-center">
      { serviceCenter?.loaded &&
          <div>
            <div className="basic-info">
              <div className="service-center-info">
                { serviceCenter?.data?.mainPhoto ? 
                  <img src={getImageSrc(serviceCenter.data?.mainPhoto)} /> :
                  <img src="../no-photo-available.png" />
                }
                <div className="text-info">
                  <Typography variant="h4" fontWeight="bold">{ serviceCenter.data?.name }</Typography>
                  <Rating name="size-small" value={serviceCenter.data?.rating} readOnly className="rating" />
                  <div>
                    <Typography variant="body1" fontWeight="bold">м. { serviceCenter.data?.cityName }</Typography>
                    <Typography variant="body1">{ serviceCenter.data?.address }</Typography>
                  </div>
                  <div>
                    <Typography variant="body1"><b>Email:</b> { serviceCenter.data?.email }</Typography>
                    <Typography variant="body1"><b>Телефон:</b> { serviceCenter.data?.phone }</Typography>
                  </div>
                </div>
              </div>
              <Button className="button" variant="contained" onClick={handleCreateApplicationClick}>Створити заяву</Button>
              <Tabs variant="scrollable" allowScrollButtonsMobile value={activeTab} onChange={handleTabChange} className="tabs">
                <Tab label="Деталі" />
                <Tab label="Галерея" />
                <Tab label="Відгуки" />
                { (serviceCenter?.data?.mapLatitude && serviceCenter.data.mapLongitude) && <Tab label="Карта" /> }
              </Tabs>
            </div>
            { getTabContent(activeTab) }
          </div> }
      { isApplicationOpened && <CreateApplicationModal isOpened={isApplicationOpened} setIsOpened={setIsApplicationOpened} serviceCenterId={Number(serviceCenter?.data?.id)} /> }
      { serviceCenter?.loaded === false && <div className="no-service-center">
        <Typography variant="h4">Сервісний центр ще не створено</Typography>
      </div> }  
    </div>
  ); 
};

export default ServiceCenterData;