import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import Dashboard from 'components/dashboard/dashboard'
import MainNavBar from "components/navbar/main-navbar";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#EF3B3A",
    },
  },
});

const App: React.FC = () => {
  return (
    <div className="App" id="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/dashboard">
              <MainNavBar/>
              <Dashboard/>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
