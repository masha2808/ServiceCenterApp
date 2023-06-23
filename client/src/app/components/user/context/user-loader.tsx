import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./user-context";
import { IUser, IUserData } from "../../../types/user";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import userService from "../../../services/user-service";

interface Props {
  children: React.ReactNode;
}

export const UserLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IUserData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const alert = useContext(AlertContext);
  
  const user: IUser = {
    data,
    loaded,
    getUser: () => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        userService.getUser(jwtToken)
          .then(response => {
            if (response.data) {
              setData(response.data);
              setLoaded(true);
            } else {
              setLoaded(false);
            }
          });
      } else {
        setLoaded(false);
        setData(null);
      }
    },
    updateUser: (data: FormData, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        userService.updateUser(data, jwtToken)
          .then(response => {
            setData(response.data);
            alert?.showAlertMessage("Дані було успішно оновлено", true);
            handleClose();
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    }
  };

  async function setInitialValue() {
    await user.getUser();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <UserContext.Provider value={user}>
      { props.children }
    </UserContext.Provider>
  );
};