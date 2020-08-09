import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import Dashboard from 'components/dashboard/dashboard'
import MainNavBar from "components/navbar/main-navbar";
import {getJwt, setJwt} from "./helpers/jwt";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#EF3B3A",
    },
  },
});

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
        <ThemeProvider theme={theme}>
          <Router>
            <Switch>
              <Route path="/dashboard" render={(props) => (
                <Dashboard {...props} jwt={jwt} />
              )}>
              </Route>
            </Switch>
          </Router>
        </ThemeProvider>
      </div>
    );
  };
}

export default App;
