import React, { useContext, useEffect, useState } from "react";
import { Typography, TextField, Modal, Checkbox, Button, FormLabel, IconButton, Stepper, Step, StepLabel, Select, MenuItem, Chip, SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import { IOrderData, IOrderUpdateForm } from "../../../types/order";
import { OrderListContext } from "../../service-center-management/context/order-list-context";
import constants from "../../../constants";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  order: IOrderData | null
}

const UpdateOrderModal = (props: PropTypes) => {
  const [ deliveryToServiceCenter, setDeliveryToServiceCenter ] = useState<boolean>(props.order?.deliveryToServiceCenter || false);
  const [ deliveryFromServiceCenter, setDeliveryFromServiceCenter ] = useState<boolean>(props.order?.deliveryToServiceCenter || false);
  const [ payed, setPayed ] = useState<boolean>(props.order?.payed || false);
  const [ status, setStatus ] = useState<string>(props.order?.statusName || "");
  const [ activeStep, setActiveStep ] = useState<number>(0);
  const [ errorStepSet, setErrorStepSet ] = useState<Set<number>>(new Set<number>());
  const steps = [ "Контактні дані", "Дані робіт", "Статус замовлення" ];

  const orderList = useContext(OrderListContext);

  useEffect(() => {
    if (props.order) {
      setDeliveryToServiceCenter(props.order.deliveryToServiceCenter);
      setDeliveryFromServiceCenter(props.order.deliveryFromServiceCenter);
      setActiveStep(0);
    }
  }, [ props.order ]);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleDeliveryToServiceCenterChange = () => {
    setDeliveryToServiceCenter(!deliveryToServiceCenter);
  };

  const handleDeliveryFromServiceCenterChange = () => {
    setDeliveryFromServiceCenter(!deliveryFromServiceCenter);
  };

  const handlePayedChange = () => {
    setPayed(!payed);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("Прізвище є бов'язковим полем"),
    firstName: Yup.string().required("Ім'я є бов'язковим полем"),
    middleName: Yup.string(),
    email: Yup.string().email().required("Email є бов'язковим полем"),
    phone: Yup.string().required("Телефон є бов'язковим полем"),
    objectType: Yup.string().required("Об'єкт є бов'язковим полем"),
    model: Yup.string(),
    deliveryToServiceCenter: Yup.boolean(),
    deliveryFromServiceCenter: Yup.boolean(),
    address: Yup.string()
      .when("deliveryFromServiceCenter", {
        is: true,
        then: (schema) => schema.required("Адреса є бов'язковим полем")
      }),
    description: Yup.string().required("Опис є бов'язковим полем"),
    comment: Yup.string(),
    price: Yup.number().min(0).required("Вартість є бов'язковим полем"),
  });

  const {
    register,
    handleSubmit,
    trigger,
    getFieldState,
    formState: { errors }
  } = useForm<IOrderUpdateForm>({
    resolver: yupResolver(validationSchema)
  });

  const validateStep1 = async () => {
    const fields: Array<"lastName" | "firstName" | "email" | "phone"> = [ "lastName", "firstName", "email", "phone" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const validateStep2 = async () => {
    const fields: Array<"objectType" | "address" | "description" > = [ "objectType", "address", "description" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const validateStep3 = async () => {
    const fields: Array<"price" > = [ "price" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const handleNext = async () => {
    switch(activeStep) {
    case 0: 
      validateStep1();
      break;
    case 1: 
      validateStep2();
      break;
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = async () => {
    switch(activeStep) {
    case 1: 
      validateStep2();
      break;
    case 2: 
      validateStep3();
      break;
    }
    setActiveStep(activeStep - 1);
  };

  const onSubmit = async (data: IOrderUpdateForm) => {
    if (props.order) {
      orderList?.updateOrder({
        ...data,
        statusName: status,
        payed,
        deliveryToServiceCenter,
        deliveryFromServiceCenter,
      }, props.order.id, handleClose);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
    case 0:
      return (
        <div className="form-data">
          <div key="lastName">
            <TextField
              id="lastName"
              label="Прізвище" 
              type="text" 
              size="small" 
              variant="standard"
              defaultValue={props.order?.lastName}
              required
              className="text-field" 
              {...register("lastName")}
              error={errors.lastName ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.lastName?.message?.toString() }
            </Typography>
          </div>
          <div key="firstName">
            <TextField
              id="firstName"
              label="Ім'я" 
              type="text" 
              size="small" 
              variant="standard" 
              defaultValue={props.order?.firstName}
              required
              className="text-field" 
              {...register("firstName")}
              error={errors.firstName ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.firstName?.message?.toString() }
            </Typography>
          </div>
          <div key="middleName">
            <TextField 
              id="middleName"
              label="По батькові" 
              type="text" 
              size="small" 
              variant="standard" 
              defaultValue={props.order?.middleName}
              className="text-field" 
              {...register("middleName")}
              error={errors.middleName ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.middleName?.message?.toString() }
            </Typography>
          </div>
          <div key="email">
            <TextField 
              id="email"
              label="Email" 
              type="email" 
              size="small" 
              variant="standard" 
              defaultValue={props.order?.email}
              required
              className="text-field" 
              {...register("email")}
              error={errors.email ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.email?.message?.toString() }
            </Typography>
          </div>
          <div key="phone">
            <TextField 
              id="phone"
              label="Телефон" 
              type="text" 
              size="small" 
              variant="standard" 
              defaultValue={props.order?.phone}
              required
              className="text-field" 
              {...register("phone")}
              error={errors.phone ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.phone?.message?.toString() }
            </Typography>
          </div>
        </div>
      ); 
    case 1:
      return (
        <div className="form-data">
          <div key="objectType">
            <TextField 
              id="objectType"
              label="Тип об'єкту" 
              type="text" 
              size="small" 
              variant="standard"
              defaultValue={props.order?.objectType}
              required
              className="text-field" 
              {...register("objectType")}
              error={errors.objectType ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.objectType?.message?.toString() }
            </Typography>
          </div>
          <div key="model">
            <TextField 
              id="model" 
              label="Модель" 
              type="text"
              size="small"
              variant="standard" 
              defaultValue={props.order?.model}
              className="text-field"
              {...register("model")}
              error={errors.model ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.model?.message?.toString() }
            </Typography>
          </div>
          <div className="checkbox-field">
            <div>
              <Checkbox id="deliveryTo" value={deliveryToServiceCenter} checked={deliveryToServiceCenter} onChange={handleDeliveryToServiceCenterChange} />
              <FormLabel>Потрібна доставка в сервісний центр</FormLabel>
            </div>
            <div>
              <Checkbox id="deliveryFrom" value={deliveryFromServiceCenter} checked={deliveryFromServiceCenter} onChange={handleDeliveryFromServiceCenterChange} />
              <FormLabel>Потрібна доставка з сервісного центру</FormLabel>
            </div>
          </div>
          { (deliveryToServiceCenter || deliveryFromServiceCenter) &&
          <div key="address">
            <TextField
              id="address"
              label="Ваша адреса" 
              type="text" 
              size="small" 
              variant="standard" 
              defaultValue={props.order?.address}
              required
              className="text-field"
              {...register("address")}
              error={errors.address ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.address?.message?.toString() }
            </Typography>
          </div>
          }
          <div key="description">
            <TextField  
              id="description"
              label="Опис" 
              type="text"
              size="small" 
              variant="outlined" 
              multiline 
              minRows={3} 
              maxRows={10} 
              defaultValue={props.order?.description}
              required
              className="multiline-text-field" 
              {...register("description")}
              error={errors.description ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.description?.message?.toString() }
            </Typography>
          </div>
        </div>
      ); 
    case 2: 
      return (
        <div className="form-data">
          <div className="status-select">
            <FormLabel htmlFor="status">Статус</FormLabel>
            <Select
              id="status"
              variant="standard"
              value={status}
              defaultValue={props.order?.statusName}
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
            defaultValue={props.order?.comment}
            multiline 
            minRows={3} 
            maxRows={10} 
            {...register("comment")}
            error={errors.comment ? true : false}
            className="multiline-text-field" 
          />
          <div key="price">
            <TextField 
              id="price"
              label="Вартість (грн)" 
              type="text" 
              size="small" 
              variant="standard"
              defaultValue={props.order?.price}
              required
              className="text-field" 
              {...register("price")}
              error={errors.price ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.price?.message?.toString() }
            </Typography>
          </div>
          <div className="checkbox-field">
            <Checkbox id="payed" value={payed} checked={payed} onChange={handlePayedChange} />
            <FormLabel>Замовлення оплачено</FormLabel>
          </div>
          <div key="plannedDateCompleted">
            <TextField 
              id="plannedDateCompleted" 
              type="date"
              label="Запланована дата завершення"
              defaultValue={dayjs(props.order?.plannedDateCompleted).format("YYYY-MM-DD")}
              size="small" 
              variant="standard"  
              className="text-field"
              InputLabelProps={{ shrink: true }}
              {...register("plannedDateCompleted")}
              error={errors.plannedDateCompleted ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.plannedDateCompleted?.message?.toString() }
            </Typography>
          </div>
          <div key="dateCompleted">
            <TextField 
              id="dateCompleted" 
              type="date"
              label="Дата завершення"
              defaultValue={dayjs(props.order?.dateCompleted).format("YYYY-MM-DD")}
              size="small" 
              variant="standard"  
              className="text-field"
              InputLabelProps={{ shrink: true }}
              {...register("dateCompleted")}
              error={errors.dateCompleted ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.dateCompleted?.message?.toString() }
            </Typography>
          </div>
        </div>
      );          
    default:
      return "Unknown step";
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Редагування замовлення</Typography>
        { props.order && <Typography variant="h5" className="title">{ `№ ${props.order.number}` }</Typography> }
        <Stepper activeStep={activeStep}>
          { steps.map((label, index) =>(
            <Step key={index}>
              <StepLabel error={errorStepSet.has(index)}>{ label }</StepLabel>
            </Step>
          )) }
        </Stepper>
        { getStepContent(activeStep) }
        <div className="modal-buttons">
          { activeStep > 0 && <Button id="back" variant="outlined" className="button" onClick={handleBack}>Назад</Button> }      
          { activeStep < steps.length - 1 ? 
            <Button id="next" variant="contained" className="button" onClick={handleNext}>Далі</Button> :        
            <Button id="create" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зберегти</Button> 
          }        
        </div>
      </div>
    </Modal>
  ); 
};

export default UpdateOrderModal;