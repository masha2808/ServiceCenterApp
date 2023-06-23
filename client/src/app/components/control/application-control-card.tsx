import React, { useState } from "react";
import { Button, Typography, Chip } from "@mui/material";
import ApplicationControlModal from "../modals/application/application-control-model";
import { IApplicationControlData } from "../../types/application";
import dayjs from "dayjs";
import constants from "../../constants";

type PropTypes = {
  application: IApplicationControlData
}

const ApplicationControlCard = (props: PropTypes) => {
  const [ isApplicationControlModalOpened, setIsApplicationControlModalOpened ] = useState(false);

  const status = constants.applicationStatusList.find(item => item.name === props.application?.status);

  const handleDetailsClick = () => {
    setIsApplicationControlModalOpened(!isApplicationControlModalOpened);
  };

  return (
    <div className="control-card">
      <Typography variant="body1" fontWeight="bold" className="title">{ props.application.number }</Typography>
      <Typography variant="body2"><b>Сервісний центр:</b> { props.application.name }</Typography>
      <Typography variant="body2"><b>Дата створення:</b> { dayjs(props.application.dateTimeCreated).format("DD.MM.YYYY") }</Typography>
      <div><Chip color={status?.color} label={status?.value} /></div>
      <Button variant="contained" onClick={handleDetailsClick}>Деталі</Button>
      { isApplicationControlModalOpened && 
        <ApplicationControlModal isOpened={isApplicationControlModalOpened} setIsOpened={setIsApplicationControlModalOpened} application={props.application} /> }
    </div>
  ); 
};

export default ApplicationControlCard;