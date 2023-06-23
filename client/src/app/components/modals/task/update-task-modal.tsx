import React, { useContext, useEffect, useState } from "react";
import { Typography, TextField, Modal, FormControl, InputLabel, Button, FormLabel, IconButton, Stepper, Step, StepLabel, Select, MenuItem, Chip, SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { ITaskData, ITaskUpdateForm } from "../../../types/task";
import { EmployeeListContext } from "../../service-center-management/context/employee-list-context";
import { TaskListContext } from "../../service-center-management/context/task-list-context";
import constants from "../../../constants";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  task: ITaskData | null
}

const UpdateTaskModal = (props: PropTypes) => {
  const [ employeeId, setEmployeeId ] = useState<number>();
  const [ status, setStatus ] = useState<string>();
  const [ activeStep, setActiveStep ] = useState<number>(0);
  const [ errorStepSet, setErrorStepSet ] = useState<Set<number>>(new Set<number>());

  const employeeList = useContext(EmployeeListContext);
  const taskList = useContext(TaskListContext);

  const steps = [ "Дані робіт", "Статус замовлення" ];

  useEffect(() => {
    if (props.task) {
      setEmployeeId(props.task.employeeId);
      setStatus(props.task.statusName);
      setActiveStep(0);
    }
  }, [ props.task ]);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleEmployeeChange = (event: SelectChangeEvent) => {
    setEmployeeId(Number(event.target.value));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Назва є бов'язковим полем"),
    description: Yup.string().required("Опис є бов'язковим полем"),
    comment: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    trigger,
    getFieldState,
    formState: { errors }
  } = useForm<ITaskUpdateForm>({
    resolver: yupResolver(validationSchema)
  });

  const validateStep1 = async () => {
    const fields: Array< "name" | "description"> = [ "name", "description" ];
    await trigger(fields);
    if(fields.some(field => getFieldState(field).error)) {
      setErrorStepSet(new Set<number>([ ...Array.from(errorStepSet), activeStep ]));
    } else if (errorStepSet.has(activeStep)) {
      errorStepSet.delete(activeStep);
    }
  };

  const handleNext = async () => {
    validateStep1();
    setActiveStep(activeStep + 1);
  };

  const handleBack = async () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = (data: ITaskUpdateForm) => {
    if (employeeId && status && props.task) {
      taskList?.updateTask({ ...data, employeeId, statusName: status }, props.task.id, handleClose);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) { 
    case 0:
      return (
        <div className="form-data">
          <FormControl variant="standard" className="select-field" required>
            <InputLabel htmlFor="employee">Працівник</InputLabel>
            <Select
              id="employee"
              variant="standard"
              value={employeeId?.toString()}
              defaultValue={props.task?.employeeId.toString()}
              onChange={handleEmployeeChange}
              required
            >
              { employeeList?.data?.employeeList.map(employee => 
                <MenuItem value={employee.id} key={employee.id}>
                  <Typography variant="body1">
                    { employee.lastName } { employee.firstName } { employee.middleName }
                  </Typography>
                </MenuItem>
              ) }
            </Select>
          </FormControl>
          <div key="name">
            <TextField 
              id="name"
              label="Назва" 
              type="text" 
              size="small" 
              variant="standard"
              defaultValue={props.task?.name}
              required
              className="text-field" 
              {...register("name")}
              error={errors.name ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.name?.message?.toString() }
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
              minRows={3} 
              maxRows={10} 
              defaultValue={props.task?.description}
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
          <div className="status-select">
            <FormLabel htmlFor="status">Статус</FormLabel>
            <Select
              id="status"
              variant="standard"
              value={status}
              defaultValue={props.task?.statusName}
              onChange={handleStatusChange}
            >
              { constants.statusList.map((status, index) => 
                <MenuItem value={status.name} key={index}>
                  <Chip color={status.color} label={status.value}/>
                </MenuItem>
              ) }
            </Select>
          </div>
          <TextField 
            id="comment" 
            label="Коментар" 
            type="text" 
            size="small" 
            variant="outlined" 
            defaultValue={props.task?.comment}
            multiline 
            minRows={3} 
            maxRows={10} 
            {...register("comment")}
            error={errors.comment ? true : false}
            className="multiline-text-field" 
          />
          <div key="plannedDateCompleted">
            <TextField 
              id="plannedDateCompleted" 
              type="date"
              label="Запланована дата завершення"
              defaultValue={props.task?.plannedDateCompleted}
              size="small" 
              variant="standard"  
              className="text-field"
              InputLabelProps={{ shrink: true }}
              {...register("plannedDateCompleted")}
              error={errors.plannedDateCompleted ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.plannedDateCompleted?.message?.toString() }
            </Typography>
          </div>
          <div key="dateCompleted">
            <TextField 
              id="dateCompleted" 
              type="date"
              label="Дата завершення"
              defaultValue={props.task?.dateCompleted}
              size="small" 
              variant="standard"  
              className="text-field"
              InputLabelProps={{ shrink: true }}
              {...register("dateCompleted")}
              error={errors.dateCompleted ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.dateCompleted?.message?.toString() }
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
        <Typography variant="h5" className="title">Редагування завдання</Typography>
        { props.task && <Typography variant="h5" className="title">{ `№ ${props.task.id}` }</Typography> }
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
            <Button id="create" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Зберегти</Button> 
          }        
        </div>
      </div>
    </Modal>
  ); 
};

export default UpdateTaskModal;