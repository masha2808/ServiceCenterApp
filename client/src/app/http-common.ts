import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:7070/api",
  headers: {
    "Content-type": "application/json"
  }
});

const formDataRequest = axios.create({
  baseURL: "http://localhost:7070/api",
  headers: {
    "Content-type": "multipart/form-data"
  }
});

const getAuthorizationRequest = (jwtToken: string) => {
  return axios.create({
    baseURL: "http://localhost:7070/api",
    headers: {
      "Content-type": "application/json",
      "Authorization": `Barear ${jwtToken}`
    }
  });
};

const getAuthorizationFormDataRequest = (jwtToken: string) => {
  return axios.create({
    baseURL: "http://localhost:7070/api",
    headers: {
      "Content-type": "multipart/form-data",
      "Authorization": `Barear ${jwtToken}`
    }
  });
};


export default {
  request,
  formDataRequest,
  getAuthorizationRequest,
  getAuthorizationFormDataRequest
};