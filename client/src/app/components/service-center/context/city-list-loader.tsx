import React, { useState, useEffect } from "react";
import { CityListContext } from "./city-list-context";
import { ICityList, ICityListData } from "../../../types/city";
import cityService from "../../../services/city-service";

interface Props {
  children: React.ReactNode;
}

export const CityListLoader: React.FC<Props> = (props) => {
  const [ data, setData ] = useState<ICityListData | null>(null);
  const [ loaded, setLoaded ] = useState<boolean | null>(null);

  const cityList: ICityList = {
    data,
    loaded,
    listCities: () => {
      cityService.listCities()
        .then(response => {
          setData(response.data);
          setLoaded(true);
        })
        .catch(() => setLoaded(false));
    }
  };

  async function setInitialValue() {
    await cityList.listCities();
  }

  useEffect(() => {
    setInitialValue();
  }, []);

  return (
    <CityListContext.Provider value={cityList}>
      { props.children }
    </CityListContext.Provider>
  );
};