import React, { useContext } from "react";
import { Typography, Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import serviceCenterService from "../../../services/service-center-service";
import { ServiceCenterContext } from "../../service-center/context/service-center-context";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
}

const DeleteServiceCenterModal = (props: PropTypes) => {
  const serviceCenter = useContext(ServiceCenterContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleDelete = () => {
    serviceCenter?.deleteServiceCenter(handleClose);
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Видалення сервісного центру</Typography>
        { serviceCenter?.data && <div className="modal-delete">
          <Typography variant="body1" className="title">{ "Ви впевненні, що хочете видалити сервісний центр та усі його дані?" }</Typography>
          <div className="delete-buttons">
            <Button variant="outlined" onClick={handleClose}>Скасувати</Button>
            <Button variant="contained" onClick={handleDelete}>Видалити</Button>
          </div>
        </div> }
      </div>
    </Modal>
  ); 
};

export default DeleteServiceCenterModal;