import React from "react";
import DirectoryView from "components/dashboard/directoryView/directoryView";
import FileTree from "./fileTree";
import {listAllDirectoriesOnWorkspace} from "../../commons/axiosInstance";

export enum FileType {
  Unknown = 0,
  File,
  Directory,
  SymbolicLink,
}

type FileInfos = {
  name: string;
  type: FileType;
  size: number;
  rawModifiedAt: string;
  modifiedAt: string;
};

function removeDashboardPathFromPath(path: string) {
  return path.replace("/dashboard", "");
}

function pathToUTF8(path: string) {
  return Buffer.from(path, 'base64').toString('utf-8')
}

class Dashboard extends React.Component<{history: any, location: any, match: any, jwt: string | null},{ files: Array<FileInfos>, loading: boolean, path: string }> {
  state = {
    files: new Array<FileInfos>(),
    loading: true,
    path: removeDashboardPathFromPath(this.props.location.pathname).substr(0, 1) === "/" ? pathToUTF8(removeDashboardPathFromPath(this.props.location.pathname).substr(1)) : pathToUTF8(removeDashboardPathFromPath(this.props.location.pathname))
  };

  listDirectories() {
    const { loading } = this.state
    if(loading && this.props.jwt !== null) {
      listAllDirectoriesOnWorkspace(this.state.path, this.props.jwt).then(response => {
        this.setState(() => ({
          files: response.data.files,
          loading: false
        }))
      })
    }
    return !loading ? this.renderDashboard() : ""
  }
  renderDashboard() {
    return (
      <div className="dashboard">
        <FileTree path={this.state.path}/>
        <DirectoryView path={this.state.path} files={this.state.files}/>
      </div>
    );
  }

  render() {
    return (!!this.props.jwt) ? this.listDirectories() : "No Token";
  }
}

export default Dashboard;