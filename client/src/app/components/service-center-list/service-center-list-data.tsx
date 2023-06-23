import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Grid, TextField, Button, CircularProgress, Checkbox, FormLabel, Typography, IconButton } from "@mui/material";
import ServiceCenterListItem from "./service-center-list-item";
import { ServiceCenterListContext } from "./context/service-center-list-context";
import { CategoryListContext } from "../service-center/context/category-list-context";
import { CityListContext } from "../service-center/context/city-list-context";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { sortServiceCenterListByName } from "../../helpers/sorting";
import "./styles.scss";
import { IServiceCenterData } from "../../types/service-center";

const ServiceCenterList = () => {
  const [ categoryIdArray, setCategoryIdArray ] = useState<Array<number>>([]);
  const [ cityIdArray, setCityIdArray ] = useState<Array<number>>([]);
  const [ filterStyle, setFilterStyle ] = useState({});
  const [ sortingAsc, setSortingAsc ] = useState<boolean>(true);
  const [ serviceCenterListFiltered, setServiceCenterListFiltered ] = useState<Array<IServiceCenterData>>([]);
  const [ name, setName ] = useState<string>("");
  const [ searchValue, setSearchValue ] = useState<string>("");

  const serviceCenterList = useContext(ServiceCenterListContext);
  const categoryList = useContext(CategoryListContext);
  const cityList = useContext(CityListContext);

  useEffect(() => {
    if (serviceCenterList?.data?.serviceCenterList) {
      const serviceCenterListWithNameSearch = serviceCenterList?.data?.serviceCenterList.filter(serviceCenter => {
        if (!name || (name && serviceCenter.name.toLowerCase().includes(name.toLowerCase()))) {
          return serviceCenter;
        }
      });
      const serviceCenterListWithFilters = serviceCenterListWithNameSearch.filter(serviceCenter => {
        if (categoryIdArray.length === 0 && cityIdArray.length === 0) {
          return serviceCenter;
        } else if (categoryIdArray.length === 0 && cityIdArray.length > 0 && cityIdArray.includes(serviceCenter.cityId)) {
          return serviceCenter;
        } else if (categoryIdArray.length > 0 && cityIdArray.length === 0 && categoryIdArray.some(category => serviceCenter.categoryIdArray.includes(category))) {
          return serviceCenter;
        } else if (categoryIdArray.length > 0 && cityIdArray.length > 0 && cityIdArray.includes(serviceCenter.cityId) && categoryIdArray.some(category => serviceCenter.categoryIdArray?.includes(category))) {
          return serviceCenter;
        }
      });
      sortServiceCenterListByName(serviceCenterListWithFilters, sortingAsc);
      setServiceCenterListFiltered(serviceCenterListWithFilters);
    }
  }, [ serviceCenterList, sortingAsc, categoryIdArray, cityIdArray, name ]);
  
  const handleCategoryChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (categoryIdArray.includes(Number(event.target.value))) {
      setCategoryIdArray(categoryIdArray.filter(item => item !== Number(event.target.value)));
    } else {
      setCategoryIdArray([ ...categoryIdArray, Number(event.target.value) ]);
    }
  };

  const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (cityIdArray.includes(Number(event.target.value))) {
      setCityIdArray(cityIdArray.filter(item => item !== Number(event.target.value)));
    } else {
      setCityIdArray([ ...cityIdArray, Number(event.target.value) ]);
    }
  };

  const handleFilterClick = () => {
    setFilterStyle({ display: "block" });
  };

  const handleApplyClick = () => {
    setFilterStyle({ });
  };

  const handleSortingAsc = () => {
    setSortingAsc(!sortingAsc);
  };

  const handleSearch = () => {
    setName(searchValue);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  return (
    <div className="service-center-data">
      <div className="service-center-filters" style={filterStyle}>
        { cityList?.data?.cityList && <Typography variant="h5" fontWeight="bold">Міста</Typography> }
        { cityList?.data?.cityList?.map((city) => 
          <div key={city.id}>
            <Checkbox id={`category${city.id}`} value={city.id} checked={cityIdArray.includes(city.id)} onChange={handleCityChange} />
            <FormLabel>{ city.name }</FormLabel>
          </div>
        ) }
        { cityList?.data?.cityList && <Typography variant="h5" fontWeight="bold">Категорії</Typography> }
        { categoryList?.data?.categoryList?.map((category) => 
          <div key={category.id}>
            <Checkbox id={`category${category.id}`} value={category.id} checked={categoryIdArray.includes(category.id)} onChange={handleCategoryChange} />
            <FormLabel>{ category.name }</FormLabel>
          </div>
        ) }
        <Button variant="contained" className="filter-button" onClick={handleApplyClick}>Застосувати</Button>
      </div>
      { serviceCenterListFiltered ?
        <div className="service-center-list">
          <div className="action-bar">
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
          <Button variant="contained" className="filter-button" onClick={handleFilterClick}>Фільтри</Button>
          <div className="sorting">
            <FormLabel htmlFor="sorting">Сортування за назвою</FormLabel>
            <IconButton onClick={handleSortingAsc}>
              { sortingAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon /> }
            </IconButton>
          </div>
          <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 4, md: 8 }}>
            { serviceCenterListFiltered.map((serviceCenter) => (
              <Grid item xs={4} md={4} key={serviceCenter.id}>
                <ServiceCenterListItem serviceCenter={serviceCenter} />
              </Grid>
            )) }
          </Grid>
        </div> : 
        <CircularProgress /> }
    </div>
  ); 
};

export default ServiceCenterList;

