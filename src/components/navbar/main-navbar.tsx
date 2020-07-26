import React from "react";
import { Box, Typography } from "@material-ui/core";
import Cloud from "assets/icons/cloud-uploading.png"
import {
  PermIdentityTwoTone,
  SettingsTwoTone,
  LockOutlined,
  PermIdentityOutlined,
} from "@material-ui/icons";
import ConnexionModal from "components/navbar/connexion/connexion-modal";
import "./main-navbar.scss";

class MainNavBar extends React.Component<
  {},
  { modalIsOpen: boolean; className: string, userInputFocused: boolean, passwordInputFocused: boolean }
> {
  state = {
    modalIsOpen: false,
    className: "",
    userInputFocused: false,
    passwordInputFocused: false
  };

  handleModal() {
    if (!this.state.modalIsOpen) {
      this.setState((previousState) => ({
        modalIsOpen: !previousState.modalIsOpen,
        className: "modal-main fade-in",
      }));
    } else if (this.state.modalIsOpen) {
      this.setState(
        {
          className: "modal-main fade-out",
        },
        () => {
          setTimeout(() => {
            this.setState((previousState) => ({
              modalIsOpen: !previousState.modalIsOpen,
            }));
          }, 210);
        }
      );
    }
  }

  hideAllFocus() {
    this.setState({
      userInputFocused: false,
      passwordInputFocused: false
    })
  }
  usernameFocus() {
    this.setState({
      userInputFocused: true,
      passwordInputFocused: false
    })
  }

  passwordFocus() {
    this.setState({
      userInputFocused: false,
      passwordInputFocused: true
    })
  }

  render() {
    const { modalIsOpen, className, userInputFocused, passwordInputFocused } = this.state;
    return (
      <Box className="main-navbar">
        <Typography variant="h3">FTP Drive</Typography>
        <Box className="navbar-buttons">
          <div className="navbar-buttons-icon">
            <SettingsTwoTone style={{ fontSize: 40, color: "#646464" }} />
          </div>
          <div
            onClick={this.handleModal.bind(this)}
            className="navbar-buttons-icon"
          >
            <PermIdentityTwoTone style={{ fontSize: 40, color: "#646464" }} />
          </div>
          <ConnexionModal show={modalIsOpen} handleModal={this.handleModal}>
            <div className={className}>
                <div className="left">
                  <img alt="" src={Cloud}></img>
                </div>
                <form action="" className="log-in" autoComplete="off">
                  <Typography variant="h4">
                    Page de <span>Connexion</span>
                  </Typography>
                  <label className={userInputFocused?"focused":""}>
                    <div className="label-icon">
                      <PermIdentityOutlined style={{ fontSize: 60, color: "#808080" }} />
                    </div>
                    <input type="text" autoComplete="new-password" onFocus={()=>{this.usernameFocus()}} onBlur={()=>{this.hideAllFocus()}} required />
                    <div className="label-text">Identifiant</div>
                  </label>
                  <label className={passwordInputFocused?"focused":""}>
                    <div className="label-icon">
                      <LockOutlined style={{ fontSize: 60, color: "#808080" }} />
                    </div>
                    <input type="password" autoComplete="new-password" onFocus={()=>{this.passwordFocus()}} onBlur={()=>{this.hideAllFocus()}} required />
                    <div className="label-text">Mot de passe</div>
                  </label>
                </form>
            </div>
          </ConnexionModal>
        </Box>
      </Box>
    );
  }
}

export default MainNavBar;
