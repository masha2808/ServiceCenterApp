import React, { useContext, useEffect, useState } from "react";
import { TextField, Button, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IOrderClientList, IOrderControlData, IOrderGetByNumberForm } from "../../types/order";
import { UserContext } from "../user/context/user-context";
import OrderControlCard from "./order-control-card";
import orderService from "../../services/order-service";
import "./styles.scss";

const OrderControl = () => {
  const user = useContext(UserContext);
  const [ orderClientList, setOrderClientList ] = useState<IOrderClientList | null>(null);
  const [ order, setOrder ] = useState<IOrderControlData | null>(null);
  const [ searchResult, setSearchResult ] = useState<boolean>(false);

  useEffect(() => {
    if (!orderClientList) {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        orderService.listClientOrders(jwtToken)
          .then(response => {
            if (response.data) {
              setOrderClientList(response.data);
            }
          });
      }
    }
  }, []);

  const validationSchema = Yup.object().shape({
    number: Yup.string().matches(/[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}/).required()
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IOrderGetByNumberForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: IOrderGetByNumberForm) => {
    orderService.getOrderByNumber(data.number)
      .then(response => {
        if (response.data) {
          setSearchResult(true);
          setOrder(response.data);
        }
      })
      .catch(() => {
        setSearchResult(true);
        setOrder(null);
      });
  };

  return (
    <div className="control">
      <Typography variant="h5" fontWeight="bold">Перевірити замовлення за номером</Typography>
      <div>
        <div className="check-field">
          <TextField 
            id="number" 
            placeholder="Номер заяви (xxxx-xxxx-xxxx-xxxx)" 
            type="text" 
            variant="standard"
            {...register("number")}
            error={errors.number ? true : false}
            className="text-field" 
          />
          <div className="modal-buttons">
            <Button id="save" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Перевірити</Button> 
          </div>
        </div>
        <Typography variant="body2" color="error" fontSize={12}>
          { errors.number?.message?.toString() }
        </Typography>
      </div>
      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 3, sm: 6, md: 9 }}>
        { (order && searchResult) && <Grid item xs={3} sm={3} md={3}>
          <OrderControlCard order={order} />
        </Grid> }
        { (!order && searchResult) && <Grid item xs={3} sm={3} md={3}>
          <div className="control-card">
            <Typography variant="body1" fontWeight="bold">Замовлення не знайдено</Typography>
          </div>
        </Grid> }
      </Grid>
      { user?.data?.role === "client" && <>
        <Typography variant="h5" fontWeight="bold">Історія замовлень</Typography>
        <div className="client-order-list">
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 3, sm: 6, md: 9 }}>
            { orderClientList?.orderClientList?.map((item, index) => (
              <Grid item xs={3} sm={3} md={3} key={index}>
                <OrderControlCard order={item} />
              </Grid>
            )) }
            { orderClientList?.orderClientList?.length === 0 && <Grid item xs={3} sm={3} md={3}>
              <div className="control-card">
                <Typography variant="body1" fontWeight="bold">Ще немає замовлень</Typography>
              </div>
            </Grid> }
          </Grid>
        </div> 
      </> }
    </div>
  ); 
};

export default OrderControl;