import React, { useContext, useEffect, useState } from "react";
import { TextField, Button, Typography, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IApplicationClientList, IApplicationControlData, IApplicationGetByNumberForm } from "../../types/application";
import { UserContext } from "../user/context/user-context";
import ApplicationControlCard from "./application-control-card";
import applicationService from "../../services/application-service";
import "./styles.scss";

const ApplicationControl = () => {
  const user = useContext(UserContext);
  const [ applicationClientList, setApplicationClientList ] = useState<IApplicationClientList | null>(null);
  const [ application, setApplication ] = useState<IApplicationControlData | null>(null);
  const [ searchResult, setSearchResult ] = useState<boolean>(false);

  useEffect(() => {
    if (!applicationClientList) {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        applicationService.listClientApplications(jwtToken)
          .then(response => {
            if (response.data) {
              setApplicationClientList(response.data);
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
  } = useForm<IApplicationGetByNumberForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: IApplicationGetByNumberForm) => {
    applicationService.getApplicationByNumber(data.number)
      .then(response => {
        if (response.data) {
          setSearchResult(true);
          setApplication(response.data);
        }
      })
      .catch(() => {
        setSearchResult(true);
        setApplication(null);
      });
  };

  return (
    <div className="control">
      <Typography variant="h5" fontWeight="bold">Перевірити заяву за номером</Typography>
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
        { (application && searchResult) && <Grid item xs={3} sm={3} md={3}>
          <ApplicationControlCard application={application} />
        </Grid> }
        { (!application && searchResult) && <Grid item xs={3} sm={3} md={3}>
          <div className="control-card">
            <Typography variant="body1" fontWeight="bold">Заяву не знайдено</Typography>
          </div>
        </Grid> }
      </Grid>
      { user?.data?.role === "client" && <>
        <Typography variant="h5" fontWeight="bold">Історія заяв</Typography>
        <div className="client-application-list">
          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} columns={{ xs: 3, sm: 6, md: 9 }}>
            { applicationClientList?.applicationClientList?.map((item, index) => (
              <Grid item xs={3} sm={3} md={3} key={index}>
                <ApplicationControlCard application={item} />
              </Grid>
            )) }
            { applicationClientList?.applicationClientList?.length === 0 && <Grid item xs={3} sm={3} md={3}>
              <div className="control-card">
                <Typography variant="body1" fontWeight="bold">Ще немає заяв</Typography>
              </div>
            </Grid> }
          </Grid>
        </div> 
      </> }
    </div>
  ); 
};

export default ApplicationControl;