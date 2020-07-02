import React from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#EF3B3A",
    },
  },
});

const App: React.FC = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path="/homepage">
            </Route>
            <Redirect exact from="/" to="homepage" />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
};

export default App;
