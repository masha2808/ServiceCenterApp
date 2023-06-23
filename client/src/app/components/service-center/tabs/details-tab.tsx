import { Typography } from "@mui/material";
import React from "react";

type PropTypes = {
  categoryNameArray: Array<string> | null,
  description: string | null
}

const DetailsTab = (props: PropTypes) => {

  return (
    <div className="tab-content">
      <div className="details">
        <div>
          <Typography variant="body1" fontWeight="bold">Опис</Typography>
          <Typography variant="body1">{ props.description }</Typography>
        </div>
        <div>
          <Typography variant="body1" fontWeight="bold">Категорії</Typography>
          <ul>
            { props.categoryNameArray?.map((category, index) => 
              <li key={index}>
                <Typography variant="body1">{ category }</Typography>
              </li>
            ) }
          </ul>
        </div>  </div>
    </div>
  ); 
};

export default DetailsTab;