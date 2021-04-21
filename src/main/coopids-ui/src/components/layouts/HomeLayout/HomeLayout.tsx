import React, {Component} from "react";
import {Heading, Stack} from "@chakra-ui/react";
import LoginSignupForm from "../../ui/LoginSignupForm/LoginSignupForm";

type HomeLayoutProps = {isLoggedIn: boolean; updateLogin: () => void};
type HomeLayoutState = {};

class HomeLayout extends Component<HomeLayoutProps,HomeLayoutState> {

    render() {
        return (
                <Stack spacing={2}>
                    <Heading>Welcome to Cooper's Cupids</Heading>
                    <Heading pb={6}>We're here to make your love life better</Heading>
                    {this.props.isLoggedIn ? null : <LoginSignupForm updateLogin={this.props.updateLogin }/>}
                </Stack>
            );
    }
}

export default HomeLayout;
