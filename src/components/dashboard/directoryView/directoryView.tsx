import React from "react";
import { listAllDirectoriesOnWorkspace } from "commons/axiosInstance";
import { Box } from "@material-ui/core";
import "components/dashboard/directoryView/directoryView.scss";
import DirectoryCheckbox from "./directoryCheckbox";
import Tick from "assets/icons/tick.svg";

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

class DirectoryView extends React.Component<{ path: string }, { files: Array<FileInfos>; listLoading: boolean; elementNumberstoDisplay: number; path: string }> {
  state = {
    files: new Array<FileInfos>(),
    listLoading: true,
    elementNumberstoDisplay: 0,
    path: this.props.path.substr(0,1) === "/"?Buffer.from(this.props.path.substr(1),'base64').toString('utf-8'):Buffer.from(this.props.path,'base64').toString('utf-8')
  };

  elementList = new Array<JSX.Element>();

  componentDidMount() {
      listAllDirectoriesOnWorkspace("Guest", "", this.state.path).then(
        (response) => {
          response.data.files.forEach(
            async (file: FileInfos, index: number, array: FileInfos[]) => {
              let metadata = "";
              if (file.type === FileType.Directory) {
                await listAllDirectoriesOnWorkspace(
                  "Guest",
                  "",
                  this.state.path+"/"+file.name
                ).then((response) => {
                  metadata = response.data.files.length.toString();
                });
              } else if(file.type === FileType.File){
                metadata = this.numberToReadableSize(file.size);
              }
              this.setState(
                (previousState) => ({
                  files: previousState.files.concat(file),
                  elementNumberstoDisplay: array.length
                }),
                () => {
                  this.setState({ listLoading: false });
                  console.log(index)
                  this.elementList.push(
                    <Box key={index} className="element-wrapper">
                      <div className="first">
                        <div className="checkbox">
                          <img alt="checked" src={Tick} />
                        </div>
                        <div className="menu">
                          <div className="el"></div>
                          <div className="el"></div>
                          <div className="el"></div>
                        </div>
                      </div>
                      <DirectoryCheckbox
                        index={index}
                        name={this.state.path+"/"+file.name}
                        type={file.type}
                      />
                      <div className="third">
                        <p className="element-name">
                          {file.name}
                        </p>
                        <p className="element-size">{metadata}</p>
                      </div>
                    </Box>
                  );
                }
              );
            }
          );
        }
      );
  }

  numberToReadableSize(size: number) {
    if (size.toString().length > 9) {
      return (size / 1073741824).toPrecision(3).toString().concat(" Go");
    } else if (size.toString().length > 6) {
      return (size / 1048576).toPrecision(3).toString().concat(" Mo");
    } else if (size.toString().length > 3) {
      return (size / 1024).toPrecision(3).toString().concat(" Ko");
    } else return "< 1 Ko";
  }

  renderDirectories() {
    let sortedElementList = new Array<JSX.Element>();
    sortedElementList.sort((n1: JSX.Element,n2: JSX.Element) => {
      if(n1.key < n2.key) {return -1;}
      if(n1.key > n2.key) {return 1;}
      return 0
    })
    return this.elementList;
  }

  render() {
    const { elementNumberstoDisplay } = this.state;
    return this.elementList.length === elementNumberstoDisplay ? (
      <div>{this.renderDirectories()}</div>
    ) : (
      <span>Loading...</span>
    );
  }
}

export default DirectoryView;
