import React, {Component} from 'react';
import {Link, Text} from "@chakra-ui/react";
import {Link as RouterLink} from "react-router-dom";

type NavBarLinkProps = {linkTo: string; onPageChange: () => void};
type NavBarLinkState = {};

class NavBarLink extends Component<NavBarLinkProps,NavBarLinkState> {
    render() {
        return (
            <Link as={RouterLink} to={this.props.linkTo} onClick={this.props.onPageChange}
                  _focus={{outline: "none"}} _hover={{textDecoration: "none", color: "#F2BBC1"}}>
                <Text display="block">
                    {this.props.children}
                </Text>
            </Link>
        );
    }
}

export default NavBarLink;