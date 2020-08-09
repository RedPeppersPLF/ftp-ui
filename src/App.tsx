import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Dashboard from 'components/dashboard/dashboard'
import MainNavBar from "components/navbar/main-navbar";
import {getJwt, setJwt} from "./helpers/jwt";
import { createGlobalStyle } from 'styled-components';
import {darkTheme, lightTheme, ThemeType} from "./assets/theme";

type Props = {
  theme: ThemeType
}

export const GlobalStyles = createGlobalStyle<Props>`
  body {
    background: ${({ theme }) => theme.backgroundColor};
    color: ${({ theme }) => theme.textColor};
  }
  .main-navbar{
    background-color: ${({ theme }) => theme.main};
  }
  .tree {
    background-color: ${({ theme }) => theme.backgroundColor};
    .leaf a {
      color: ${({ theme }) => theme.textColor};
    }
  }
  .second {
    background-color: ${({ theme }) => theme.altBackgroundColor};
  }
  .modal-main {
    background-color: ${({ theme }) => theme.altBackgroundColor};
  }
  `

class App extends React.Component<{}, { jwt: string | null }> {

  state = {
    jwt: getJwt()
  }

  handleJwt(jwt: string) {
    setJwt(jwt)
    this.setState(() => ({
      jwt: jwt
    }))
  }

  render() {
    const {jwt} = this.state
    return (
      <div className="App" id="App">
        <MainNavBar handleJwt={this.handleJwt.bind(this)}/>
          <GlobalStyles theme={lightTheme} />
          <Router>
            <Switch>
              <Route path="/dashboard" render={(props) => (
                <Dashboard {...props} jwt={jwt} />
              )}>
              </Route>
            </Switch>
          </Router>
      </div>
    );
  };
}

export default App;
