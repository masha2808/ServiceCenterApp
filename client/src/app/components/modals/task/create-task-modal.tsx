import React, { useContext, useEffect, useState } from "react";
import { Typography, FormControl, InputLabel, MenuItem, TextField, Modal, Button, IconButton } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CloseIcon from "@mui/icons-material/Close";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { IOrderData } from "../../../types/order";
import { ITaskCreateForm } from "../../../types/task";
import { EmployeeListContext } from "../../service-center-management/context/employee-list-context";
import { TaskListContext } from "../../service-center-management/context/task-list-context";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import taskService from "../../../services/task-service";
import "../styles.scss";

type PropTypes = {
  isOpened: boolean,
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>,
  order: IOrderData | null
}

const CreateTaskModal = (props: PropTypes) => {
  const [ employeeId, setEmployeeId ] = useState<number>();

  const employeeList = useContext(EmployeeListContext);
  const taskList = useContext(TaskListContext);
  const alert = useContext(AlertContext);

  useEffect(() => {
    if (!employeeId) {
      console.log(employeeList?.data?.employeeList[ 0 ].id);
      setEmployeeId(employeeList?.data?.employeeList[ 0 ].id);
    }
  }, [ employeeList ]);

  const handleClose = () => {
    props.setIsOpened(!props.isOpened);
  };

  const handleEmployeeChange = (event: SelectChangeEvent) => {
    setEmployeeId(Number(event.target.value));
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Назва є обов'язковим полем"),
    description: Yup.string().required("Опис є обов'язковим полем")
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ITaskCreateForm>({
    resolver: yupResolver(validationSchema)
  });

  const onSubmit = (data: ITaskCreateForm) => {
    if (employeeId) {
      if (taskList) {
        taskList.createTask({ ...data, employeeId }, handleClose);
      } else if (props.order?.id) {
        const jwtToken: string | null = localStorage.getItem("jwtToken");
        if (jwtToken ) {
          taskService.createTask({ ...data, orderId: props.order.id, employeeId }, jwtToken)
            .then(() => {
              alert?.showAlertMessage("Завдання було успішно створено", true);
              handleClose();
            })
            .catch(e => {
              alert?.showAlertMessage(e.response.data.message, false);
            });
        }
      }
    }
  };

  return (
    <Modal open={props.isOpened} keepMounted={false}>
      <div className="modal">
        <IconButton onClick={handleClose} className="close-icon">
          <CloseIcon />
        </IconButton>
        <Typography variant="h5" className="title">Створення завдання</Typography>
        <Typography variant="h5" className="title">{ `для замовлення № ${props.order?.number}` }</Typography>
        <div className="form-data">
          <FormControl variant="standard" className="select-field" required>
            <InputLabel htmlFor="employee">Працівник</InputLabel>
            <Select
              id="employee"
              variant="standard"
              defaultValue={employeeId?.toString()}
              value={employeeId?.toString()}
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
              required
              className="text-field" 
              {...register("name")}
              error={errors.name ? true : false}
            />
            <Typography variant="body2" color="error" fontSize={12}>
              { errors.name?.message?.toString() }
            </Typography>
          </div>
          <div key="plannedDateCompleted">
            <TextField 
              id="plannedDateCompleted" 
              type="date"
              label="Запланована дата завершення"
              defaultValue={props.order?.plannedDateCompleted}
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
        <div className="modal-buttons">
          <Button id="save" variant="contained" onClick={handleSubmit(onSubmit)} className="button">Створити</Button> 
        </div>
      </div>
    </Modal>
  ); 
};

export default CreateTaskModal;