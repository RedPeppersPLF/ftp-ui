import React from "react";
import DirectoryView from "components/dashboard/directoryView/directoryView";
import FileTree from "./fileTree";
import {listAllDirectoriesOnWorkspace} from "../../commons/axiosInstance";
import SecondNavBar from "../navbar/second-navbar";

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

class Dashboard extends React.Component<{history: any, location: any, match: any, jwt: string | null, handleJwt: (jwt: string | null) => void},{ files: Array<FileInfos>, checkedFiles: Array<FileInfos>, loading: boolean, path: string}> {
  state = {
    files: new Array<FileInfos>(),
    checkedFiles: new Array<FileInfos>(),
    loading: true,
    path: removeDashboardPathFromPath(this.props.location.pathname).substr(0, 1) === "/" ? pathToUTF8(removeDashboardPathFromPath(this.props.location.pathname).substr(1)) : pathToUTF8(removeDashboardPathFromPath(this.props.location.pathname)),
  };

  handleNewFile() {
    this.setState(() => ({
      loading: true,
      checkedFiles: new Array<FileInfos>()
    }))
  }

  handleItemsChecked(item: FileInfos, checked: boolean) {
    if(checked) {
      this.setState((previousState) => ({
        checkedFiles: previousState.checkedFiles.concat(item)
      }))
    } else if (!checked){
      this.setState((previousState) => ({
        checkedFiles: previousState.checkedFiles.filter(element => element !== item)
      }))
    }
  }

  listDirectories() {
    const { loading, path } = this.state
    if(loading && this.props.jwt !== null) {
      listAllDirectoriesOnWorkspace(path, this.props.jwt).then(response => {
        this.setState(() => ({
          files: response.data.files,
          loading: false
        }))
      }).catch(() => {
        this.props.handleJwt(null)
      })
    }
    return !loading ? this.renderDashboard() : ""
  }
  renderDashboard() {
    const { path, files, checkedFiles} = this.state
    return (
      <div className="dashboard">
        <SecondNavBar path={path} handleNewFile={this.handleNewFile.bind(this)} itemChecked={checkedFiles}/>
        <FileTree path={this.state.path}/>
        <div className="directory-view">
          <DirectoryView path={path} files={files} handleItemsChecked={this.handleItemsChecked.bind(this)}/>
        </div>
      </div>
    );
  }

  render() {
    return (!!this.props.jwt) ? this.listDirectories() : "";
  }
}

export default Dashboard;