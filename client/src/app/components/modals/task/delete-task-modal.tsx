import React, { useContext } from "react";
import { Typography, Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ITaskData } from "../../../types/task";
import { TaskListContext } from "../../service-center-management/context/task-list-context";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  task: ITaskData | null
}

const DeleteTaskModal = (props: PropTypes) => {
  const taskList = useContext(TaskListContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleDelete = () => {
    if (props.task) {
      taskList?.deleteTask(props.task.id, handleClose);
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Видалення завдання</Typography>
        { props.task && <div className="modal-delete">
          <Typography variant="body1" className="title">{ `Ви впевненні, що хочете видалити завдання з номером ${props.task.id}?` }</Typography>
          <div className="delete-buttons">
            <Button variant="outlined" onClick={handleClose}>Скасувати</Button>
            <Button variant="contained" onClick={handleDelete}>Видалити</Button>
          </div>
        </div> }
      </div>
    </Modal>
  ); 
};

export default DeleteTaskModal;