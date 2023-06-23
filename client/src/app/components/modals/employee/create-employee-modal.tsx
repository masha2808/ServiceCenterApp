import React, { useState, useContext, ChangeEvent, MouseEvent } from "react";
import { Typography, TextField, Modal, Button, IconButton, Stepper, Step, StepLabel, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IEmployeeCreateForm } from "../../../types/employee";
import { EmployeeListContext } from "../../service-center-management/context/employee-list-context";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
}

const CreateEmployeeModal = (props: PropTypes) => {
  const [ avatarBlob, setAvatarBlob ] = useState<Blob | null>(null);
  const [ avatar, setAvatar ] = useState<string>();
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
    email: Yup.string().email().required("Email є бов'язковим полем"),
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
  } = useForm<IEmployeeCreateForm>({
    resolver: yupResolver(validationSchema)
  });

  const validateStep1 = async () => {
    const fields: Array<"lastName" | "firstName" | "dateOfBirth" | "email" | "phone"> = [ "lastName", "firstName", "dateOfBirth", "email", "phone" ];
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

  const onSubmit = (data: IEmployeeCreateForm) => {
    const registrationData = new FormData();
    registrationData.append("email", data.email);
    registrationData.append("firstName", data.firstName);
    registrationData.append("middleName", data.middleName);
    registrationData.append("lastName", data.lastName);
    registrationData.append("dateOfBirth", data.dateOfBirth.toString());
    registrationData.append("phone", data.phone);
    registrationData.append("position", data.position);
    registrationData.append("cooperationStartDate", data.cooperationStartDate.toString());
    registrationData.append("cooperationEndDate", data.cooperationEndDate?.toString() || "");
    if (avatarBlob) {
      registrationData.append("photo", avatarBlob);
    }
    employeeList?.createEmployee(registrationData, handleClose);
  };

  const getStepContent = (step: number) => {
    switch (step) {
    case 0:
      return (
        <div className="form-data">
          <div key="email">
            <TextField 
              id="email"
              label="Email" 
              type="email" 
              size="small" 
              variant="standard" 
              required
              className="text-field" 
              {...register("email")}
              error={errors.email ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.email?.message?.toString() }
            </Typography>
          </div>
          <div key="lastName">
            <TextField
              id="lastName"
              label="Прізвище" 
              type="text" 
              size="small" 
              variant="standard"
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
        <Typography variant="h5" className="title">Реєстрація працівника</Typography>
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
            <Button id="send" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зареєструвати</Button> 
          }        
        </div>
      </div>
    </Modal>
  ); 
};

export default CreateEmployeeModal;