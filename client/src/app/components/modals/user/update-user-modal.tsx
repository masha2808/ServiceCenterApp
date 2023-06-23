import React, { useState, ChangeEvent, MouseEvent } from "react";
import { Typography, TextField, Modal, Button, IconButton, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import dayjs from "dayjs";
import { IUser, IUserUpdateForm } from "../../../types/user";
import { getImageSrc } from "../../../helpers/image-helper";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  user: IUser| null
}

const UpdateUserModal = (props: PropTypes) => {
  const [ avatarBlob, setAvatarBlob ] = useState<Blob | null>(null);
  const [ avatar, setAvatar ] = useState<string>(getImageSrc(props.user?.data?.photo || null) || "");

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
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IUserUpdateForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: IUserUpdateForm) => {
    if (props.user) {
      const updateUserData = new FormData();
      updateUserData.append("firstName", data.firstName);
      updateUserData.append("middleName", data.middleName);
      updateUserData.append("lastName", data.lastName);
      updateUserData.append("dateOfBirth", data.dateOfBirth.toString());
      updateUserData.append("phone", data.phone);
      if (avatarBlob) {
        updateUserData.append("photo", avatarBlob);
      } else {
        updateUserData.append("photo", "");
      }
      props.user.updateUser(updateUserData, handleClose);
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
          <Avatar src={avatar} className="user-avatar" />
          <div className="avatar-buttons">
            <Button component="label" variant="contained">
              <input type="file" accept="image/*" onChange={handleAvatarChange} onClick={handleAvatarClick} />
                Обрати
            </Button>
            <Button component="label" variant="outlined" onClick={handleAvatarDelete}>
                Видалити
            </Button>
          </div>
          <div key="lastName">
            <TextField
              id="lastName"
              label="Прізвище" 
              type="text" 
              size="small" 
              variant="standard"
              defaultValue={props.user?.data?.lastName}
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
              defaultValue={props.user?.data?.firstName}
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
              defaultValue={props.user?.data?.middleName}
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
              type="date"
              label="Дата завершення"
              defaultValue={dayjs(props.user?.data?.dateOfBirth).format("YYYY-MM-DD")}
              size="small" 
              variant="standard"  
              className="text-field"
              InputLabelProps={{ shrink: true }}
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
              defaultValue={props.user?.data?.phone}
              required
              className="text-field" 
              {...register("phone")}
              error={errors.phone ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.phone?.message?.toString() }
            </Typography>
          </div>
          <div className="modal-buttons">
            <Button id="save" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зберегти</Button> 
          </div>
        </div>
      </div>
    </Modal>
  ); 
};

export default UpdateUserModal;