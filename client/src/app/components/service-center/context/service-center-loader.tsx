import React, { useState, useEffect, useContext } from "react";
import { ServiceCenterContext } from "./service-center-context";
import { IServiceCenter, IServiceCenterData } from "../../../types/service-center";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import serviceCenterService from "../../../services/service-center-service";

interface Props {
  children: React.ReactNode;
  serviceCenterId: number | null
}

export const ServiceCenterLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IServiceCenterData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const alert = useContext(AlertContext);

  const serviceCenter: IServiceCenter = {
    data,
    loaded,
    getServiceCenterManagement: async () => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        serviceCenterService.getServiceCenterManagement(jwtToken)
          .then(response => {
            setData(response.data);
            setLoaded(true);
          })
          .catch(() => setLoaded(false));
      } else {
        setLoaded(false);
      }
    },
    getServiceCenter: async () => {
      if (props.serviceCenterId) {
        serviceCenterService.getServiceCenter(props.serviceCenterId)
          .then(response => {
            setData(response.data);
            setLoaded(true);
          })
          .catch(() => setLoaded(false));
      } else {
        setLoaded(false);
      }
    },
    createServiceCenter: (data: FormData, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        serviceCenterService.createServiceCenter(jwtToken, data)
          .then(response => {
            setData(response.data);
            setLoaded(true);
            alert?.showAlertMessage("Сервісний центр успішно створено", true);
            handleClose();
          })
          .catch(e => {
            setLoaded(false);
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    updateServiceCenter: (data: FormData, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        serviceCenterService.updateServiceCenter(jwtToken, data)
          .then(response => {
            setData(response.data);
            setLoaded(true);
            alert?.showAlertMessage("Сервісний центр успішно оновлено", true);
            handleClose();
          })
          .catch(e => {
            setLoaded(false);
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    deleteServiceCenter: (handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        serviceCenterService.deleteServiceCenter(jwtToken)
          .then(() => {
            setData(null);
            handleClose();
            alert?.showAlertMessage("Сервісний центр успішно видалено", true);
            setLoaded(false);
          })
          .catch(e => {
            setLoaded(false);
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    }
  };

  async function setInitialValue() {
    if (props.serviceCenterId) {
      await serviceCenter.getServiceCenter();
    } else {
      await serviceCenter.getServiceCenterManagement();
    }
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <ServiceCenterContext.Provider value={serviceCenter}>
      { props.children }
    </ServiceCenterContext.Provider>
  );
};