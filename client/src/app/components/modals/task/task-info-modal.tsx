import React from "react";
import { Typography, Modal, IconButton, Grid, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { ITaskData } from "../../../types/task";
import constants from "../../../constants";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  task: ITaskData | null,
}

const TaskInfoModal = (props: PropTypes) => {
  const status = constants.statusList.find(item => item.name === props.task?.statusName);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Деталі завдання</Typography>
        { props.task && <div className="modal-info">
          <Grid container columns={3}>
            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Номер</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.id }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Замовлення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.orderNumber }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Назва</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.name }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата створення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ dayjs(props.task.dateTimeCreated).format("DD.MM.YYYY HH:mm") }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Запланована дата завершення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.plannedDateCompleted ? dayjs(props.task.plannedDateCompleted).format("DD.MM.YYYY HH:mm") : null }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата завершення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.dateCompleted ? dayjs(props.task.dateCompleted).format("DD.MM.YYYY HH:mm") : null }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Статус</Typography>
            </Grid>
            <Grid item xs={2}>
              <Chip color={status?.color} label={status?.value} />
            </Grid>
            
            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Коментар</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.comment }</Typography>
            </Grid>
            
            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">ПІБ клієнта</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.lastName } { props.task.firstName } { props.task.middleName }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Email</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.email }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Телефон</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.phone }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Опис</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.task.description }</Typography>
            </Grid>
          </Grid>
        </div> }
      </div>
    </Modal>
  ); 
};

export default TaskInfoModal;