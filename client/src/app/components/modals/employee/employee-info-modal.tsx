import React from "react";
import { Typography, Modal, IconButton, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { IUserData } from "../../../types/user";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  employee: IUserData | null
}

const EmployeeInfoModal = (props: PropTypes) => {
  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Деталі про працівнка</Typography>
        { props.employee && <div className="modal-info">
          <Grid container columns={3}>
            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">ПІБ</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.employee.lastName } { props.employee.firstName } { props.employee.middleName }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата народження</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ dayjs(props.employee.dateOfBirth).format("DD.MM.YYYY") }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Email</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.employee.email }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Телефон</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.employee.phone }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Посада</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ props.employee.position }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата початку співпраці</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ dayjs(props.employee.cooperationStartDate).format("DD.MM.YYYY") }</Typography>
            </Grid>

            <Grid item xs={1}>
              <Typography variant="body1" fontWeight="bold">Дата завершення співпраці</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">{ dayjs(props.employee.cooperationEndDate).format("DD.MM.YYYY") }</Typography>
            </Grid>
          </Grid>
        </div> }
      </div>
    </Modal>
  ); 
};

export default EmployeeInfoModal;