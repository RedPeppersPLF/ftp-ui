import React from "react";
import { Box } from "@material-ui/core";
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import "components/dashboard/directoryView/directoryView.scss";

class FileTree extends React.Component<{path: string}, {fileTree: Array<string>, loading: boolean}> {
    state = {
        fileTree: new Array<string>(),
        loading: true
    }

    pathList = new Array<JSX.Element>();

    componentDidMount() {
        console.log(this.props.path)
        this.setState((previousState, currentProps) => ({
                fileTree: (Buffer.from(currentProps.path.substr(1),'base64').toString('utf-8')).split("/")
            }), () => {
            this.state.fileTree.forEach((file: string, index: number) => {
                console.log(file)
                this.pathList.push(
                    <div className="leaf" key={index}>
                        <ArrowForwardIosRoundedIcon style={{ fontSize: 30, color: "#646464" }}/>
                        <a href={"/dashboard/"+((file==="" || index===0)?"":Buffer.from("/"+file).toString('base64'))}>{index===0?"home":file}</a>
                    </div>
                )
                this.setState({
                    loading: false
                })
            });
        })
    }

renderList() {
    return (
        <Box className="tree">{this.pathList}</Box>
    )
}

render() {
    return (
        !this.state.loading?this.renderList():<p>Baited</p>
    )
}
}
export default FileTree;