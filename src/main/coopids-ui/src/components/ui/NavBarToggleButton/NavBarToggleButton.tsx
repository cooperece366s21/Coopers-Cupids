import React, {Component} from "react";
import {Box} from "@chakra-ui/react";
import {CloseIcon, HamburgerIcon} from "@chakra-ui/icons";

type ToggleProps = {onToggle: () => void; isOpen: boolean};
type ToggleState = {};

class NavBarToggleButton extends Component<ToggleProps, ToggleState> {
    render() {
        return (
            <Box display={{base: "block", md: "none"}} onClick={this.props.onToggle}>
                {this.props.isOpen ? <CloseIcon /> : <HamburgerIcon />}
            </Box>
        );
    }
}

export default NavBarToggleButton;