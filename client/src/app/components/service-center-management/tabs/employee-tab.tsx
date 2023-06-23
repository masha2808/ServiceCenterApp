import React, { useState, useContext } from "react";
import { Grid, Typography, Button, Avatar } from "@mui/material";
import CreateEmployeeModal from "../../modals/employee/create-employee-modal";
import UpdateEmployeeModal from "../../modals/employee/update-employee-modal";
import EmployeeInfoModal from "../../modals/employee/employee-info-modal";
import DeleteEmployeeModal from "../../modals/employee/delete-employee-modal";
import { EmployeeListContext } from "../context/employee-list-context";
import { UserContext } from "../../user/context/user-context";
import { IUserData } from "../../../types/user";
import { getImageSrc } from "../../../helpers/image-helper";
import "../styles.scss";

const EmployeenTab = () => {
  const [ employeeData, setEmployeeData ] = useState<IUserData | null>(null);
  const [ isCreateEmployeeModalOpened, setIsCreateEmployeeModalOpened ] = useState(false);
  const [ isUpdateEmployeeModalOpened, setIsUpdateEmployeeModalOpened ] = useState(false);
  const [ isDeleteEmployeeModalOpened, setIsDeleteEmployeeModalOpened ] = useState(false);
  const [ isEmployeeInfoModalOpened, setIsEmployeeInfoModalOpened ] = useState(false);

  const employeeList = useContext(EmployeeListContext);
  const user = useContext(UserContext);

  const handleUpdateClick = (employee: IUserData) => {
    setIsUpdateEmployeeModalOpened(!isUpdateEmployeeModalOpened);
    setEmployeeData(employee);
  };

  const handleDeleteClick = (employee: IUserData) => {
    setIsDeleteEmployeeModalOpened(!isUpdateEmployeeModalOpened);
    setEmployeeData(employee);
  };

  const handleDetailClick = (employee: IUserData) => {
    setIsEmployeeInfoModalOpened(!isEmployeeInfoModalOpened);
    setEmployeeData(employee);
  };

  const handleCreateClick = () => {
    setIsCreateEmployeeModalOpened(!isCreateEmployeeModalOpened);
  };

  return (
    <div className="tab-content">
      { user?.data?.role === "administrator" && <Button variant="contained" onClick={handleCreateClick} className="tab-button">Зареєструвати працівника</Button> }
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 6, sm: 9, md: 12 }}>
        { employeeList?.data?.employeeList.map(employee => (
          <Grid item xs={3} sm={3} md={3} key={employee.id}>
            <div className="employee-card">
              <Avatar src={getImageSrc(employee.photo)} className="avatar" />
              <Typography variant="body1" fontWeight="bold" className="title">
                { employee.lastName } { employee.firstName } { employee.middleName }
              </Typography>
              <div>
                <Typography variant="body2">{ employee.position }</Typography>
                <Typography variant="body2">{ employee.email }</Typography>
                <Typography variant="body2">{ employee.phone }</Typography>
              </div>
              <Button variant="contained" onClick={() => handleDetailClick(employee)}>Деталі</Button>
              { user?.data?.role === "administrator" && <Button variant="outlined" onClick={() => handleUpdateClick(employee)}>Редагувати</Button> }
              { user?.data?.role === "administrator" && <Button variant="outlined" onClick={() => handleDeleteClick(employee)}>Видалити</Button> }
            </div>
          </Grid>
        )) }
      </Grid> 
      { isCreateEmployeeModalOpened && <CreateEmployeeModal isOpened={isCreateEmployeeModalOpened} setIsOpened={setIsCreateEmployeeModalOpened} /> }
      { isUpdateEmployeeModalOpened && <UpdateEmployeeModal isOpened={isUpdateEmployeeModalOpened} setIsOpened={setIsUpdateEmployeeModalOpened} employee={employeeData} /> }
      { isDeleteEmployeeModalOpened && <DeleteEmployeeModal isOpened={isDeleteEmployeeModalOpened} setIsOpened={setIsDeleteEmployeeModalOpened} employee={employeeData} /> }
      { isEmployeeInfoModalOpened && <EmployeeInfoModal isOpened={isEmployeeInfoModalOpened} setIsOpened={setIsEmployeeInfoModalOpened} employee={employeeData} /> }
    </div>
  ); 
};

export default EmployeenTab;