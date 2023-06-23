import React from "react";
import { Typography, Modal, IconButton, Grid, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { IOrderControlData } from "../../../types/order";
import constants from "../../../constants";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  order: IOrderControlData
}

const OrderControlModal = (props: PropTypes) => {
  const status = constants.statusList.find(item => item.name === props.order?.statusName);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Деталі заяви</Typography>
        { props.order && <div className="modal-info">
          <Grid container columns={3}>
            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Номер</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.number }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Номер заяви</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.applicationNumber }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата створення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ dayjs(props.order.dateTimeCreated).format("DD.MM.YYYY HH:mm") }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Запланована дата завершення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.plannedDateCompleted ? dayjs(props.order.plannedDateCompleted).format("DD.MM.YYYY HH:mm") : null }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата завершення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.dateCompleted ? dayjs(props.order.dateCompleted).format("DD.MM.YYYY HH:mm") : null }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Вартість</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.price } грн</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Оплачено</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.payed ? "Так" : "Ні" }</Typography>
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
              <Typography variant="body1">{ props.order.comment }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Тип об&apos;єкту</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.objectType }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Модель</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.model }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Опис</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.description }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Назва сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.name }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Адреса сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.cityName }, { props.order.address }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Email сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.email }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Телефон сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.order.phone }</Typography>
            </Grid>
          </Grid>
        </div> }
      </div>
    </Modal>
  ); 
};

export default OrderControlModal;