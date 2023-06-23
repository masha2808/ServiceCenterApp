import React, { useContext } from "react";
import { Typography, Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { EmployeeListContext } from "../../service-center-management/context/employee-list-context";
import { IUserData } from "../../../types/user";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  employee: IUserData | null
}

const DeleteEmployeeModal = (props: PropTypes) => {
  const employeeList = useContext(EmployeeListContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleDelete = async () => {
    if (props?.employee?.id) {
      employeeList?.deleteEmployee(props.employee.id, handleClose);
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Видалення даних працівника</Typography>
        { props.employee && <div className="modal-delete">
          <Typography variant="body1" className="title">Ви впевненні, що хочете видалити дані працівника з ПІБ</Typography>
          <Typography variant="body1" className="title">{ `${props.employee?.lastName} ${props.employee?.firstName} ${props.employee?.middleName}?` }</Typography>
          <Typography variant="body1" className="title">Усі створенні для працівника завдання також будуть видалені.</Typography>
          <div className="delete-buttons">
            <Button variant="outlined" onClick={handleClose}>Скасувати</Button>
            <Button variant="contained" onClick={handleDelete}>Видалити</Button>
          </div>
        </div> }
      </div>
    </Modal>
  ); 
};

export default DeleteEmployeeModal;