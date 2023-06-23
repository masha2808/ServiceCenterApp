import React, { useState, useEffect } from "react";
import { ServiceCenterListContext } from "./service-center-list-context";
import { IServiceCenterList, IServiceCenterListData } from "../../../types/service-center";
import serviceCenterService from "../../../services/service-center-service";

interface Props {
  children: React.ReactNode;
}

export const ServiceCenterListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IServiceCenterListData | null>(null);

  const serviceCenterList: IServiceCenterList = {
    data,
    listServiceCenters: async () => {
      serviceCenterService.listServiceCenters()
        .then(response => {
          setData(response.data);
        });
    }
  };

  async function setInitialValue() {
    await serviceCenterList.listServiceCenters();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <ServiceCenterListContext.Provider value={serviceCenterList}>
      { props.children }
    </ServiceCenterListContext.Provider>
  );
};