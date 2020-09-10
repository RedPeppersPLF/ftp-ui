import React from "react";
import "./connexion-modal.scss"

class ConnexionModal extends React.Component<{show: boolean, children: JSX.Element},{}> {

  render()  {
    const hideShowModal = this.props.show?"modal display-block":"modal display-none";
    return (
      <div className={hideShowModal}>
        {this.props.children}
      </div>
    )
  } 
}
  
  export default ConnexionModal;
  