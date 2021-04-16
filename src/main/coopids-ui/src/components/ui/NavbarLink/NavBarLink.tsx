import React, {Component} from 'react';
import {Link, Text} from "@chakra-ui/react";

type NavBarLinkProps = {linkTo: string};
type NavBarLinkState = {};

class NavBarLink extends Component<NavBarLinkProps,NavBarLinkState> {
    render() {
        return (
            <Link href={this.props.linkTo}>
                <Text display="block">
                    {this.props.children}
                </Text>
            </Link>
        );
    }
}

export default NavBarLink;