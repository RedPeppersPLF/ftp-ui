import axios from "axios";

function listAllDirectoriesOnWorkspace(path: string, jwt: string) {
  const headers = {'Authorization': `${jwt}`, 'Accept': 'application/json'}
  const data = {'path': path};
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/list",
    data,
    {headers: headers}
  );
}

function uploadFileToFtpServer(jwt: string | null, formData: FormData) {
  const headers = {'Authorization': `${jwt}`}
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/upload",
    formData,
    {headers: headers}
  )
}

function deleteFileFromFtpServer(jwt: string | null, formData: FormData) {
  const headers = {'Authorization': `${jwt}`}
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/delete",
    formData,
    {headers: headers}
  )
}

function createDirOnFtpServer(jwt: string | null, formData: FormData) {
  const headers = {'Authorization': `${jwt}`}
  return axios.post(
    "http://localhost:8080/ftp-back/ftp/createDir",
    formData,
    {headers: headers}
  )
}

function connectToFtpServer(formData: FormData) {
  let object = new Map()
  formData.forEach((value, key) => {object.set(key,value)});
  const data = {'username': object.get("username"), 'password': object.get("password")};
  return axios.post(
    "/http://localhost:8080/ftp-back/auth/login",
    data
  )
}

function disconnectFromFtpServer(jwt: string | null) {
  const headers = {'Authorization': `${jwt}`}
  return axios.post(
    "/http://localhost:8080/ftp-back/auth/logout",
    null,
    {headers: headers}
  )
}

export {listAllDirectoriesOnWorkspace, connectToFtpServer, createDirOnFtpServer, disconnectFromFtpServer, uploadFileToFtpServer, deleteFileFromFtpServer};
