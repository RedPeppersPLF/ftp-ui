import React, {RefObject} from "react";
import "./second-navbar.scss"
import Add from "assets/icons/plus.png"
import Download from "assets/icons/double-bas.png"
import Delete from "assets/icons/multiplier.png"
import Details from "assets/icons/details.png"
import {deleteFileFromFtpServer, uploadFileToFtpServer} from "../../commons/axiosInstance";
import {getJwt} from "../../helpers/jwt";
import {FileType} from "../dashboard/directoryView/directoryView";

type FileInfos = {
  name: string;
  type: FileType;
  size: number;
  rawModifiedAt: string;
  modifiedAt: string;
};

class SecondNavbar extends React.Component<{path: string, handleNewFile: () => void, itemChecked: Array<FileInfos>}, { scrolled: boolean, selectedFiles: FileList | null }> {

  state = {
    scrolled: false,
    selectedFiles: null
  }

  inputOpenFileRef: RefObject<HTMLInputElement>

  constructor(props: {path: string, handleNewFile: () => void, itemChecked: Array<FileInfos>}) {
    super(props);
    this.inputOpenFileRef = React.createRef()
    this.handleUploadToServer.bind(this)
  }

  handleScroll() {
    const offset = window.scrollY;
    if (offset > 65) {
      this.setState(() => ({
        scrolled: true
      }));
    } else {
      this.setState(() => ({
        scrolled: false
      }));
    }
  }

  handleUploadToServer(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      selectedFiles: event.target.files,
    }, async() => {
      const selectedFiles: FileList = this.state.selectedFiles!
      for (let i = 0; i < selectedFiles!.length; i++) {
        const data = new FormData()
        data.append("file", selectedFiles[i])
        data.append("ftpPath", this.props.path)
        const ftpResponse = await uploadFileToFtpServer(getJwt(),data).then(res => {
          return res.data.ftpResponse
        })
        if(ftpResponse === 226){
          this.props.handleNewFile()
        } else {
          console.log(ftpResponse)
        }
      }
    })
  }

  handleDeleteFileToServer() {
    (async() => {
      for (let i = 0; i < this.props.itemChecked.length; i++) {
        const data = new FormData()
        data.append("fileName", this.props.itemChecked[i].name)
        data.append("ftpPath", this.props.path)
        const ftpResponse = await deleteFileFromFtpServer(getJwt(), data).then(res => {
          return res.data.ftpResponse
        })
        if(ftpResponse === 250){
          this.props.handleNewFile()
        } else {
          console.log(ftpResponse)
        }
      }
    })();
  }

  handleFileUpload() {
    this.inputOpenFileRef.current!.click()
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll.bind(this))
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this))
  }

  render() {
    let secondNavBarClass = "second-navbar"
    const {scrolled} = this.state
    secondNavBarClass = scrolled ? secondNavBarClass.concat(" sticky") : secondNavBarClass.concat("")
    return (
      <div className={secondNavBarClass}>
        <button onClick={this.handleFileUpload.bind(this)}>
          <img alt="Ajouter un fichier" src={Add}/>
          <span>
            <input type="file" ref={this.inputOpenFileRef} onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              this.handleUploadToServer(event)
            }} multiple style={{display: "none"}}/>
            Ajouter
          </span>
        </button>
        <button className="disabled"><img alt="Télécharger un fichier" src={Download}/><span>Télécharger</span></button>
        <button className={this.props.itemChecked.length === 0?"disabled":""} disabled={this.props.itemChecked.length === 0} onClick={this.handleDeleteFileToServer.bind(this)}><img alt="Supprimer un fichier" src={Delete}/><span>Supprimer</span></button>
        <button><img alt="" src={Details}/><span>Plus</span></button>
        <div className="progress-bar pb-download"><div className="progress-bar-download-2"/><span>D: 230 Mo/s</span></div>
        <div className="progress-bar pb-upload"><div className="progress-bar-upload-2"/><span>U: 20 Ko/s</span></div>
      </div>
    )
  }
}

export default SecondNavbar