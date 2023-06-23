import React, { useState, SyntheticEvent, useContext } from "react";
import { Typography, FormLabel, Rating, TextField, Modal, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IResponseData } from "../../types/response";
import { ResponseListContext } from "../service-center/context/response-list-context";
import "./styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>> 
}

const ResponseModal = (props: PropTypes) => {
  const [ rating, setRating ] = useState<number | null>(null);
  
  const responseList = useContext(ResponseListContext);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleChangeRating = (event: SyntheticEvent<Element, Event>, value: number | null) => {
    setRating(value);
  };

  const validationSchema = Yup.object().shape({
    text: Yup.string()
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IResponseData>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = async (data: IResponseData) => {
    if (!rating) {
      setRating(0);
      return;
    }
    await responseList?.createResponse({ ...data, rating });
    handleClose();
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Надіслати відгук</Typography>
        <div className="form-data">
          <div>
            <div className="response-rating">
              <FormLabel>Оцініть якість обслуговування:</FormLabel>
              <Rating 
                name="size-small" 
                value={rating} 
                className="rating" 
                onChange={handleChangeRating}
              />
            </div>
            { rating === 0 && <Typography variant="body2" color="error" fontSize={12}>
              Рейтинг є обов&apos;язковим полем
            </Typography> }
          </div>
          <TextField 
            id="text" 
            label="Текст відгуку" 
            type="text" 
            size="small" 
            variant="outlined" 
            multiline 
            minRows={3} 
            maxRows={10} 
            {...register("text")}
            error={errors.text ? true : false}
            className="multiline-text-field" 
          />
          <div className="modal-buttons">
            <Button id="send" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Надіслати</Button> 
          </div>
        </div>
      </div>
    </Modal>
  ); 
};

export default ResponseModal;