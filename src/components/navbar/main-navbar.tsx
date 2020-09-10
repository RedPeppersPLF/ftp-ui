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
import SettingsModal from "components/navbar/settings/settings-modal";
import "./main-navbar.scss";
import {connectToFtpServer, disconnectFromFtpServer} from "../../commons/axiosInstance";
import {getTheme} from "../../helpers/theme";

class MainNavBar extends React.Component<{ handleJwt: (jwt: string | null) => void, handleTheme: () => void, jwt: string | null },
  { modalIsOpen: boolean, modalSettingsIsOpen: boolean, className: string, modalSettingsClassName: string, userInputFocused: boolean, passwordInputFocused: boolean, loginMessage: string}> {
  state = {
    modalIsOpen: false,
    modalSettingsIsOpen: false,
    className: "",
    modalSettingsClassName: "",
    userInputFocused: false,
    passwordInputFocused: false,
    loginMessage: "",
  };

  loginError = ""

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPressed.bind(this), false)
    if (!this.props.jwt) {
      this.handleLoginModal()
    }
    setInterval(
      () => {
        if(!this.props.jwt && !this.state.modalIsOpen) {
          this.updateModal()
        }
      },
      1000
    );
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPressed.bind(this), false)
  }

  updateModal() {
    this.handleLoginModal()
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget
    const formData = new FormData(form)
    connectToFtpServer(formData).then((response) => {
      this.props.handleJwt(response.data)
      this.setState(() => ({
        loginMessage: "",
      }))
      this.handleLoginModal()
    }).catch((error) => {
      this.loginError = error.message
      if (this.loginError === "Request failed with status code 530") {
        this.setState(() => ({loginMessage: "Identifiant ou mot de passe incorrect"}))
      }
    })
  };

  handleLogout() {
    disconnectFromFtpServer(this.props.jwt)
    this.props.handleJwt(null)
    this.handleLoginModal()
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
        <label className={userInputFocused ? "login-label focused" : "login-label"}>
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
        <label className={passwordInputFocused ? "login-label focused" : "login-label"}>
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

  handleLoginModal() {
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

  handleSettingsModal() {
    if (!this.state.modalSettingsIsOpen) {
      this.setState((previousState) => ({
        modalSettingsIsOpen: !previousState.modalSettingsIsOpen,
        modalSettingsClassName: "settings-main appear",
      }));
    } else if (this.state.modalSettingsIsOpen) {
      this.setState(
        {
          modalSettingsClassName: "settings-main disappear",
        },
        () => {
          setTimeout(() => {
            this.setState((previousState) => ({
              modalSettingsIsOpen: !previousState.modalSettingsIsOpen,
            }));
          }, 210);
        }
      );
    }
  }

  handleKeyPressed(event: KeyboardEvent) {
    if (this.state.modalIsOpen && event.key === "Escape") {
      this.handleLoginModal()
    }
    if (this.state.modalSettingsIsOpen && event.key === "Escape") {
      this.handleSettingsModal()
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
    const {loginMessage} = this.state
    return (
      <form onSubmit={this.handleSubmit.bind(this)} id="login-form" className="log-in" autoComplete="off">
        <Typography variant="h4">
          Page de <span>Connexion</span>
        </Typography>
        <Typography variant="h5">{loginMessage}</Typography>
        {loginMessage === "" ? this.renderNoErrorLoginForm() : this.renderErrorLoginForm()}
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
    const {modalIsOpen, modalSettingsIsOpen, modalSettingsClassName, className} = this.state;
    if (modalIsOpen || modalSettingsIsOpen) {
      document.body.style.overflow = 'hidden'
      window.scrollTo(0, 0)
    } else {
      document.body.style.overflow = 'unset';
    }
    return (
      <Box className="main-navbar">
        <Typography variant="h3"><a href="/dashboard">FTP Drive</a></Typography>
        <Box className="navbar-buttons">
          <div className="navbar-buttons-icon" onClick={this.handleSettingsModal.bind(this)}>
            <SettingsTwoTone style={{fontSize: 40, color: "#646464"}}/>
          </div>
          <SettingsModal show={modalSettingsIsOpen} handleSettingsModal={this.handleSettingsModal}>
            <div className={modalSettingsClassName}>
              <div className="wrapper">
                <p>Theme :</p>
                <span className="switcher switcher-1">
                   <input type="checkbox" checked={getTheme()==="light"} onChange={this.props.handleTheme}/>
                   <label className="switcher-label"></label>
                </span>
              </div>
            </div>
          </SettingsModal>
          <div
            className="navbar-buttons-icon"
            onClick={this.handleLoginModal.bind(this)}
          >
            <PermIdentityTwoTone style={{fontSize: 40, color: "#646464"}}/>
          </div>
          <ConnexionModal show={modalIsOpen}>
            <div className={className}>
              <div className="left">
                <img alt="" src={Cloud}/>
              </div>
              {this.props.jwt ? this.renderLogoutForm() : this.renderLoginForm()}
            </div>
          </ConnexionModal>
        </Box>
      </Box>
    );
  }
}

export default MainNavBar;
