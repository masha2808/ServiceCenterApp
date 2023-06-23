import React, { useState, useRef, useContext, useEffect } from "react";
import { Chip, Avatar, Typography, MenuItem, Select, IconButton, FormLabel, Button, TextField, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef, GridActionsCellItem, GridRowParams, GridValueGetterParams } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import dayjs from "dayjs";

import DeleteTaskModal from "../../modals/task/delete-task-modal";
import TaskInfoModal from "../../modals/task/task-info-modal";
import UpdateTaskModal from "../../modals/task/update-task-modal";
import CreateTaskModal from "../../modals/task/create-task-modal";
import UpdateTaskAsEmployeeModal from "../../modals/task/update-task-as-employee-modal";
import { TaskListContext } from "../context/task-list-context";
import { UserContext } from "../../user/context/user-context";
import { EmployeeListContext } from "../context/employee-list-context";
import { ITaskData } from "../../../types/task";
import constants from "../../../constants";
import "../styles.scss";
import { sortTaskListByDateCompleted, sortTaskListByDateTimeCreated, sortTaskListById, sortTaskListByName, sortTaskListByPlannedDateCompleted } from "../../../helpers/sorting";
import { getImageSrc } from "../../../helpers/image-helper";

const TaskTab = () => {
  const [ isLoading, ] = useState<boolean>(false);
  const windowWidth = useRef(window.innerWidth);
  const [ taskData, setTaskData ] = useState<ITaskData | null>(null);
  const [ isDeleteTaskModalOpened, setIsDeleteTaskModalOpened ] = useState(false);
  const [ isTaskInfoModalOpened, setIsTaskInfoModalOpened ] = useState(false);
  const [ isUpdateTaskModalOpened, setIsUpdateTaskModalOpened ] = useState(false);
  const [ isCreateTaskModalOpened, setIsCreateTaskModalOpened ] = useState(false);
  const [ status, setStatus ] = useState<string>("all");
  const [ sorting, setSorting ] = useState<string>("id");
  const [ sortingAsc, setSortingAsc ] = useState<boolean>(true);
  const [ taskListFiltered, setTaskListFiltered ] = useState<Array<ITaskData>>([]);
  const [ name, setName ] = useState<string>("");
  const [ searchValue, setSearchValue ] = useState<string>("");

  const taskList = useContext(TaskListContext);
  const employeeList = useContext(EmployeeListContext);
  const user = useContext(UserContext);

  useEffect(() => {
    if (taskList?.data?.taskList) {
      const taskListWithNumberSearch = taskList?.data?.taskList.filter(task => {
        if (!name || (name && task.name.includes(name))) {
          return task;
        }
      });
      const taskListWithStatusFilter = taskListWithNumberSearch.filter(task => {
        if (status === "all" || task.statusName === status) {
          return task;
        } 
      });
      if (sorting === "id") {
        sortTaskListById(taskListWithStatusFilter, sortingAsc);
      } else if (sorting === "name") {
        sortTaskListByName(taskListWithStatusFilter, sortingAsc);
      } else if (sorting === "dateTimeCreated") {
        sortTaskListByDateTimeCreated(taskListWithStatusFilter, sortingAsc);
      } else if (sorting === "plannedDateCompleted") {
        sortTaskListByPlannedDateCompleted(taskListWithStatusFilter, sortingAsc);
      } else if (sorting === "dateCompleted") {
        sortTaskListByDateCompleted(taskListWithStatusFilter, sortingAsc);
      }
      setTaskListFiltered(taskListWithStatusFilter);
    }
  }, [ taskList, sortingAsc, name, status, sorting ]);
  
  const handleDetailClick = (params: GridRowParams<ITaskData>) => {
    setIsTaskInfoModalOpened(!isTaskInfoModalOpened);
    setTaskData(params.row);
  };

  const handleDeleteClick = (params: GridRowParams<ITaskData>) => {
    setIsDeleteTaskModalOpened(!isDeleteTaskModalOpened);
    setTaskData(params.row);
  };

  const handleUpdateClick = (params: GridRowParams<ITaskData>) => {
    setIsUpdateTaskModalOpened(!isUpdateTaskModalOpened);
    setTaskData(params.row);
  };

  const handleCreateTaskClick = () => {
    setIsCreateTaskModalOpened(!isCreateTaskModalOpened);
  };

  const handleSortingAsc = () => {
    setSortingAsc(!sortingAsc);
  };

  const handleSortingChange = (event: SelectChangeEvent) => {
    setSorting(event.target.value);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatus(event.target.value);
  };

  const handleSearch = () => {
    setName(searchValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const getActions = (params: GridRowParams<ITaskData>) => {
    const actions = [
      <GridActionsCellItem
        key="details"
        label="Деталі завдання"
        icon={<InfoIcon color="primary" />}
        onClick={() => handleDetailClick(params)}
      />,
    ];

    if (user?.data?.role === "administrator" || (user?.data?.role === "employee" && employeeList?.data?.employeeList.find(employee => employee.userId === user.data?.id)?.id === params.row.employeeId)) {
      actions.push(<GridActionsCellItem
        key="details"
        label="Редагувати завдання"
        icon={<EditIcon color="primary" />}
        onClick={() => handleUpdateClick(params)}
        showInMenu
      />);
    }
  
    if (params.row.statusName === "canceled") {
      actions.push(<GridActionsCellItem
        key="details"
        label="Видалити завдання"
        icon={<DeleteIcon color="primary" />}
        onClick={() => handleDeleteClick(params)}
        showInMenu
      />);
    }

    return actions;
  };

  const getColumns = () => {
    const widthArray: Array<number> = [ 100, 240, 120, 120, 120, 120, 240, 100 ];

    const columns: GridColDef[] = [
      {
        field: "id",
        headerName: "Номер",
        filterable: false,
      },
      {
        field: "name",
        headerName: "Назва",
        filterable: false,
      },
      {
        field: "dateTimeCreated",
        headerName: "Дата створення",
        valueGetter: (params: GridValueGetterParams) =>
          dayjs(params.row.dateTimeCreated).format("DD.MM.YYYY")
      },
      {
        field: "plannedDateCompleted",
        headerName: "Завершити до",
        valueGetter: (params: GridValueGetterParams) =>
          params.row.plannedDateCompleted ? dayjs(params.row.plannedDateCompleted).format("DD.MM.YYYY") : null
      },
      {
        field: "dateCompleted",
        headerName: "Завершено",
        valueGetter: (params: GridValueGetterParams) =>
          params.row.dateCompleted ? dayjs(params.row.dateCompleted).format("DD.MM.YYYY") : null
      },
      {
        field: "statusName",
        headerName: "Статус",
        filterable: false,
        renderCell: (params) => {
          const status = constants.statusList.find(item => item.name === params.value);
          return <Chip color={status?.color} label={status?.value} />;
        }
      },
      {
        field: "fullName",
        headerName: "ПІБ працівника",
        filterable: false,
        renderCell: (params) =>
          <div className="employee-fullname">
            <Avatar src={getImageSrc(params.row.photo)} />
            <Typography variant="body2">{ params.row.lastName || "" } { params.row.firstName || "" } { params.row.middleName || "" }</Typography>
          </div>
      },
      {
        field: "buttons",
        headerName: "",
        type: "actions",
        align: "left",
        getActions: (params) => getActions(params),
      },
    ];

    if (windowWidth.current >= 1400) {
      columns.forEach((column, index) => {
        column.flex = widthArray[ index ];
      });
    } else {
      columns.forEach((column, index) => {
        column.width = widthArray[ index ];
      });
    }

    return columns;
  };

  return (
    <div className="tab-content">
      { user?.data?.role === "administrator" && <Button variant="contained" onClick={handleCreateTaskClick} className="tab-button">Створити завдання</Button> }
      <div className="action-bar">
        <div className="action-bar-search">
          <TextField 
            id="name" 
            placeholder="Введіть назву" 
            type="text" 
            variant="standard"
            className="text-field" 
            onChange={handleSearchChange}
          />
          <div className="modal-buttons">
            <Button id="save" variant="contained" onClick={handleSearch} className="button">Пошук</Button> 
          </div>
        </div>
        <div className="action-bar-select-list">
          <div className="action-bar-select">
            <FormLabel htmlFor="status">Статус</FormLabel>
            <Select
              id="status"
              variant="standard"
              defaultValue={"all"}
              onChange={handleStatusChange}
            >
              <MenuItem value={"all"}>
                Усі статуси
              </MenuItem>
              { constants.statusList.map((status, index) => 
                <MenuItem value={status.name} key={index}>
                  <Chip color={status.color} label={status.value} />
                </MenuItem>) }
            </Select>
          </div>
          <div className="action-bar-select">
            <FormLabel htmlFor="sorting">Сортування</FormLabel>
            <Select
              id="sorting"
              label="Сортування"
              variant="standard"
              defaultValue={"id"}
              onChange={handleSortingChange}
            >
              <MenuItem value={"id"}>
                Номер
              </MenuItem>
              <MenuItem value={"name"}>
                Назва
              </MenuItem>
              <MenuItem value={"dateTimeCreated"}>
                Дата створення
              </MenuItem>
              <MenuItem value={"plannedDateCompleted"}>
                Завершити до
              </MenuItem>
              <MenuItem value={"dateCompleted"}>
                Дата завершення
              </MenuItem>
            </Select>
            <IconButton onClick={handleSortingAsc}>
              { sortingAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon /> }
            </IconButton>
          </div>
        </div>
      </div>
      <DataGrid
        rows={taskListFiltered}
        columns={getColumns()}
        sortingMode="server"
        loading={isLoading}
        disableRowSelectionOnClick
        autoHeight
        hideFooterPagination
        hideFooterSelectedRowCount
        disableColumnMenu
        density="comfortable"
        slots={{
          noRowsOverlay: () => <div>Немає даних</div>
        }}
        className="data-grid"
      />
      { isDeleteTaskModalOpened && <DeleteTaskModal isOpened={isDeleteTaskModalOpened} setIsOpened={setIsDeleteTaskModalOpened} task={taskData} /> }
      { isTaskInfoModalOpened && <TaskInfoModal isOpened={isTaskInfoModalOpened} setIsOpened={setIsTaskInfoModalOpened} task={taskData} /> }
      { (isUpdateTaskModalOpened && user?.data?.role === "administrator") && <UpdateTaskModal isOpened={isUpdateTaskModalOpened} setIsOpened={setIsUpdateTaskModalOpened} task={taskData} /> }
      { (isUpdateTaskModalOpened && user?.data?.role === "employee") && <UpdateTaskAsEmployeeModal isOpened={isUpdateTaskModalOpened} setIsOpened={setIsUpdateTaskModalOpened} task={taskData} /> }
      { isCreateTaskModalOpened && <CreateTaskModal isOpened={isCreateTaskModalOpened} setIsOpened={setIsCreateTaskModalOpened} order={null} /> }
    </div>
  ); 
};

export default TaskTab;