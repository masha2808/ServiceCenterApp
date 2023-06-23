import React, { useContext, useState } from "react";
import { Typography, Modal, IconButton, Button, FormControl, InputAdornment, Input, InputLabel } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import authenticationService from "../../../services/authentication-service";
import { IChangePasswordData, IChangePasswordForm } from "../../../types/authentication";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
}

const ChangePasswordModal = (props: PropTypes) => {
  const [ isShowedPassword, setIsShowedPassword ] = useState<boolean>(false);
  const [ isShowedNewPassword, setIsShowedNewPassword ] = useState<boolean>(false);
  const [ isShowedRepetedNewPassword, setIsShowedRepetedNewPassword ] = useState<boolean>(false);

  const alert = useContext(AlertContext);

  type PasswordInput = {
    name: "password" |"newPassword" | "repetedNewPassword",
    label: string,
  };
  const passwordInputList: Array<PasswordInput> = [ { name: "password", label: "Пароль" }, { name: "newPassword", label: "Новий пароль" }, { name: "repetedNewPassword", label: "Повторіть новий пароль" } ];

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Пароль є бов'язковим полем"),
    newPassword: Yup.string().required("Новий пароль є бов'язковим полем"),
    repetedNewPassword: Yup.string().required("Повторення нового пароля є бов'язковим полем"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IChangePasswordForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data: IChangePasswordForm) => {
    if (data.newPassword !== data.repetedNewPassword) {
      alert?.showAlertMessage("Новий gароль та повторення нового паролю відрізняються", false);
      return;
    }
    const formData: IChangePasswordData = {
      password: data.password,
      newPassword: data.newPassword
    };
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      authenticationService.changePassword(formData, jwtToken)
        .then(() => {
          alert?.showAlertMessage("Пароль успішно змінено", true);
          handleClose();
        })
        .catch(e => {
          alert?.showAlertMessage(e.response.data.message, false);
        });
    }
  };

  const handleShowPassword = () => {
    setIsShowedPassword(!isShowedPassword);
  };

  const handleShowNewPassword = () => {
    setIsShowedNewPassword(!isShowedNewPassword);
  };

  const handleShowRepetedNewPassword = () => {
    setIsShowedRepetedNewPassword(!isShowedRepetedNewPassword);
  };

  const showPassword = (name: string) => {
    if (name === "password") {
      handleShowPassword();
    } else if (name === "newPassword") {
      handleShowNewPassword();
    } else {
      handleShowRepetedNewPassword();
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Редагування даних користувача</Typography>
        <div className="form-data">
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
                  type={(item.name === "password" ? isShowedPassword : (item.name === "newPassword" ? isShowedNewPassword : isShowedRepetedNewPassword)) ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => showPassword(item.name)}
                      >
                        { (item.name === "password" ? isShowedPassword : (item.name === "newPassword" ? isShowedNewPassword : isShowedRepetedNewPassword)) ? <VisibilityOff /> : <Visibility /> }
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
          <div className="modal-buttons">
            <Button id="save" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зберегти</Button> 
          </div>
        </div>
      </div>
    </Modal>
  ); 
};

export default ChangePasswordModal;