import React from "react";
import {getJwt} from "../helpers/jwt";

export class Authenticated extends React.Component<{},{}> {
  state = {
    user: undefined
  }

  componentDidMount() {
    const jwt = getJwt()
  }
}