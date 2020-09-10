import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Dashboard from 'components/dashboard/dashboard'
import MainNavBar from "components/navbar/main-navbar";
import {getJwt, setJwt} from "./helpers/jwt";
import {createGlobalStyle} from 'styled-components';
import {darkTheme, lightTheme, ThemeType} from "./assets/theme";
import {getTheme, setTheme} from "./helpers/theme";

type Props = {
  theme: ThemeType
}

export const GlobalStyles = createGlobalStyle<Props>`
  body {
    background: ${({theme}) => theme.backgroundColor};
    color: ${({theme}) => theme.textColor};
  }
  .main-navbar{
    background-color: ${({theme}) => theme.main};
    .navbar-buttons-icon:hover {
      background-color: ${({theme}) => theme.hoverMain};
    }
  }
  .second-navbar {
    background: ${({theme}) => theme.altBackgroundColor};
    &.sticky {
      background: ${({theme}) => theme.main};
      button {
        background: ${({theme}) => theme.main};
        color: ${({theme}) => theme.backgroundColor};
        &:hover {
          background-color: ${({theme}) => theme.hoverMain};
        }
        &.disabled:hover {
          background: ${({theme}) => theme.main};
        }
      }
    }
    button {
      background: ${({theme}) => theme.altBackgroundColor};
      color: ${({theme}) => theme.textColor};
      &.disabled {
        color: ${({theme}) => theme.altTextColor};
        &:hover {
          background-color: ${({theme}) => theme.altBackgroundColor};
        }
      }
      &:hover {
        background-color: ${({theme}) => theme.main};
      }
    }
  }
  .tree {
    .leaf a {
      color: ${({theme}) => theme.textColor};
    }
    &.sticky {
      background-color: ${({theme}) => theme.altBackgroundColor};
    }
  }
  .first { 
    .menu .el {
      background-color: ${({theme}) => theme.textColor};
    }
    .checkbox {
      border-color: ${({theme}) => theme.textColor};
    }
   }
  .second {
    background-color: ${({theme}) => theme.altBackgroundColor};
  }
  .modal-main {
    background-color: ${({theme}) => theme.altBackgroundColor};
  }
  .settings-main {
    background-color: ${({theme}) => theme.altBackgroundColor};
  }
  `

class App extends React.Component<{}, { jwt: string | null, theme: ThemeType }> {

  state = {
    jwt: getJwt(),
    theme: getTheme()==="light"?lightTheme:darkTheme
  }

  handleJwt(jwt: string | null) {
    this.setState(() => ({
      jwt: jwt
    }), () => setJwt(jwt))
  }
  handleTheme() {
    if(this.state.theme === darkTheme){
      this.setState(() => ({
        theme: lightTheme
      }))
      setTheme("light")
    } else {
      this.setState(() => ({
        theme: darkTheme
      }))
      setTheme("dark")
    }
  }

  render() {
    const {jwt, theme} = this.state
    return (
      <div className="App" id="App">
        <GlobalStyles theme={theme}/>
        <MainNavBar handleTheme={this.handleTheme.bind(this)} jwt={jwt} handleJwt={this.handleJwt.bind(this)}/>
        <Router>
          <Switch>
            <Route path="/dashboard" render={(props) => (
              <Dashboard {...props} jwt={jwt} handleJwt={this.handleJwt.bind(this)}/>
            )}>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  };
}

export default App;
