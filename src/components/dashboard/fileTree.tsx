import React from "react";
import {Box} from "@material-ui/core";
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import "components/dashboard/directoryView/directoryView.scss";

class FileTree extends React.Component<{ path: string }, { fileTree: Array<string>, loading: boolean, scrolled: boolean }> {
  state = {
    fileTree: new Array<string>(),
    loading: true,
    scrolled: false,
  }

  handleScroll() {
    const offset=window.scrollY;
    if(offset > 80 ){
      this.setState(() => ({
        scrolled: true
      }));
    }
    else{
      this.setState(() => ({
        scrolled: false
      }));
    }
  }

  pathList = new Array<JSX.Element>();

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this))
    this.setState((previousState, currentProps) => ({
      fileTree: currentProps.path.split("/")
    }), () => {
      let fullPath = "";
      this.state.fileTree.forEach((file: string, index: number) => {
        (index === 0 || index === 1) ? fullPath += file : fullPath = fullPath + "/" + file;
        this.pathList.push(
          <div className="leaf" key={index}>
            <ArrowForwardIosRoundedIcon style={{fontSize: 30, color: "#646464"}}/>
            <a href={"/dashboard" + (file === "" ? "" : "/" + Buffer.from("/" + fullPath).toString('base64'))}>
              {file === "" ? "home" : file}
            </a>
          </div>
        )
        this.setState({
          loading: false
        })
      });
    })
  }

  renderList() {
    let treeClass = "tree"
    const { scrolled } = this.state
    treeClass = scrolled?treeClass.concat(" sticky"):treeClass.concat("")
    return (
      <Box className={treeClass}>{this.pathList}</Box>
    )
  }

  render() {
    return (
      !this.state.loading ? this.renderList() : <p>Loading</p>
    )
  }
}

export default FileTree;