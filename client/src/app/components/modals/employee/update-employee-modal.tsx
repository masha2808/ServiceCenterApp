import React, { useState, useContext, ChangeEvent, MouseEvent } from "react";
import { Typography, TextField, Modal, Button, IconButton, Stepper, Step, StepLabel, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import { IEmployeeUpdateForm } from "../../../types/employee";
import { EmployeeListContext } from "../../service-center-management/context/employee-list-context";
import { IUserData } from "../../../types/user";
import { getImageSrc } from "../../../helpers/image-helper";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  employee: IUserData | null
}

const UpdateEmployeeModal = (props: PropTypes) => {
  const [ avatarBlob, setAvatarBlob ] = useState<Blob | null>(null);
  const [ avatar, setAvatar ] = useState<string>(getImageSrc(props.employee?.photo || null) || "");
  const [ activeStep, setActiveStep ] = useState<number>(0);
  const [ errorStepSet, setErrorStepSet ] = useState<Set<number>>(new Set<number>());
  const steps = [ "Крок 1", "Крок 2" ];

  const employeeList = useContext(EmployeeListContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const blob = new Blob([ e.target.files[ 0 ] ], { type: e.target.files[ 0 ].type });
      const blobUrl = URL.createObjectURL(blob);
      setAvatarBlob(blob);
      setAvatar(blobUrl);
    }
  };
    
  const handleAvatarClick = (e: MouseEvent<HTMLInputElement>)=> {
    (e.target as HTMLInputElement).value = "";
  };
    
  const handleAvatarDelete = () => {
    setAvatarBlob(null);
    setAvatar("");
  };
  
  const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("Прізвище є бов'язковим полем"),
    firstName: Yup.string().required("Ім'я є бов'язковим полем"),
    middleName: Yup.string(),
    dateOfBirth: Yup.date().required("Дата народження є бов'язковим полем"),
    phone: Yup.string().required("Телефон є бов'язковим полем"),
    position: Yup.string().required("Посада є бов'язковим полем"),
    cooperationStartDate: Yup.date().required("Дата початку співпраці є бов'язковим полем"),
  });

  const {
    register,
    handleSubmit,
    trigger,
    getFieldState,
    formState: { errors }
  } = useForm<IEmployeeUpdateForm>({
    resolver: yupResolver(validationSchema)
  });

  const validateStep1 = async () => {
    const fields: Array<"lastName" | "firstName" | "dateOfBirth" | "phone"> = [ "lastName", "firstName", "dateOfBirth", "phone" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const validateStep2 = async () => {
    const fields: Array<"position" | "cooperationStartDate"> = [ "position", "cooperationStartDate" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const handleNext = async () => {
    await validateStep1();
    setActiveStep(activeStep + 1);
  };

  const handleBack = async () => {
    await validateStep2();
    setActiveStep(activeStep - 1);
  };

  const onSubmit = (data: IEmployeeUpdateForm) => {
    const updateEmployeeData = new FormData();
    updateEmployeeData.append("firstName", data.firstName);
    updateEmployeeData.append("middleName", data.middleName);
    updateEmployeeData.append("lastName", data.lastName);
    updateEmployeeData.append("dateOfBirth", data.dateOfBirth.toString());
    updateEmployeeData.append("phone", data.phone);
    updateEmployeeData.append("position", data.position);
    updateEmployeeData.append("cooperationStartDate", data.cooperationStartDate.toString());
    updateEmployeeData.append("cooperationEndDate", data.cooperationEndDate?.toString() || "");
    if (avatarBlob) {
      updateEmployeeData.append("photo", avatarBlob);
    } else {
      updateEmployeeData.append("photo", "");
    }
    if (props.employee?.id) {
      employeeList?.updateEmployee(updateEmployeeData, props.employee?.id, handleClose);
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
              defaultValue={props.employee?.lastName}
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
              defaultValue={props.employee?.firstName}
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
              defaultValue={props.employee?.middleName}
              className="text-field" 
              {...register("middleName")}
              error={errors.middleName ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.middleName?.message?.toString() }
            </Typography>
          </div>
          <div key="dateOfBirth">
            <TextField 
              id="dateOfBirth"
              label="Дата народження" 
              type="date" 
              size="small" 
              variant="standard" 
              InputLabelProps={{ shrink: true }}
              defaultValue={dayjs(props.employee?.dateOfBirth).format("YYYY-MM-DD")}
              required
              className="text-field" 
              {...register("dateOfBirth")}
              error={errors.dateOfBirth ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.dateOfBirth?.message?.toString() }
            </Typography>
          </div>
          <div key="phone">
            <TextField 
              id="phone"
              label="Телефон" 
              type="text" 
              size="small" 
              variant="standard" 
              defaultValue={props.employee?.phone}
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
          <Avatar src={avatar} className="avatar" />
          <div className="avatar-buttons">
            <Button component="label" variant="contained">
              <input type="file" accept="image/*" onChange={handleAvatarChange} onClick={handleAvatarClick} />
              Обрати
            </Button>
            <Button component="label" variant="outlined" onClick={handleAvatarDelete}>
              Видалити
            </Button>
          </div>
          <div key="position">
            <TextField 
              id="position"
              label="Посада" 
              type="text" 
              size="small" 
              variant="standard" 
              defaultValue={props.employee?.position}
              required
              className="text-field" 
              {...register("position")}
              error={errors.position ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.position?.message?.toString() }
            </Typography>
          </div>
          <div key="cooperationStartDate">
            <TextField 
              id="cooperationStartDate"
              label="Дата початку співпраці" 
              type="date" 
              size="small" 
              variant="standard" 
              InputLabelProps={{ shrink: true }}
              defaultValue={dayjs(props.employee?.cooperationStartDate).format("YYYY-MM-DD")}
              required
              className="text-field" 
              {...register("cooperationStartDate")}
              error={errors.cooperationStartDate ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.cooperationStartDate?.message?.toString() }
            </Typography>
          </div>
          <div key="cooperationEndDate">
            <TextField 
              id="cooperationEndDate"
              label="Дата закінчення співпраці" 
              type="date" 
              size="small" 
              variant="standard" 
              InputLabelProps={{ shrink: true }}
              defaultValue={dayjs(props.employee?.cooperationEndDate).format("YYYY-MM-DD")}
              className="text-field" 
              {...register("cooperationEndDate")}
              error={errors.cooperationEndDate ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.cooperationEndDate?.message?.toString() }
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
        <Typography variant="h5" className="title">Редагування працівника</Typography>
        <Stepper activeStep={activeStep}>
          { steps.map((label, index) => (
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
            <Button id="send" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зберегти</Button> 
          }        
        </div>
      </div>
    </Modal>
  ); 
};

export default UpdateEmployeeModal;