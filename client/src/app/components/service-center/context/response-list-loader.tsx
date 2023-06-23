import React, { useState, useEffect, useContext } from "react";
import { ResponseListContext } from "./response-list-context";
import responseService from "../../../services/response-service";
import { IResponseListData, IResponseList, IResponseForm } from "../../../types/response";
import { AlertContext } from "../../../helpers/alert/context/alert-context";

interface Props {
  children: React.ReactNode;
  serviceCenterId: number;
}

export const ResponseListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IResponseListData | null>(null);

  const alert = useContext(AlertContext);

  const responseList: IResponseList = {
    data,
    createResponse: (data: IResponseForm) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        responseService.createResponse(jwtToken, { ...data, serviceCenterId: props.serviceCenterId })
          .then(response => {
            setData(response.data);
            alert?.showAlertMessage("Відгук успішно додано", true);
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    listResponsesByServiceCenterId: () => {
      responseService.listResponsesByServiceCenterId(props.serviceCenterId)
        .then(response => {
          setData(response.data);
        });
    },
  };

  function setInitialValue() {
    responseList.listResponsesByServiceCenterId();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <ResponseListContext.Provider value={responseList}>
      { props.children }
    </ResponseListContext.Provider>
  );
};