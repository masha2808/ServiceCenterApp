import React from "react";
import { Alert, IconButton, AlertColor } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import "../styles.scss";

type PropTypes = { 
  severity: AlertColor, 
  message: string, 
  setIsAlert: React.Dispatch<React.SetStateAction<boolean>> 
};

const AlertMessage = (props: PropTypes) => {

  return (
    <Alert
      severity={props.severity}
      variant="filled"
      className="alert"
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          size="small"
          onClick={() => {
            props.setIsAlert(false);
          }}
        >
          <CloseIcon fontSize="inherit" />
        </IconButton>
      }
    >
      { props.message }
    </Alert>
  );
};

export default AlertMessage;