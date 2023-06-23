import React, { ChangeEvent, MouseEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, Avatar, Select, MenuItem, FormControl, InputLabel, Button, Input, InputAdornment, IconButton, Stepper, Step, StepLabel, SelectChangeEvent } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IRegistrationForm } from "../../types/authentication";
import { AlertContext } from "../../helpers/alert/context/alert-context";
import { UserContext } from "../user/context/user-context";
import authenticationService from "../../services/authentication-service";
import "./styles.scss";

const Registration = () => {
  const [ isShowedPassword, setIsShowedPassword ] = useState<boolean>(false);
  const [ isShowedRepetedPassword, setIsShowedRepetedPassword ] = useState<boolean>(false);
  const [ avatarBlob, setAvatarBlob ] = useState<Blob | null>(null);
  const [ avatar, setAvatar ] = useState<string>();
  const [ role, setRole ] = useState<string>("client");
  const [ activeStep, setActiveStep ] = useState<number>(0);
  const [ errorStepSet, setErrorStepSet ] = useState<Set<number>>(new Set<number>());
  const steps = [ "Крок 1", "Крок 2" ];

  const navigate = useNavigate();

  const alert = useContext(AlertContext);
  const user = useContext(UserContext);

  type PasswordInput = {
    name: "password" | "repetedPassword",
    label: string
  };
  const passwordInputList: Array<PasswordInput> = [ { name: "password", label: "Пароль" }, { name: "repetedPassword", label: "Повторіть пароль" } ];

  const handleShowPassword = () => {
    setIsShowedPassword(!isShowedPassword);
  };
    
  const handleShowRepetedPassword = () => {
    setIsShowedRepetedPassword(!isShowedRepetedPassword);
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

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value);
  };

  const validationSchema = Yup.object().shape({
    lastName: Yup.string().required("Прізвище є бов'язковим полем"),
    firstName: Yup.string().required("Ім'я є бов'язковим полем"),
    middleName: Yup.string(),
    dateOfBirth: Yup.date().required("Дата народження є бов'язковим полем"),
    email: Yup.string().email().required("Email є бов'язковим полем"),
    phone: Yup.string().required("Телефон є бов'язковим полем"),
    password: Yup.string().required("Пароль є бов'язковим полем"),
    repetedPassword: Yup.string().required("Повторення пароля є бов'язковим полем"),
  });

  const {
    register,
    handleSubmit,
    trigger,
    getFieldState,
    formState: { errors }
  } = useForm<IRegistrationForm>({
    resolver: yupResolver(validationSchema)
  });

  const validateStep1 = async () => {
    const fields: Array<"email" | "password" | "repetedPassword"> = [ "email", "password", "repetedPassword" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const validateStep2 = async () => {
    const fields: Array<"lastName" | "firstName" | "dateOfBirth" | "email" | "phone"> = [ "lastName", "firstName", "dateOfBirth", "email", "phone" ];
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

  const onSubmit = (data: IRegistrationForm) => {
    if (data.password !== data.repetedPassword) {
      alert?.showAlertMessage("Пароль та повторення паролю відрізняються", false);
      return;
    }
    const registrationData = new FormData();
    registrationData.append("email", data.email);
    registrationData.append("role", role);
    registrationData.append("firstName", data.firstName);
    registrationData.append("middleName", data.middleName);
    registrationData.append("lastName", data.lastName);
    registrationData.append("dateOfBirth", data.dateOfBirth.toString());
    registrationData.append("phone", data.phone);
    registrationData.append("password", data.password);
    if (avatarBlob) {
      registrationData.append("photo", avatarBlob);
    }
    authenticationService.register(registrationData)
      .then(() => {
        alert?.showAlertMessage("Успішно зареєстровано", true);
        navigate("/login");
      })
      .catch(e => {
        alert?.showAlertMessage(e.response.data.message, false);
      });
  };

  const getStepContent = (step: number) => {
    switch (step) {
    case 0:
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
          { passwordInputList.map((item) => 
            <div key={item.name}>
              <FormControl 
                variant="standard" 
                className="text-field" 
                required
                {...register(item.name)}
                error={errors[ item.name ] ? true : false} >
                <InputLabel htmlFor={item.name}>{ item.label }</InputLabel>
                <Input
                  name={item.name}
                  type={(item.name === "password" ? isShowedPassword : isShowedRepetedPassword) ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={item.name === "password" ? handleShowPassword : handleShowRepetedPassword}
                      >
                        { (item.name === "password" ? isShowedPassword : isShowedRepetedPassword) ? <VisibilityOff /> : <Visibility /> }
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Typography variant="body2" color="error" fontSize={12}>
                { errors[ item.name ]?.message?.toString() }
              </Typography>
            </div>
          ) }
        </div>
      ); 
    case 1:
      return (
        <div className="form-data">
          <FormControl variant="standard" className="select-field" required>
            <InputLabel htmlFor="role">Роль</InputLabel>
            <Select name="role" value={role} onChange={handleRoleChange} >
              <MenuItem value={"client"}>Клієнт</MenuItem>
              <MenuItem value={"administrator"}>Адміністратор</MenuItem>
            </Select>
          </FormControl>
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
    default:
      return "Unknown step";
    }
  };

  return (
    <div className="registration-page">
      { !user?.data && <div className="registration-form">
        <Typography variant="h5" className="title">Реєстрація</Typography>
        <Stepper activeStep={activeStep}>
          { steps.map((label, index) =>(
            <Step key={index}>
              <StepLabel error={errorStepSet.has(index)}>{ label }</StepLabel>
            </Step>
          )) }
        </Stepper>
        { getStepContent(activeStep) }
        <div className="form-buttons">
          { activeStep > 0 && <Button id="back" variant="outlined" className="button" onClick={handleBack}>Назад</Button> }      
          { activeStep < steps.length - 1 ? 
            <Button id="next" variant="contained" className="button" onClick={handleNext}>Далі</Button> :        
            <Button id="send" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Надіслати</Button> 
          }        
        </div>
      </div> }
    </div>
  ); 
};

export default Registration;