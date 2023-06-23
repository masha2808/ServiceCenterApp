import React, { useState, useEffect, useContext } from "react";
import { ApplicationListContext } from "./application-list-context";
import { IApplicationList, IApplicationListData, IApplicationUpdateForm } from "../../../types/application";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import applicationService from "../../../services/application-service";

interface Props {
  children: React.ReactNode;
}

export const ApplicationListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IApplicationListData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const alert = useContext(AlertContext);

  const applicationList: IApplicationList = {
    data,
    loaded,
    listApplications: async () => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        applicationService.listApplications(jwtToken)
          .then(response => {
            if (response.data) {
              setData(response.data);
              setLoaded(true);
            } else {
              setLoaded(false);
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      } else {
        setLoaded(false);
      }
    },
    updateApplication: (updatedData: IApplicationUpdateForm, id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        applicationService.updateApplication(updatedData, jwtToken, id)
          .then(response => {
            if (data) {
              const updatedApplicationList = data.applicationList.map(application => {
                if (application.id === response.data.id) {
                  return {
                    ...application,
                    status: response.data.status,
                    comment: response.data.comment
                  };
                } else {
                  return application;
                }
              });
              setData({ applicationList: updatedApplicationList });
              alert?.showAlertMessage("Заяву успішно оновлено", true);
              handleClose();
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    deleteApplication: (id: number, handleClose: (value: boolean) => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        applicationService.deleteApplication(jwtToken, id)
          .then(() => {
            if (data) {
              setData({ applicationList: data.applicationList.filter(application => application.id !== id) });
              alert?.showAlertMessage("Заяву успішно видалено", true);
              handleClose(true);
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
  };

  async function setInitialValue() {
    await applicationList.listApplications();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <ApplicationListContext.Provider value={applicationList}>
      { props.children }
    </ApplicationListContext.Provider>
  );
};