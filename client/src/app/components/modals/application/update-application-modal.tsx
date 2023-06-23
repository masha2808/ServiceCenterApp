import React, { useEffect, useState, useContext } from "react";
import { Typography, FormLabel, MenuItem, Chip, TextField, Modal, Button, IconButton } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IApplicationUpdateForm, IApplicationData } from "../../../types/application";
import { ApplicationListContext } from "../../service-center-management/context/application-list-context";
import constants from "../../../constants";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  application: IApplicationData | null
}

const UpdateApplicationModal = (props: PropTypes) => {
  const [ status, setStatus ] = useState<string>();

  useEffect(() => {
    if (props.application ) {
      setStatus(props.application.status);
    }
  }, [ props.application ]);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const validationSchema = Yup.object().shape({
    comment: Yup.string()
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IApplicationUpdateForm>({
    resolver: yupResolver(validationSchema)
  });

  const applicationList = useContext(ApplicationListContext);

  const onSubmit = async (data: IApplicationUpdateForm) => {
    if (props?.application?.id && status) {
      applicationList?.updateApplication({ ...data, status }, props.application.id, handleClose);
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Редагування заяви</Typography>
        <Typography variant="h5" className="title">{ `№ ${props.application?.number}` }</Typography>
        <div className="form-data">
          <div className="status-select">
            <FormLabel htmlFor="status">Статус</FormLabel>
            <Select
              id="status"
              variant="standard"
              value={status}
              defaultValue={props.application?.status}
              onChange={handleStatusChange}
            >
              { constants.applicationStatusList.map((status, index) => 
                <MenuItem value={status.name} key={index}>
                  <Chip color={status.color} label={status.value} />
                </MenuItem>) }
            </Select>
          </div>
          <TextField 
            id="comment" 
            label="Коментар" 
            type="text" 
            size="small" 
            variant="outlined" 
            defaultValue={props.application?.comment}
            multiline 
            minRows={3} 
            maxRows={10} 
            {...register("comment")}
            error={errors.comment ? true : false}
            className="multiline-text-field" 
          />
          <div className="modal-buttons">
            <Button id="save" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зберегти</Button> 
          </div>
        </div>
      </div>
    </Modal>
  ); 
};

export default UpdateApplicationModal;