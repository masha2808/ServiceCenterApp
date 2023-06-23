import React, { useState } from "react";
import { Button, Typography, Chip } from "@mui/material";
import OrderControlModal from "../modals/order/order-control-model";
import { IOrderControlData } from "../../types/order";
import dayjs from "dayjs";
import constants from "../../constants";

type PropTypes = {
  order: IOrderControlData
}

const OrderControlCard = (props: PropTypes) => {
  const [ isOrderControlModalOpened, setIsOrderControlModalOpened ] = useState(false);

  const status = constants.statusList.find(item => item.name === props.order?.statusName);

  const handleDetailsClick = () => {
    setIsOrderControlModalOpened(!isOrderControlModalOpened);
  };

  return (
    <div className="control-card">
      <Typography variant="body1" fontWeight="bold" className="title">{ props.order.number }</Typography>
      <Typography variant="body2"><b>Сервісний центр:</b> { props.order.name }</Typography>
      <Typography variant="body2"><b>Дата створення:</b> { dayjs(props.order.dateTimeCreated).format("DD.MM.YYYY") }</Typography>
      <div><Chip color={status?.color} label={status?.value} /></div>
      <Button variant="contained" onClick={handleDetailsClick}>Деталі</Button>
      { isOrderControlModalOpened && 
        <OrderControlModal isOpened={isOrderControlModalOpened} setIsOpened={setIsOrderControlModalOpened} order={props.order} /> }
    </div>
  ); 
};

export default OrderControlCard;