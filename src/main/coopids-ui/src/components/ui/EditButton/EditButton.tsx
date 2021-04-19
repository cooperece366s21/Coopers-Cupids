import React, { Component } from "react";
import {Button} from "@chakra-ui/react";

type EditButtonProps = {has_profile: boolean; onClick: () => void};
type EditButtonState = {};

class EditButton extends Component<EditButtonProps, EditButtonState> {
    
    render() {
        const button_text = this.props.has_profile ? "Edit Profile" : "Create Profile";

        return (
            <Button variant="ghost" onClick={this.props.onClick}>
                {button_text}
            </Button>
        )
    }
}

export default EditButton;