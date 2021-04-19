import React, { Component } from "react";
import {Button} from "@chakra-ui/react";
import {Profile} from "../../../services/api";

type EditButtonProps = {is_editing: boolean; onClick: (profile: Profile) => void};
type EditButtonState = {};

class EditButton extends Component<EditButtonProps, EditButtonState> {
    
    render() {
        const button_text = this.props.is_editing ? "Save" : "Edit";
        const button_type = this.props.is_editing ? "submit" : "button"

        return (
            <Button variant="ghost">
                {button_text}
            </Button>
        )
    }
}

export default EditButton;