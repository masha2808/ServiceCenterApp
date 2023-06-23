import React, { useState, useContext, useEffect } from "react";
import { Typography, Button, Grid, Avatar } from "@mui/material";
import constants from "../../constants";
import { UserContext } from "./context/user-context";
import dayjs from "dayjs";
import UpdateUserModal from "../modals/user/update-user-modal";
import ChangePasswordModal from "../modals/user/change-password-modal";
import { getImageSrc } from "../../helpers/image-helper";
import "./styles.scss";

const UserProfile = () => {
  const [ isUpdateUserModalOpened, setIsUpdateUserModalOpened ] = useState(false);
  const [ isChangePasswordModalOpened, setIsChangePasswordModalOpened ] = useState(false);
  const [ avatar, setAvatar ] = useState<string>();

  const user = useContext(UserContext);

  const role = constants.roleList.find(role => role.name === user?.data?.role);
  
  useEffect(() => {
    if (user?.data?.photo) {
      setAvatar(getImageSrc(user?.data?.photo));
    } else {
      setAvatar("");
    }
  }, [ user ]);

  const handleUpdate = () => {
    setIsUpdateUserModalOpened(!isUpdateUserModalOpened);
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalOpened(!isChangePasswordModalOpened);
  };

  return (
    <div className="user-profile">
      { user && <>
        <Avatar className="avatar" src={avatar} />
        <div className="user-profile-data">
          <div className="text-info">
            <Grid container columns={3} spacing={1}>
              <Grid item xs={3}>
                <Typography variant="h4" fontWeight="bold">{ user?.data?.lastName } { user?.data?.firstName } { user?.data?.middleName }</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body1" fontWeight="bold">{ role?.value }</Typography>
              </Grid>

              <Grid item xs={1}>
                <Typography variant="body1" fontWeight="bold">Дата народження</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">{ dayjs(user?.data?.dateOfBirth).format("DD.MM.YYYY") }</Typography>
              </Grid>
            
              <Grid item xs={1}>
                <Typography variant="body1" fontWeight="bold">Email</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">{ user?.data?.email }</Typography>
              </Grid>
            
              <Grid item xs={1}>
                <Typography variant="body1" fontWeight="bold">Номер</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="body1">{ user?.data?.phone }</Typography>
              </Grid>
              { role?.name === "employee" && <>
                <Grid item xs={1}>
                  <Typography variant="body1" fontWeight="bold">Посада</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1">{ user?.data?.position }</Typography>
                </Grid>

                <Grid item xs={1}>
                  <Typography variant="body1" fontWeight="bold">Початок співпраці</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1">{ dayjs(user?.data?.cooperationStartDate).format("DD.MM.YYYY") }</Typography>
                </Grid>
              
                <Grid item xs={1}>
                  <Typography variant="body1" fontWeight="bold">Завершення співпраці</Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body1">{ dayjs(user?.data?.cooperationEndDate).format("DD.MM.YYYY") || "-" }</Typography>
                </Grid>
              </> }
            </Grid>
          </div>
          <div className="profile-buttons">
            { role?.name !== "employee" && <Button variant="contained" onClick={handleUpdate}>Редагувати</Button> }
            <Button variant="contained" onClick={handleChangePassword}>Змінити пароль</Button>
          </div>
        </div>
        { isUpdateUserModalOpened && <UpdateUserModal isOpened={isUpdateUserModalOpened} setIsOpened={setIsUpdateUserModalOpened} user={user} /> }
        { isChangePasswordModalOpened && <ChangePasswordModal isOpened={isChangePasswordModalOpened} setIsOpened={setIsChangePasswordModalOpened} /> }
      </> }
    </div>
  ); 
};

export default UserProfile;