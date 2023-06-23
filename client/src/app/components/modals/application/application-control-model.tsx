import React from "react";
import { Typography, Modal, IconButton, Grid, Chip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { IApplicationControlData } from "../../../types/application";
import constants from "../../../constants";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  application: IApplicationControlData
}

const ApplicationControlModal = (props: PropTypes) => {
  const status = constants.applicationStatusList.find(item => item.name === props.application?.status);

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
        { props.application && <div className="modal-info">
          <Grid container columns={3}>
            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Номер</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.number }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата створення</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ dayjs(props.application.dateTimeCreated).format("DD.MM.YYYY HH:mm") }</Typography>
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
              <Typography variant="body1">{ props.application.comment }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Тип об&apos;єкту</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.objectType }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Модель</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.model }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Опис</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.description }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Назва сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.name }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Адреса сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.cityName }, { props.application.address }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Email сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.email }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Телефон сервісного центру</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.application.phone }</Typography>
            </Grid>
          </Grid>
        </div> }
      </div>
    </Modal>
  ); 
};

export default ApplicationControlModal;