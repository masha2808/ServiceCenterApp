import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./app/components/menu/menu";
import Registration from "./app/components/authentication/registration";
import Login from "./app/components/authentication/login";
import ServiceCenterList from "./app/components/service-center-list/service-center-list";
import ServiceCenter from "./app/components/service-center/service-center";
import ServiceCenterManagement from "./app/components/service-center-management/service-center-management";
import UserProfile from "./app/components/user/user-profile";
import ApplicationControl from "./app/components/control/application-control";
import OrderControl from "./app/components/control/order-control";
import { AlertLoader } from "./app/helpers/alert/context/alert-loader";
import { UserLoader } from "./app/components/user/context/user-loader";
import "./App.css";

export default function App() {
  return (
    <AlertLoader>
      <UserLoader>
        <BrowserRouter>
          <Menu />
          <div className="service-center-app">
            <Routes>
              <Route path="/" element={<ServiceCenterList />} />
              <Route path="/service-center/:id" element={<ServiceCenter />} />
              <Route path="/service-center-management" element={<ServiceCenterManagement />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/application-control" element={<ApplicationControl />} />
              <Route path="/order-control" element={<OrderControl />} />
              <Route path="*" element={<div>No page</div>} />
            </Routes>
          </div>
        </BrowserRouter>
      </UserLoader>
    </AlertLoader>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
