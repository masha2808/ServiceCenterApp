import React, { useContext, useEffect, useState } from "react";
import { Typography, TextField, Modal, Button, FormLabel, IconButton, Select, MenuItem, Chip, SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ITaskData, ITaskUpdateForm } from "../../../types/task";
import { TaskListContext } from "../../service-center-management/context/task-list-context";
import constants from "../../../constants";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  task: ITaskData | null
}

const UpdateTaskAsEmployeeModal = (props: PropTypes) => {
  const [ status, setStatus ] = useState<string>();

  const taskList = useContext(TaskListContext);

  useEffect(() => {
    if (props.task) {
      setStatus(props.task.statusName);
    }
  }, [ props.task ]);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const validationSchema = Yup.object().shape({
    comment: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ITaskUpdateForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data: ITaskUpdateForm) => {
    if (status && props.task) {
      taskList?.updateTaskAsEmployee({ ...data, statusName: status }, props.task.id, handleClose);
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Редагування завдання</Typography>
        { props.task && <Typography variant="h5" className="title">{ `№ ${props.task.id}` }</Typography> }
        <div className="form-data">
          <div className="status-select">
            <FormLabel htmlFor="status">Статус</FormLabel>
            <Select
              id="status"
              variant="standard"
              value={status}
              defaultValue={props.task?.statusName}
              onChange={handleStatusChange}
            >
              { constants.statusList.map((status, index) => 
                <MenuItem value={status.name} key={index}>
                  <Chip color={status.color} label={status.value}/>
                </MenuItem>
              ) }
            </Select>
          </div>
          <TextField 
            id="comment" 
            label="Коментар" 
            type="text" 
            size="small" 
            variant="outlined" 
            defaultValue={props.task?.comment}
            multiline 
            minRows={3} 
            maxRows={10} 
            {...register("comment")}
            error={errors.comment ? true : false}
            className="multiline-text-field" 
          />
        </div>
        <div className="modal-buttons">
          <Button id="create" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зберегти</Button> 
        </div>
      </div>
    </Modal>
  ); 
};

export default UpdateTaskAsEmployeeModal;