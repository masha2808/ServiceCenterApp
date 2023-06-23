import React, { useState, useEffect, useContext } from "react";
import { OrderListContext } from "./order-list-context";
import { IOrderCreateForm, IOrderList, IOrderListData, IOrderUpdateForm } from "../../../types/order";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import orderService from "../../../services/order-service";

interface Props {
  children: React.ReactNode;
}

export const OrderListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<IOrderListData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const alert = useContext(AlertContext);

  const orderList: IOrderList = {
    data,
    loaded,
    listOrders: async () => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        orderService.listOrders(jwtToken)
          .then(response => {
            if (response.data) {
              setData(response.data);
              setLoaded(true);
            } else {
              setLoaded(false);
            }
          });
      } else {
        setLoaded(false);
      }
    },
    createOrder: async (formData: IOrderCreateForm, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        orderService.createOrder(formData, jwtToken)
          .then(response => {
            if (data?.orderList) {
              setData({ orderList: [ ...data.orderList, response.data ] });
            } else {
              setData({ orderList: [ response.data ] });
            }
            alert?.showAlertMessage("Замвлення успішно створено", true);
            handleClose();
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    updateOrder: (updatedData: IOrderUpdateForm, id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        orderService.updateOrder(updatedData, jwtToken, id)
          .then(response => {
            if (data) {
              const updatedOrderList = data.orderList.map(order => order.id === response.data.id ? response.data : order);
              setData({ orderList: updatedOrderList });
              alert?.showAlertMessage("Замвлення успішно оновлено", true);
              handleClose();
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    deleteOrder: (id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        orderService.deleteOrder(jwtToken, id)
          .then(() => {
            if (data) {
              setData({ orderList: data.orderList.filter(order => order.id !== id) });
              alert?.showAlertMessage("Замвлення успішно видалено", true);
              handleClose();
            }
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
  };

  async function setInitialValue() {
    await orderList.listOrders();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <OrderListContext.Provider value={orderList}>
      { props.children }
    </OrderListContext.Provider>
  );
};