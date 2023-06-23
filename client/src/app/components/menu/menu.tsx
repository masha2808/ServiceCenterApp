import React, { useContext, useState } from "react";
import { Avatar, Typography, IconButton } from "@mui/material";
import { NavLink } from "react-router-dom";
import { UserContext } from "../user/context/user-context";
import { getImageSrc } from "../../helpers/image-helper";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./styles.scss";

const Menu = () => {
  const [ style, setStyle ] = useState({});
  const user = useContext(UserContext);

  const handleStyle = (style: {isActive: boolean}) => ({ 
    color: style.isActive ? "white" : "lightBlue",
    textDecoration: "none"
  });

  const handleLogout = () => {
    localStorage.clear();
    user?.getUser();
    if (Object.keys(style).length > 0) { 
      setStyle({ });
    }
  };

  const handlePhoneMenuClick = () => {
    if (Object.keys(style).length === 0) { 
      setStyle({ display: "flex" });
    } else {
      setStyle({ });
    }
  };

  const handleNavLinkClick = () => {
    if (Object.keys(style).length > 0) { 
      setStyle({ });
    }
  };

  return (
    <div className="menu">
      <div className="phone-menu">
        <Typography variant="h5">ServiceCenterApp</Typography>
        <IconButton onClick={handlePhoneMenuClick}>
          { Object.keys(style).length === 0 ? <MenuIcon className="menu-button" /> : <CloseIcon className="menu-button" /> }
        </IconButton>
      </div>
      <div className="menu-items" style={style}>
        <div className="menu-group">
          <Typography variant="h5" className="menu-title">ServiceCenterApp</Typography>
          <NavLink to="/" onClick={handleNavLinkClick} style={handleStyle}>
            <Typography variant="body1">Головна</Typography>
          </NavLink>
          <NavLink to="/application-control" onClick={handleNavLinkClick} style={handleStyle}>
            <Typography variant="body1">Заяви</Typography>
          </NavLink>
          <NavLink to="/order-control" onClick={handleNavLinkClick} style={handleStyle}>
            <Typography variant="body1">Замовлення</Typography>
          </NavLink>
          { (user?.data?.role === "administrator" || user?.data?.role === "employee") && 
        <NavLink to="/service-center-management" onClick={handleNavLinkClick} style={handleStyle}>
          <Typography variant="body1"> Сервісний центр</Typography>
        </NavLink> }
        </div>
        { !user?.data?.role ?
          <div className="menu-group">
            <NavLink to="/login" onClick={handleNavLinkClick} style={handleStyle}>
              <Typography variant="body1">Вхід</Typography>
            </NavLink>
            <NavLink to="/registration" onClick={handleNavLinkClick} style={handleStyle}>
              <Typography variant="body1">Реєстрація</Typography>
            </NavLink>
          </div> :
          <div className="menu-group">
            <NavLink to="/profile" onClick={handleNavLinkClick} style={handleStyle} className="menu-item">
              <Avatar src={getImageSrc(user.data?.photo)} />
              <Typography variant="body1">{ user.data.lastName } { user.data.firstName }</Typography>
            </NavLink>
            <Typography variant="body1" onClick={handleLogout}>Вихід</Typography>
          </div> 
        }
      </div>
    </div>
  );
};

export default Menu;