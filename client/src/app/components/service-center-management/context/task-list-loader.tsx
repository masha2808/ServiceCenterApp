import React, { useState, useEffect, useContext } from "react";
import { TaskListContext } from "./task-list-context";
import { ITaskCreateForm, ITaskList, ITaskListData, ITaskUpdateForm, ITaskUpdateAsEmployeeForm } from "../../../types/task";
import { AlertContext } from "../../../helpers/alert/context/alert-context";
import taskService from "../../../services/task-service";

interface Props {
  children: React.ReactNode;
}

export const TaskListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<ITaskListData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const alert = useContext(AlertContext);
  
  const taskList: ITaskList = {
    data,
    loaded,
    listTasks: async () => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        taskService.listTasks(jwtToken)
          .then(response => {
            if (response.data) {
              setData(response.data);
              setLoaded(true);
            } else {
              setLoaded(false);
            }
          });
      } else {
        setLoaded(false);
      }
    },
    createTask: (formData: ITaskCreateForm, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        taskService.createTask(formData, jwtToken)
          .then(response => {
            if (data?.taskList) {
              setData({ taskList: [ ...data.taskList, response.data ] });
            } else {
              setData({ taskList: [ response.data ] });
            }
            alert?.showAlertMessage("Завдання було успішно створено", true);
            handleClose();
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    updateTask: (formData: ITaskUpdateForm, id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        taskService.updateTask(formData, jwtToken, id)
          .then(response => {
            if (data) {
              const updatedTaskist = data.taskList.map(task => task.id === response.data.id ? response.data : task);
              setData({ taskList: updatedTaskist });
              handleClose();
            }
            alert?.showAlertMessage("Завдання було успішно оновлено", true);
            handleClose();
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    updateTaskAsEmployee: (formData: ITaskUpdateAsEmployeeForm, id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        taskService.updateTaskAsEmployee(formData, jwtToken, id)
          .then(response => {
            if (data) {
              const updatedTaskist = data.taskList.map(task => task.id === response.data.id ? response.data : task);
              setData({ taskList: updatedTaskist });
              handleClose();
            }
            alert?.showAlertMessage("Завдання було успішно оновлено", true);
            handleClose();
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
    deleteTask: (id: number, handleClose: () => void) => {
      const jwtToken: string | null = localStorage.getItem("jwtToken");
      if (jwtToken) {
        taskService.deleteTask(jwtToken, id)
          .then(response => {
            if (data) {
              const updatedTaskist = data.taskList.filter(task => task.id !== response.data.id);
              setData({ taskList: updatedTaskist });
              handleClose();
            }
            alert?.showAlertMessage("Завдання було успішно видалено", true);
            handleClose();
          })
          .catch(e => {
            alert?.showAlertMessage(e.response.data.message, false);
          });
      }
    },
  };

  async function setInitialValue() {
    await taskList.listTasks();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <TaskListContext.Provider value={taskList}>
      { props.children }
    </TaskListContext.Provider>
  );
};