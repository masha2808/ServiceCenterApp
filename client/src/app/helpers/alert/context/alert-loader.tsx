import React, { useState, useEffect } from "react";
import { AlertContext } from "./alert-context";
import { IAlert } from "../../../types/alert";
import AlertMessage from "../alert-message";

interface Props {
  children: React.ReactNode;
}

export const AlertLoader: React.FC<Props> = (props) => {
  const [ message, setMessage ] = useState<string>("");
  const [ successful, setSuccessful ] = useState<boolean>(false);
  const [ isAlert, setIsAlert ] = useState<boolean>(false);

  const user: IAlert = {
    showAlertMessage: (message: string, successful: boolean) => {
      setIsAlert(true);
      setMessage(message);
      setSuccessful(successful);
      setTimeout(() => {
        setIsAlert(false);
      }, 5000);
    }
  };

  return (
    <AlertContext.Provider value={user}>
      { isAlert && <AlertMessage message={message} severity={successful ? "success" : "error"} setIsAlert={setIsAlert} /> }
      { props.children }
    </AlertContext.Provider>
  );
};