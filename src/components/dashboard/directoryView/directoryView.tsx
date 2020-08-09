import React from "react";
import {Box} from "@material-ui/core";
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

class DirectoryView extends React.Component<{ path: string, files: Array<FileInfos>},{ listLoading: boolean, path: string }> {
  state = {
    listLoading: true,
    path: this.props.path
  };

  elementList = new Array<JSX.Element>();

  componentDidMount() {
      const dataFromServer = this.props.files
        .sort((file1, file2) => {
          return file1.name.localeCompare(file2.name)
        })
        .map((item, i) =>
          <Box key={i} className="element-wrapper">
            <div className="first">
              <div className="checkbox">
                <img alt="checked" src={Tick}/>
              </div>
              <div className="menu">
                <div className="el"></div>
                <div className="el"></div>
                <div className="el"></div>
              </div>
            </div>
            <DirectoryCheckbox
              index={i}
              name={`${this.state.path}/${item.name}`}
              type={item.type}
            />
            <div className="third">
              <p className="element-name">
                {item.name}
              </p>
              <p className="element-size">{this.numberToReadableSize(item.size)}</p>
            </div>
          </Box>
        );
      this.setState(() => ({
        listLoading: false
      }))
      this.elementList = dataFromServer
  }

  numberToReadableSize(size: number) {
    if (size.toString().length > 9) {
      return (size / 1073741824).toPrecision(3).toString().concat(" Go");
    } else if (size.toString().length > 6) {
      return (size / 1048576).toPrecision(3).toString().concat(" Mo");
    } else if (size.toString().length > 3) {
      return (size / 1024).toPrecision(3).toString().concat(" Ko");
    } else {
      return "< 1 Ko";
    }
  }

  renderElementList() {
    return this.elementList;
  }

  render() {
    const {listLoading} = this.state
    return (listLoading)?"":this.renderElementList()
  }
}

export default DirectoryView;
