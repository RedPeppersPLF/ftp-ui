import axios from "axios";

const querystring = require("querystring");

function listAllDirectoriesOnWorkspace(path: string, jwt: string) {
  const data = querystring.stringify({'path': path});
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/list",
    data,
    {headers: {Authorization: jwt}}
  );
}

function uploadFileToFtpServer(jwt: string | null, formData: FormData) {
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/upload",
    formData,
    {headers: {Authorization: jwt}}
  )
}

function deleteFileFromFtpServer(jwt: string | null, formData: FormData) {
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/delete",
    formData,
    {headers: {Authorization: jwt}}
  )
}

function createDirOnFtpServer(jwt: string | null, formData: FormData) {
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/createDir",
    formData,
    {headers: {Authorization: jwt}}
  )
}

function connectToFtpServer(formData: FormData) {
  let object = new Map()
  formData.forEach((value, key) => {object.set(key,value)});
  const data = querystring.stringify({'username': object.get("username"), 'password': object.get("password")});
  return axios.post(
    "/http://localhost:8080/ftp-back/auth/login",
    data
  )
}

function disconnectFromFtpServer(jwt: string | null) {
  return axios.post(
    "/http://localhost:8080/ftp-back/auth/logout",
    null,
    {headers: {Authorization: jwt}}
  )
}

export {listAllDirectoriesOnWorkspace, connectToFtpServer, createDirOnFtpServer, disconnectFromFtpServer, uploadFileToFtpServer, deleteFileFromFtpServer};
