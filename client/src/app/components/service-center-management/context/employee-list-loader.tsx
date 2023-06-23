import React, { useState, useEffect, useContext } from "react";
import { EmployeeListContext } from "./employee-list-context";
import { IEmployeeList, IEmployeeListData } from "../../../types/employee";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import employeeService from "../../../services/employee-service";

interface Props {
  children: React.ReactNode;
}

export const EmployeeListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IEmployeeListData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const alert = useContext(AlertContext);

  const employeeList: IEmployeeList = {
    data,
    loaded,
    listEmployees: () => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        employeeService.listEmployees(jwtToken)
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
    createEmployee: (formData: FormData, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        employeeService.createEmployee(formData, jwtToken)
          .then(response => {
            if (response.data) {
              if (data?.employeeList) {
                setData({ employeeList: [ ...data.employeeList, response.data ] });
              } else {
                setData({ employeeList: [ response.data ] });
              }
              alert?.showAlertMessage("Працівника успішно зареєстровано", true);
              handleClose();
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    updateEmployee: (formData: FormData, id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        employeeService.updateEmployee(formData, jwtToken, id)
          .then(response => {
            if (data) {
              const updatedList = data?.employeeList.map(employee => employee.id === response.data.id ? response.data : employee);
              setData({ employeeList: updatedList });
              alert?.showAlertMessage("Дані працівника успішно оновлено", true);
              handleClose();
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    deleteEmployee: (id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        employeeService.deleteEmployee(jwtToken, id)
          .then(response => {
            if (data) {
              const updatedList = data?.employeeList.filter(employee => employee.id !== response.data.id);
              setData({ employeeList: updatedList });
              alert?.showAlertMessage("Дані працівника успішно видалено", true);
              handleClose();
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
  };

  async function setInitialValue() {
    await employeeList.listEmployees();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <EmployeeListContext.Provider value={employeeList}>
      { props.children }
    </EmployeeListContext.Provider>
  );
};