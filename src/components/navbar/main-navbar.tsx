import React from "react";
import {Box, Typography} from "@material-ui/core";
import Cloud from "assets/icons/cloud-uploading.png"
import {
  PermIdentityTwoTone,
  SettingsTwoTone,
  LockOutlined,
  PermIdentityOutlined,
} from "@material-ui/icons";
import ConnexionModal from "components/navbar/connexion/connexion-modal";
import "./main-navbar.scss";
import {connectToFtpServer, disconnectFromFtpServer} from "../../commons/axiosInstance";
import {getJwt} from "../../helpers/jwt";

class MainNavBar extends React.Component<{ handleJwt: (jwt: string) => void },
  { modalIsOpen: boolean; className: string, userInputFocused: boolean, passwordInputFocused: boolean, loginMessage: string }> {
  state = {
    modalIsOpen: false,
    className: "",
    userInputFocused: false,
    passwordInputFocused: false,
    loginMessage: ""
  };

  jwt = getJwt()
  loginError = ""

  componentDidMount() {
    if (!this.jwt) {
      this.handleModal()
    }
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget
    const formData = new FormData(form)
    connectToFtpServer(formData).then((response) => {
      this.props.handleJwt(response.data)
      this.setState(() => ({loginMessage: ""}))
      this.handleModal()
    }).catch((error) => {
      this.loginError = error.message
      if (this.loginError === "Request failed with status code 530") {
        this.setState(() => ({loginMessage: "Identifiant ou mot de passe incorrect"}))
      }
    })
    this.jwt = getJwt()
  };

  handleLogout() {
    disconnectFromFtpServer(this.jwt)
    this.props.handleJwt("")
    this.handleModal()
  }

  renderErrorLoginForm() {
    const {userInputFocused, passwordInputFocused} = this.state;
    return (
      <>
        <label className={userInputFocused ? "focused label-error" : "label-error"}>
          <div className="label-icon">
            <PermIdentityOutlined style={{fontSize: 50, color: "#b50000"}}/>
          </div>
          <input type="text" id="username" name="username" autoComplete="new-password" onFocus={() => {
            this.usernameFocus()
          }} onBlur={() => {
            this.hideAllFocus()
          }} required/>
          <div className="label-text">Identifiant</div>
        </label>
        <label className={passwordInputFocused ? "focused label-error" : "label-error"}>
          <div className="label-icon">
            <LockOutlined style={{fontSize: 50, color: "#b50000"}}/>
          </div>
          <input type="password" id="password" name="password" autoComplete="new-password" onFocus={() => {
            this.passwordFocus()
          }} onBlur={() => {
            this.hideAllFocus()
          }} required/>
          <div className="label-text">Mot de passe</div>
        </label>
      </>
    )
  }

  renderNoErrorLoginForm() {
    const {userInputFocused, passwordInputFocused} = this.state;
    return (
      <>
        <label className={userInputFocused ? "focused" : ""}>
          <div className="label-icon">
            <PermIdentityOutlined style={{fontSize: 50, color: "#808080"}}/>
          </div>
          <input type="text" id="username" name="username" autoComplete="new-password" onFocus={() => {
            this.usernameFocus()
          }} onBlur={() => {
            this.hideAllFocus()
          }} required/>
          <div className="label-text">Identifiant</div>
        </label>
        <label className={passwordInputFocused ? "focused" : ""}>
          <div className="label-icon">
            <LockOutlined style={{fontSize: 50, color: "#808080"}}/>
          </div>
          <input type="password" id="password" name="password" autoComplete="new-password" onFocus={() => {
            this.passwordFocus()
          }} onBlur={() => {
            this.hideAllFocus()
          }} required/>
          <div className="label-text">Mot de passe</div>
        </label>
      </>
    )
  }

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
            this.jwt = getJwt()
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

  renderLoginForm() {
    const { loginMessage } = this.state
    return (
      <form onSubmit={this.handleSubmit.bind(this)} id="login-form" className="log-in" autoComplete="off">
        <Typography variant="h4">
          Page de <span>Connexion</span>
        </Typography>
        <Typography variant="h5">{loginMessage}</Typography>
        {loginMessage===""?this.renderNoErrorLoginForm():this.renderErrorLoginForm()}
        <input className="login" type="submit" value="Connexion"/>
      </form>)
  }

  renderLogoutForm() {
    return (
      <form id="login-form" className="log-in" autoComplete="off">
        <Typography variant="h4">
          Vous êtes <span>Connecté(e)</span>
        </Typography>
        <button className="logout" onClick={() => {
          this.handleLogout()
        }}>Deconnexion
        </button>
      </form>
    )
  }

  render() {
    const {modalIsOpen, className} = this.state;
    return (
      <Box className="main-navbar">
        <Typography variant="h3">FTP Drive</Typography>
        <Box className="navbar-buttons">
          <div className="navbar-buttons-icon">
            <SettingsTwoTone style={{fontSize: 40, color: "#646464"}}/>
          </div>
          <div
            onClick={this.handleModal.bind(this)}
            className="navbar-buttons-icon"
          >
            <PermIdentityTwoTone style={{fontSize: 40, color: "#646464"}}/>
          </div>
          <ConnexionModal show={modalIsOpen} handleModal={this.handleModal}>
            <div className={className}>
              <div className="left">
                <img alt="" src={Cloud}/>
              </div>
              {this.jwt ? this.renderLogoutForm() : this.renderLoginForm()}
            </div>
          </ConnexionModal>
        </Box>
      </Box>
    );
  }
}

export default MainNavBar;
