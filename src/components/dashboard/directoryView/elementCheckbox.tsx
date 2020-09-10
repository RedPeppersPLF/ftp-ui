import React from "react";
import { Box } from "@material-ui/core";
import "components/dashboard/directoryView/directoryView.scss";
import { FileType } from "./directoryView";
import Zip from "assets/icons/zip.png";
import Txt from "assets/icons/txt.png";
import File from "assets/icons/file.svg";
import Folder from "assets/icons/folder.svg"

class ElementCheckbox extends React.Component<{index: number, name: string, type: FileType}, {}> {
  
  fetchThumbnail(name: string, type: number) {
    const regex = /(?:\.([^.]+))?$/;
    const filextension = regex.exec(name)?.toString().slice(0, 4);
    let thumbnail: JSX.Element = <div></div>;
    if (type === FileType.File) {
      switch (filextension) {
        case ".zip":
        thumbnail = <img alt="Zip file" src={Zip} />;
        break;
        case ".txt":
        thumbnail = <img alt="Txt file" src={Txt} />;
        break;
        default:
        thumbnail = <img alt="File" src={File} />;
        break;
      }
    } else if (type === FileType.Directory) {
      thumbnail = <div className="folder"><a href={"/dashboard"+(name===""?"/":"/"+Buffer.from(name).toString('base64'))}><img alt="Folder" src={Folder} /></a></div>;
    }
    return thumbnail;
  }
  
  render() {
    return (
      <Box className="second">
      {this.fetchThumbnail(
        this.props.name,
        this.props.type
      )}</Box>
    )
  }
}

export default ElementCheckbox;