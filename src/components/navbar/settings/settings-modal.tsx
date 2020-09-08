import React from "react";
import "./settings-modal.scss"

class SettingsModal extends React.Component<{show: boolean, handleSettingsModal: () => void, children: JSX.Element},{}> {

  render()  {
    const hideShowModal = this.props.show?"display-block":"display-none";
    return (
      <div className={hideShowModal}>
        {this.props.children}
      </div>
    )
  }
}

export default SettingsModal;