import React, {SyntheticEvent} from "react";
import {Box} from "@material-ui/core";
import "components/dashboard/directoryView/directoryView.scss";
import ElementCheckbox from "./elementCheckbox";
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

class DirectoryView extends React.Component<{ path: string, files: Array<FileInfos>, handleItemsChecked: (item: FileInfos, checked: boolean) => void},{ path: string, elementChecked: boolean[] }> {
  state = {
    path: this.props.path,
    elementChecked: new Array<boolean>(this.props.files.length).fill(false)
  };

  elementList = new Array<JSX.Element>();

  toggleCheck(event: SyntheticEvent, item: FileInfos){
    const { elementChecked } = this.state
    !elementChecked[Number.parseInt(event.currentTarget.classList[3])]?this.props.handleItemsChecked(item, true):this.props.handleItemsChecked(item, false)
    elementChecked[Number.parseInt(event.currentTarget.classList[3])] = !elementChecked[Number.parseInt(event.currentTarget.classList[3])]
    this.setState(() => ({
      elementChecked: elementChecked
    }))
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
    this.elementList = this.props.files
      .sort((file1, file2) => {
        return file1.name.localeCompare(file2.name)
      })
      .map((item, i) =>
        <Box component={"div"} key={i} className={`element-wrapper ${i} ${this.state.elementChecked[i] ? "checked" : ""}`} onClick={(event: SyntheticEvent<Element, Event>) => {this.toggleCheck(event, item)}}>
          <div className="first">
            <div className="checkbox">
              <img alt="" src={Tick}/>
            </div>
            <div className="menu">
              <div className="el"/>
              <div className="el"/>
              <div className="el"/>
            </div>
          </div>
          <ElementCheckbox
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
      )
    return this.renderElementList()
  }
}

export default DirectoryView;
