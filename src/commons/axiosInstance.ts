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
  const ftpPath = path.substr(0,1)==="/"?path.substr(1):path;
  const data = querystring.stringify({ 'username': username, 'password': password, 'path': "/"+Buffer.from(ftpPath,'base64').toString('utf-8')});
  return instance.post(
    "/ftp-back/ftp",
    data
  );
}

export { listAllDirectoriesOnWorkspace };
