import React, { useContext } from "react";
import { Typography, Modal, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { OrderListContext } from "../../service-center-management/context/order-list-context";
import { IOrderData } from "../../../types/order";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  order: IOrderData | null
}

const DeleteOrderModal = (props: PropTypes) => {
  const orderList = useContext(OrderListContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleDelete = () => {
    if (props?.order?.id) {
      orderList?.deleteOrder(props.order.id, handleClose);
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Видалення замовлення</Typography>
        { props.order && <div className="modal-delete">
          <Typography variant="body1" className="title">{ `Ви впевненні, що хочете видалити замовлення з номером ${props.order.number}?` }</Typography>
          <div className="delete-buttons">
            <Button variant="outlined" onClick={handleClose}>Скасувати</Button>
            <Button variant="contained" onClick={handleDelete}>Видалити</Button>
          </div>
        </div> }
      </div>
    </Modal>
  ); 
};

export default DeleteOrderModal;