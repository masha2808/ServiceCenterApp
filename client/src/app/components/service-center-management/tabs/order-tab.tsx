import React, { useState, useRef, useContext, useEffect } from "react";
import { Chip, Button, TextField, FormLabel, Select, MenuItem, IconButton, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams, GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import dayjs from "dayjs";

import DeleteOrderModal from "../../modals/order/delete-order-modal";
import OrderInfoModal from "../../modals/order/order-info-modal";
import UpdateOrderModal from "../../modals/order/update-order-modal";
import CreateOrderModal from "../../modals/order/create-order-modal";
import CreateTaskModal from "../../modals/task/create-task-modal";
import { OrderListContext } from "../context/order-list-context";
import { UserContext } from "../../user/context/user-context";
import { IOrderData } from "../../../types/order";
import { sortOrderListByDateCompleted, sortOrderListByDateTimeCreated, sortOrderListByNumber, sortOrderListByPlannedDateCompleted } from "../../../helpers/sorting";
import constants from "../../../constants";
import "../styles.scss";

const OrderTab = () => {
  const [ isLoading, ] = useState<boolean>(false);
  const windowWidth = useRef(window.innerWidth);
  const [ orderData, setOrderData ] = useState<IOrderData | null>(null);
  const [ isDeleteOrderModalOpened, setIsDeleteOrderModalOpened ] = useState(false);
  const [ isOrderInfoModalOpened, setIsOrderInfoModalOpened ] = useState(false);
  const [ isUpdateOrderModalOpened, setIsUpdateOrderModalOpened ] = useState(false);
  const [ isCreateOrderModalOpened, setIsCreateOrderModalOpened ] = useState(false);
  const [ isCreateTaskModalOpened, setIsCreateTaskModalOpened ] = useState(false);
  const [ status, setStatus ] = useState<string>("all");
  const [ sorting, setSorting ] = useState<string>("number");
  const [ sortingAsc, setSortingAsc ] = useState<boolean>(true);
  const [ orderListFiltered, setOrderListFiltered ] = useState<Array<IOrderData>>([]);
  const [ number, setNumber ] = useState<string>("");
  const [ searchValue, setSearchValue ] = useState<string>("");
  
  const orderList = useContext(OrderListContext);
  const user = useContext(UserContext);

  useEffect(() => {
    if (orderList?.data?.orderList) {
      const orderListWithNumberSearch = orderList?.data?.orderList.filter(order => {
        if (!number || (number && order.number.includes(number))) {
          return order;
        }
      });
      const orderListWithStatusFilter = orderListWithNumberSearch.filter(order => {
        if (status === "all" || order.statusName === status) {
          return order;
        } 
      });
      if (sorting === "number") {
        sortOrderListByNumber(orderListFiltered, sortingAsc);
      } else if (sorting === "dateTimeCreated") {
        sortOrderListByDateTimeCreated(orderListFiltered, sortingAsc);
      } else if (sorting === "plannedDateCompleted") {
        sortOrderListByPlannedDateCompleted(orderListFiltered, sortingAsc);
      } else if (sorting === "dateCompleted") {
        sortOrderListByDateCompleted(orderListFiltered, sortingAsc);
      }
      setOrderListFiltered(orderListWithStatusFilter);
    }
  }, [ orderList, sortingAsc, number, status, sorting ]);
  
  const handleDetailClick = (params: GridRowParams<IOrderData>) => {
    setIsOrderInfoModalOpened(!isOrderInfoModalOpened);
    setOrderData(params.row);
  };

  const handleDeleteClick = (params: GridRowParams<IOrderData>) => {
    setIsDeleteOrderModalOpened(!isDeleteOrderModalOpened);
    setOrderData(params.row);
  };

  const handleUpdateClick = (params: GridRowParams<IOrderData>) => {
    setIsUpdateOrderModalOpened(!isUpdateOrderModalOpened);
    setOrderData(params.row);
  };

  const handleCreateOrderClick = () => {
    setIsCreateOrderModalOpened(!isCreateOrderModalOpened);
  };

  const handleCreateTaskClick = (params: GridRowParams<IOrderData>) => {
    setIsCreateTaskModalOpened(!isCreateTaskModalOpened);
    setOrderData(params.row);
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
    setNumber(searchValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const getActions = (params: GridRowParams<IOrderData>) => {
    const actions = [
      <GridActionsCellItem
        key="details"
        label="Деталі замовлення"
        icon={<InfoIcon color="primary" />}
        onClick={() => handleDetailClick(params)}
      />,
    ];

    if (user?.data?.role === "administrator") {
      actions.push(<GridActionsCellItem
        key="details"
        label="Редагувати замовлення"
        icon={<EditIcon color="primary" />}
        onClick={() => handleUpdateClick(params)}
        showInMenu
      />);

      if (params.row.statusName === "canceled") {
        actions.push(<GridActionsCellItem
          key="details"
          label="Видалити замовлення"
          icon={<DeleteIcon color="primary" />}
          onClick={() => handleDeleteClick(params)}
          showInMenu
        />);
      }

      if ([ "created", "inProgress", "problem" ].includes(params.row.statusName)) {
        actions.push(<GridActionsCellItem
          key="createOrder"
          label="Створити завдання"
          icon={<AddIcon color="primary" />}
          onClick={() => handleCreateTaskClick(params)}
          showInMenu
        />);
      }
    }

    return actions;
  };

  const getColumns = () => {
    const widthArray: Array<number> = [ 160, 110, 100, 130, 200, 70, 70, 150, 150, 80 ];

    const columns: GridColDef[] = [
      {
        field: "number",
        headerName: "Номер",
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
        headerName: "ПІБ клієнта",
        filterable: false,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.lastName || ""} ${params.row.firstName || ""} ${params.row.middleName || ""}`,
      },
      {
        field: "price",
        headerName: "Вартість",
        filterable: false,
      },
      {
        field: "payed",
        headerName: "Оплачено",
        filterable: false,
        valueFormatter: (params) => params.value ? "Так" : "Ні"
      },
      {
        field: "objectType",
        headerName: "Тип об'єкту",
        filterable: false,
      },
      {
        field: "model",
        headerName: "Модель",
        filterable: false,
      },
      {
        field: "buttons",
        headerName: "",
        type: "actions",
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
      { user?.data?.role === "administrator" && <Button variant="contained" onClick={handleCreateOrderClick} className="tab-button">Створити замовлення</Button> }
      <div className="action-bar">
        <div className="action-bar-search">
          <TextField 
            id="name" 
            placeholder="Введіть номер" 
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
              defaultValue={"number"}
              onChange={handleSortingChange}
            >
              <MenuItem value={"number"}>
                Номер
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
        rows={orderListFiltered}
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
      { isDeleteOrderModalOpened && <DeleteOrderModal isOpened={isDeleteOrderModalOpened} setIsOpened={setIsDeleteOrderModalOpened} order={orderData} /> }
      { isOrderInfoModalOpened && <OrderInfoModal isOpened={isOrderInfoModalOpened} setIsOpened={setIsOrderInfoModalOpened} order={orderData} /> }
      { isUpdateOrderModalOpened && <UpdateOrderModal isOpened={isUpdateOrderModalOpened} setIsOpened={setIsUpdateOrderModalOpened} order={orderData} /> }
      { isCreateOrderModalOpened && <CreateOrderModal isOpened={isCreateOrderModalOpened} setIsOpened={setIsCreateOrderModalOpened} application={null} /> }
      { isCreateTaskModalOpened && <CreateTaskModal isOpened={isCreateTaskModalOpened} setIsOpened={setIsCreateTaskModalOpened} order={orderData} /> }
    </div>
  ); 
};

export default OrderTab;