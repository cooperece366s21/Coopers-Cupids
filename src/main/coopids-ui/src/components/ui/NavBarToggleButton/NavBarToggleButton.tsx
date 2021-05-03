import React, {Component} from "react";
import {GridItem} from "@chakra-ui/react";
import {CloseIcon, HamburgerIcon} from "@chakra-ui/icons";

type ToggleProps = {onToggle: () => void; isOpen: boolean};
type ToggleState = {};

class NavBarToggleButton extends Component<ToggleProps, ToggleState> {
    render() {
        return (
            <GridItem display={{base: "inline", md: "none"}} onClick={this.props.onToggle}
                justifySelf="flex-end">
                {this.props.isOpen ? <CloseIcon boxSize={4} /> : <HamburgerIcon boxSize={6} />}
            </GridItem>
        );
    }
}

export default NavBarToggleButton;