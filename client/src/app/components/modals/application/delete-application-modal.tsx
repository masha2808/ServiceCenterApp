import React, { useContext } from "react";
import { Typography, Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ApplicationListContext } from "../../service-center-management/context/application-list-context";
import { IApplicationData } from "../../../types/application";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  application: IApplicationData | null
}

const DeleteApplicationModal = (props: PropTypes) => {
  const applicationList = useContext(ApplicationListContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleDelete = async () => {
    if (props?.application?.id) {
      applicationList?.deleteApplication(props.application.id, handleClose);
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Видалення заяви</Typography>
        { props.application && <div className="modal-delete">
          <Typography variant="body1" className="title">Ви впевненні, що хочете видалити заяву</Typography>
          <Typography variant="body1" className="title">{ `№ ${props.application.number}?` }</Typography>
          <div className="delete-buttons">
            <Button variant="outlined" onClick={handleClose}>Скасувати</Button>
            <Button variant="contained" onClick={handleDelete}>Видалити</Button>
          </div>
        </div> }
      </div>
    </Modal>
  ); 
};

export default DeleteApplicationModal;