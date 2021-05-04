import React, { Component } from "react";
import {Button, color} from "@chakra-ui/react";

type EditButtonProps = {hasProfile: boolean; onClick: () => void};
type EditButtonState = {};

class EditButton extends Component<EditButtonProps, EditButtonState> {
    
    render() {
        const buttonText = this.props.hasProfile ? "Edit Profile" : "Create Profile";

        return (
            <Button variant="ghost" onClick={this.props.onClick}
            _hover={{color: "#F2BBC1", background: "#FFFFFF"}}>
                {buttonText}
            </Button>
        )
    }
}

export default EditButton;