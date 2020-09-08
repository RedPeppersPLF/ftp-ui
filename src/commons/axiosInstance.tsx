import Axios from "axios";

const querystring = require("querystring");

const instance = Axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    accept: "*/*",
  },
});

function listAllDirectoriesOnWorkspace(path: string, jwt: string) {
  const data = querystring.stringify({'path': path});
  return instance.post(
    "/ftp-back/ftp/list",
    data,
    {headers: {Authorization: jwt}}
  );
}

function uploadFileToFtpServer(jwt: string | null, formData: FormData) {
  return instance.post(
    "ftp-back/ftp/upload",
    formData,
    {headers: {Authorization: jwt}}
  )
}

function deleteFileFromFtpServer(jwt: string | null, formData: FormData) {
  return instance.post(
    "ftp-back/ftp/delete",
    formData,
    {headers: {Authorization: jwt}}
  )
}

function connectToFtpServer(formData: FormData) {
  let object = new Map()
  formData.forEach((value, key) => {object.set(key,value)});
  const data = querystring.stringify({'username': object.get("username"), 'password': object.get("password")});
  return instance.post(
    "/ftp-back/auth/login",
    data
  )
}

function disconnectFromFtpServer(jwt: string | null) {
  return instance.post(
    "/ftp-back/auth/logout",
    null,
    {headers: {Authorization: jwt}}
  )
}

export {listAllDirectoriesOnWorkspace, connectToFtpServer, disconnectFromFtpServer, uploadFileToFtpServer, deleteFileFromFtpServer};
