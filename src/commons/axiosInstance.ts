import Axios from "axios";
const querystring = require("querystring");

const instance = Axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    accept: "*/*",
  },
});

function listAllDirectoriesOnWorkspace(username: string, password: string, path: string) {
  const data = querystring.stringify({ 'username': username, 'password': password, 'path': path});
  return instance.post(
    "/ftp-back/ftp",
    data
  );
}

export { listAllDirectoriesOnWorkspace };
