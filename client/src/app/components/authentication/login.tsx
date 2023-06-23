import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, TextField, FormControl, InputLabel, Input, InputAdornment, IconButton, Button, AlertColor } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ILoginData } from "../../types/authentication";
import { UserContext } from "../user/context/user-context";
import { AlertContext } from "../../helpers/alert/context/alert-context";
import authenticationService from "../../services/authentication-service";
import "./styles.scss";

const Login = () => {
  const [ isShowedPasswrd, setIsShowedPassword ] = useState(false);

  const user = useContext(UserContext);
  const alert = useContext(AlertContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Введіть email").required("Email є бов'язковим полем"),
    password: Yup.string().required("Пароль є бов'язковим полем"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ILoginData>({
    resolver: yupResolver(validationSchema)
  });

  const navigate = useNavigate();

  const onSubmit = (data: ILoginData) => {
    authenticationService.login(data)
      .then(response => {
        localStorage.setItem("jwtToken", response.data.jwtToken);
        navigate("/");
        user?.getUser();
      })
      .catch(e => {
        alert?.showAlertMessage(e.response.data.message, false);
      });
  };

  const handleShowPassword = () => {
    setIsShowedPassword(!isShowedPasswrd);
  };

  return (
    <div className="login-page">
      { !user?.data && <div className="login-form">
        <form>
          <Typography variant="h5" className="title">Вхід в систему</Typography>
          <div>
            <TextField 
              id="email" 
              label="Email" 
              type="email" 
              size="small" 
              variant="standard" 
              {...register("email")}
              error={errors.email ? true : false}
              className="text-field" 
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.email?.message?.toString() }
            </Typography>
          </div>
          <div>
            <FormControl 
              variant="standard" 
              error={errors.password ? true : false} 
              className="text-field"
            >
              <InputLabel htmlFor="password">Пароль</InputLabel>
              <Input
                id="password"
                type={isShowedPasswrd ? "text" : "password"}
                {...register("password")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleShowPassword}
                    >
                      { isShowedPasswrd ? <VisibilityOff /> : <Visibility /> }
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.password?.message?.toString() }
            </Typography>
          </div>
          <Button id="login" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Увійти</Button>
        </form>
      </div> }
    </div>
  ); 
};

export default Login;