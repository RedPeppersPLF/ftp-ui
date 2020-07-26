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

class DirectoryView extends React.Component<{ path: string },{ files: Array<FileInfos>; loading: boolean; path: string }> {
  state = {
    files: new Array<FileInfos>(),
    loading: true,
    path:
      this.props.path.substr(0, 1) === "/"
        ? this.props.path.substr(1)
        : this.props.path,
  };

  elementList = new Array<JSX.Element>();

  componentDidMount() {
    this.setState({ loading: true }, () => {
      listAllDirectoriesOnWorkspace("Guest", "", this.state.path).then(
        (response) => {
          response.data.files.forEach(
            async (file: FileInfos, index: number, array: FileInfos[]) => {
              this.setState(
                (previousState) => ({
                  files: previousState.files.concat(file),
                }),
                () => {
                  this.setState({ loading: false });
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
                        name={
                          Buffer.from(this.state.path, "base64").toString(
                            "utf-8"
                          ) +
                          "/" +
                          this.state.files[index].name
                        }
                        type={this.state.files[index].type}
                      />
                      <div className="third">
                        <p className="element-name">
                            {this.state.files[index].name}
                        </p>
                        <p className="element-size">
                          {this.state.files[index].type === FileType.File
                            ? this.numberToReadableSize(
                                this.state.files[index].size
                              )
                            : this.fetchSubFolder(this.state.files[index].name)}
                        </p>
                      </div>
                    </Box>
                  );
                }
              );
            }
          );
        }
      );
    });
  }

  fetchSubFolder(folderName: string) {
    let nbOfSubElements = 0;
    this.setState({ loading: false }, async () => {
      await listAllDirectoriesOnWorkspace(
        "Guest",
        "",
        Buffer.from(
          Buffer.from(this.state.path, "base64").toString("utf-8") +
            "/" +
            folderName
        ).toString("base64")
      ).then((response) => {
        nbOfSubElements = response.data.files.length;
      });
    });
    return nbOfSubElements;
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
    return this.elementList;
  }

  render() {
    const { files, loading } = this.state;
    return files.length && !loading ? (
      <div>{this.renderDirectories()}</div>
    ) : (
      <span>Loading...</span>
    );
  }
}

export default DirectoryView;
