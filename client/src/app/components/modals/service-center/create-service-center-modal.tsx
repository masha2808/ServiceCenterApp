import React, { useState, ChangeEvent, MouseEvent, useContext } from "react";
import { 
  Typography, 
  TextField, 
  Modal, 
  Checkbox, 
  Button, 
  FormLabel, 
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Avatar, 
  IconButton, 
  Stepper, 
  Step, 
  StepLabel, 
  ImageList,
  ImageListItem,
  ImageListItemBar,
  SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IServiceCenterForm } from "../../../types/service-center";
import { ServiceCenterContext } from "../../service-center/context/service-center-context";
import { CategoryListContext } from "../../service-center/context/category-list-context";
import { CityListContext } from "../../service-center/context/city-list-context";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>> 
}

const CreateServiceCenterModal = (props: PropTypes) => {
  const [ categoryIdArray, setCategoryIdArray ] = useState<Array<number>>([]);
  const [ categoryError, setCategoryError ] = useState<boolean>(false);
  const [ cityId, setCityId ] = useState<number>(1);
  const [ avatarBlob, setAvatarBlob ] = useState<Blob | null>(null);
  const [ avatar, setAvatar ] = useState<string>();
  const [ photoBlobList, setPhotoBlobList ] = useState<Array<{id: number, data: Blob}>>([]);
  const [ photoList, setPhotoList ] = useState<Array<{id: number, data: string}>>([]);
  const [ map, setMap ] = useState<boolean>(false);
  const [ activeStep, setActiveStep ] = useState<number>(0);
  const [ errorStepSet, setErrorStepSet ] = useState<Set<number>>(new Set<number>());
  const steps = [ "Загальні дані", "Категорії", "Контакти", "Галерея" ];

  const serviceCenter = useContext(ServiceCenterContext);
  const categoryList = useContext(CategoryListContext);
  const cityList = useContext(CityListContext);
  
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

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const blob = new Blob([ e.target.files[ 0 ] ], { type: e.target.files[ 0 ].type });
      const blobUrl = URL.createObjectURL(blob);
      const id: number = photoList.length > 0 ? photoList[ photoList.length - 1 ].id + 1 : 1;
      setPhotoBlobList([ ...photoBlobList, { id, data: blob } ]);
      setPhotoList([ ...photoList, { id, data: blobUrl } ]);
    }
  }; 

  const handleDeletePhoto = (id: number) => {
    setPhotoBlobList(photoBlobList.filter(photoBlob => photoBlob.id !== id));
    setPhotoList(photoList.filter(photo => photo.id !== id));
  }; 

  const handlePhotoClick = (e: MouseEvent<HTMLInputElement>)=> {
    (e.target as HTMLInputElement).value = "";
  };


  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (categoryIdArray.includes(Number(event.target.value))) {
      const newCategoryIdArray = categoryIdArray.filter(item => item !== Number(event.target.value));
      setCategoryIdArray(newCategoryIdArray);
      newCategoryIdArray.length === 0 && setCategoryError(true);
    } else {
      setCategoryIdArray([ ...categoryIdArray, Number(event.target.value) ]);
      categoryError && setCategoryError(false);
    }
  };

  const handleCityIdChange = (event: SelectChangeEvent) => {
    setCityId(Number(event.target.value));
  };

  const handleMapChange = () => {
    setMap(!map);
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Назва є бов'язковим полем"),
    shortDescription: Yup.string().required("Короткий опис є бов'язковим полем"),
    description: Yup.string().required("Опис є бов'язковим полем"),
    email: Yup.string().email().required("Email є бов'язковим полем"),
    phone: Yup.string().required("Телефон є бов'язковим полем"),
    address: Yup.string().required("Адреса є бов'язковим полем"),
    map: Yup.boolean(),
    mapLatitude: Yup.number()
      .when("isMap", {
        is: true,
        then: (schema) => schema.required("Широта є бов'язковим полем")
      }),
    mapLongitude: Yup.number()
      .when("isMap", {
        is: true,
        then: (schema) => schema.required("Довгота є бов'язковим полем")
      }),
  });

  const {
    register,
    handleSubmit,
    trigger,
    getFieldState,
    formState: { errors }
  } = useForm<IServiceCenterForm>({
    resolver: yupResolver(validationSchema)
  });

  const validateStep1 = async () => {
    const fields: Array<"name" | "shortDescription" | "description"> = [ "name", "shortDescription", "description" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const validateStep2 = async () => {
    if(categoryError || categoryIdArray.length === 0) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const validateStep3 = async () => {
    const fields: Array<"cityId" | "address" | "phone" | "email" | "mapLatitude" | "mapLongitude"> = [ "cityId", "address", "phone", "email" ];
    if (map) {
      fields.push("mapLatitude", "mapLongitude");
    }
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const handleNext = async () => {
    switch(activeStep) {
    case 0: {
      await validateStep1();
      break;
    }
    case 1: {
      categoryIdArray.length === 0 ? setCategoryError(true) : setCategoryError(false);
      await validateStep2();
      break;
    }
    case 2: {
      await validateStep3();
      break;
    }
    }
    setActiveStep(activeStep + 1);
  };

  const handleBack = async () => {
    switch(activeStep) {
    case 1: {
      categoryIdArray.length === 0 ? setCategoryError(true) : setCategoryError(false);
      await validateStep2();
      break;
    }
    case 2: {
      await validateStep3();
      break;
    }
    }
    setActiveStep(activeStep - 1);
  };

  const onSubmit = (data: IServiceCenterForm) => {
    const createServiceCenterData = new FormData();
    createServiceCenterData.append("name", data.name);
    createServiceCenterData.append("shortDescription", data.shortDescription);
    createServiceCenterData.append("description", data.description);
    createServiceCenterData.append("email", data.email);
    createServiceCenterData.append("phone", data.phone);
    createServiceCenterData.append("address", data.address);
    createServiceCenterData.append("mapLatitude", data.mapLatitude?.toString() || "");
    createServiceCenterData.append("mapLongitude", data.mapLongitude?.toString() || "");
    createServiceCenterData.append("cityId", cityId.toString());
    createServiceCenterData.append("categoryIdList", JSON.stringify(categoryIdArray));
    if (avatarBlob) {
      createServiceCenterData.append("mainPhoto", avatarBlob);
    }
    photoBlobList.forEach(photo => {
      createServiceCenterData.append(`photo${photo.id}`, photo.data);
    });
    serviceCenter?.createServiceCenter(createServiceCenterData, handleClose);
  };

  const getStepContent = (step: number) => {
    switch (step) {
    case 0:
      return (
        <div className="form-data">
          <Avatar src={avatar || "../no-photo-available.png"} className="avatar" sx={{ borderRadius: "5px" }} />
          <div className="avatar-buttons">
            <Button component="label" variant="contained">
              <input type="file" accept="image/*" onChange={handleAvatarChange} onClick={handleAvatarClick} />
                Обрати
            </Button>
            <Button component="label" variant="outlined" onClick={handleAvatarDelete}>
                Видалити
            </Button>
          </div>
          <div key="name">
            <TextField
              id="name"
              label="Назва" 
              type="text" 
              size="small" 
              variant="standard"
              required
              className="text-field" 
              {...register("name")}
              error={errors.name ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.name?.message?.toString() }
            </Typography>
          </div>
          <div key="shortDescription">
            <TextField  
              id="shortDescription"
              label="Короткий опис" 
              type="text" 
              size="small" 
              variant="outlined" 
              multiline 
              rows={2}
              required
              className="multiline-text-field" 
              {...register("shortDescription")}
              error={errors.shortDescription ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.shortDescription?.message?.toString() }
            </Typography>
          </div>
          <div key="description">
            <TextField  
              id="description"
              label="Опис" 
              type="text" 
              size="small" 
              variant="outlined" 
              multiline 
              minRows={4} 
              maxRows={10} 
              required
              className="multiline-text-field" 
              {...register("description")}
              error={errors.description ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.description?.message?.toString() }
            </Typography>
          </div>
        </div>
      ); 
    case 1:
      return (
        <div className="form-data">
          <div className="checkbox-field">
            { categoryList?.data?.categoryList?.map((category) => 
              <div key={category.id}>
                <Checkbox id={`category${category.id}`} value={category.id} checked={categoryIdArray.includes(category.id)} onChange={handleCategoryChange} />
                <FormLabel>{ category.name }</FormLabel>
              </div>
            ) }
          </div>
          { categoryError && <Typography variant="body2" color="error" fontSize={12}>
            Потрібно обрати як мінімум одну категорію для сервісного центру
          </Typography> }
        </div>
      );    
    case 2:
      return (
        <div className="form-data">
          <FormControl variant="standard" className="select-field" required>
            <InputLabel htmlFor="city">Місто</InputLabel>
            <Select
              id="city"
              variant="standard"
              value={cityId?.toString()}
              onChange={handleCityIdChange}
              required
            >
              { cityList?.data?.cityList?.map(city => 
                <MenuItem value={city.id} key={city.id}>
                  <Typography variant="body1">{ city.name }</Typography>
                </MenuItem>) }
            </Select>
          </FormControl>
          <div key="address">
            <TextField
              id="address"
              label="Ваша адреса" 
              type="text" 
              size="small" 
              variant="standard" 
              required
              className="text-field"
              {...register("address")}
              error={errors.address ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.address?.message?.toString() }
            </Typography>
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
          <div className="checkbox-field">
            <Checkbox id="map" value={map} checked={map} onChange={handleMapChange} />
            <FormLabel>Додати координати розташування на карті</FormLabel>
          </div>
          { map && <>
            <div key="mapLatitude">
              <TextField 
                id="mapLatitude"
                label="Широта" 
                type="text" 
                size="small" 
                variant="standard" 
                required
                className="text-field" 
                {...register("mapLatitude")}
                error={errors.mapLatitude ? true : false}
              />
              <Typography variant="body2" color="error" fontSize={12}>
                { errors.mapLatitude?.message?.toString() }
              </Typography>
            </div>
            <div key="mapLongitude">
              <TextField 
                id="mapLongitude"
                label="Довгота" 
                type="text" 
                size="small" 
                variant="standard" 
                required
                className="text-field" 
                {...register("mapLongitude")}
                error={errors.mapLongitude ? true : false}
              />
              <Typography variant="body2" color="error" fontSize={12}>
                { errors.mapLongitude?.message?.toString() }
              </Typography>
            </div>
          </> }
        </div>
      );     
    case 3:
      return (
        <div className="form-data">
          <ImageListItem key="Subheader" cols={2}>
            <Button component="label" variant="outlined" className="add-photo-button">
              <input type="file" accept="image/*" onChange={handlePhotoChange} onClick={handlePhotoClick} />
              Додати фото
            </Button>
          </ImageListItem>
          <ImageList variant="masonry">
            { photoList?.map(photo =>
              <ImageListItem key={photo.id}>
                <img src={photo.data} />
                <ImageListItemBar
                  actionIcon={
                    <IconButton onClick={() => handleDeletePhoto(photo.id)}>
                      <DeleteIcon className="delete-icon" />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ) }
          </ImageList>
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
        <Typography variant="h5" className="title">Створення сервісного центру</Typography>
        <Stepper activeStep={activeStep} className="stepper">
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
            <Button id="send" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Створити</Button> 
          }        
        </div>
      </div>
    </Modal>
  ); 
};

export default CreateServiceCenterModal;