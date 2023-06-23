import React, { useState, useRef, useContext, useEffect } from "react";
import { Chip,TextField, Button, FormLabel, Select, MenuItem, IconButton, SelectChangeEvent } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams, GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import dayjs from "dayjs";

import DeleteApplicationModal from "../../modals/application/delete-application-modal";
import ApplicationInfoModal from "../../modals/application/application-info-modal";
import UpdateApplicationModal from "../../modals/application/update-application-modal";
import CreateOrderModal from "../../modals/order/create-order-modal";
import { ApplicationListContext } from "../context/application-list-context";
import { UserContext } from "../../user/context/user-context";
import { IApplicationData } from "../../../types/application";
import { sortApplicationListByDate, sortApplicationListByNumber } from "../../../helpers/sorting";
import constants from "../../../constants";
import "../styles.scss";

const ApplicationTab = () => {
  const [ isLoading, ] = useState<boolean>(false);
  const windowWidth = useRef(window.innerWidth);
  const [ applicationData, setApplicationData ] = useState<IApplicationData | null>(null);
  const [ isDeleteApplicationModalOpened, setIsDeleteApplicationModalOpened ] = useState(false);
  const [ isApplicationInfoModalOpened, setIsApplicationInfoModalOpened ] = useState(false);
  const [ isUpdateApplicationModalOpened, setIsUpdateApplicationModalOpened ] = useState(false);
  const [ isCreateOrderModalOpened, setIsCreateOrderModalOpened ] = useState(false);
  const [ status, setStatus ] = useState<string>("all");
  const [ sorting, setSorting ] = useState<string>("number");
  const [ sortingAsc, setSortingAsc ] = useState<boolean>(true);
  const [ applicationListFiltered, setApplicationListFiltered ] = useState<Array<IApplicationData>>([]);
  const [ number, setNumber ] = useState<string>("");
  const [ searchValue, setSearchValue ] = useState<string>("");

  const applicationList = useContext(ApplicationListContext);
  const user = useContext(UserContext);

  useEffect(() => {
    if (applicationList?.data?.applicationList) {
      const applicationListWithNumberSearch = applicationList?.data?.applicationList.filter(application => {
        if (!number || (number && application.number.includes(number))) {
          return application;
        }
      });
      const applicationListWithStatusFilter = applicationListWithNumberSearch.filter(application => {
        if (status === "all" || application.status === status) {
          return application;
        } 
      });
      if (sorting === "number") {
        sortApplicationListByNumber(applicationListWithStatusFilter, sortingAsc);
      } else if (sorting === "dateTimeCreated") {
        sortApplicationListByDate(applicationListWithStatusFilter, sortingAsc);
      }
      setApplicationListFiltered(applicationListWithStatusFilter);
    }
  }, [ applicationList, sortingAsc, number, status, sorting ]);

  const handleDetailClick = (params: GridRowParams<IApplicationData>) => {
    setIsApplicationInfoModalOpened(!isApplicationInfoModalOpened);
    setApplicationData(params.row);
  };

  const handleDeleteClick = (params: GridRowParams<IApplicationData>) => {
    setIsDeleteApplicationModalOpened(!isDeleteApplicationModalOpened);
    setApplicationData(params.row);
  };

  const handleUpdateClick = (params: GridRowParams<IApplicationData>) => {
    setIsUpdateApplicationModalOpened(!isUpdateApplicationModalOpened);
    setApplicationData(params.row);
  };

  const handleCreateOrderClick = (params: GridRowParams<IApplicationData>) => {
    setIsCreateOrderModalOpened(!isCreateOrderModalOpened);
    setApplicationData(params.row);
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

  const getActions = (params: GridRowParams<IApplicationData>) => {
    const actions = [
      <GridActionsCellItem
        key="details"
        label="Деталі заяви"
        icon={<InfoIcon color="primary" />}
        onClick={() => handleDetailClick(params)}
      />,
    ];

    if (user?.data?.role === "administrator") {
      actions.push(<GridActionsCellItem
        key="details"
        label="Редагувати заяву"
        icon={<EditIcon color="primary" />}
        onClick={() => handleUpdateClick(params)}
        showInMenu
      />);

      if (params.row.status === "refused") {
        actions.push(<GridActionsCellItem
          key="details"
          label="Видалити заяву"
          icon={<DeleteIcon color="primary" />}
          onClick={() => handleDeleteClick(params)}
          showInMenu
        />);
      }

      if (params.row.status === "accepted") {
        actions.push(<GridActionsCellItem
          key="createOrder"
          label="Створити замовлення"
          icon={<AddIcon color="primary" />}
          onClick={() => handleCreateOrderClick(params)}
          showInMenu
        />);
      }
    }

    return actions;
  };

  const getColumns = () => {
    const widthArray: Array<number> = [ 180, 100, 130, 200, 200, 150, 150, 150, 80 ];

    const columns: GridColDef[] = [
      {
        field: "number",
        headerName: "Номер",
        filterable: false,
      },
      {
        field: "dateTimeCreated",
        headerName: "Дата",
        valueGetter: (params: GridValueGetterParams) =>
          dayjs(params.row.dateTimeCreated).format("DD.MM.YYYY")
      },
      {
        field: "status",
        headerName: "Статус",
        filterable: false,
        renderCell: (params) => {
          const status = constants.applicationStatusList.find(item => item.name === params.value);
          return <Chip color={status?.color} label={status?.value} />;
        }
      },
      {
        field: "fullName",
        headerName: "ПІБ",
        filterable: false,
        valueGetter: (params: GridValueGetterParams) =>
          `${params.row.lastName || ""} ${params.row.firstName || ""} ${params.row.middleName || ""}`,
      },
      {
        field: "email",
        headerName: "Email",
        filterable: false,
      },
      {
        field: "phone",
        headerName: "Телефон",
        filterable: false,
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
      <div className="action-bar">
        <div className="action-bar-search">
          <TextField 
            id="number" 
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
              { constants.applicationStatusList.map((status, index) => 
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
                Дата
              </MenuItem>
            </Select>
            <IconButton onClick={handleSortingAsc}>
              { sortingAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon /> }
            </IconButton>
          </div>
        </div>
      </div>
      { applicationList?.data?.applicationList && <DataGrid
        rows={applicationListFiltered}
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
      /> }
      { isDeleteApplicationModalOpened && <DeleteApplicationModal isOpened={isDeleteApplicationModalOpened} setIsOpened={setIsDeleteApplicationModalOpened} application={applicationData} /> }
      { isApplicationInfoModalOpened && <ApplicationInfoModal isOpened={isApplicationInfoModalOpened} setIsOpened={setIsApplicationInfoModalOpened} application={applicationData} /> }
      { isUpdateApplicationModalOpened && <UpdateApplicationModal isOpened={isUpdateApplicationModalOpened} setIsOpened={setIsUpdateApplicationModalOpened} application={applicationData} /> }
      { isCreateOrderModalOpened && <CreateOrderModal isOpened={isCreateOrderModalOpened} setIsOpened={setIsCreateOrderModalOpened} application={applicationData} /> }
    </div>
  ); 
};

export default ApplicationTab;