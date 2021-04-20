import React, {Component} from "react";
import {Heading, Stack} from "@chakra-ui/react";
import LoginSignupForm from "../../ui/LoginSignupForm/LoginSignupForm";

type HomeLayoutProps = {is_logged_in: boolean; update_login: () => void};
type HomeLayoutState = {};

class HomeLayout extends Component<HomeLayoutProps,HomeLayoutState> {
    constructor(props: HomeLayoutProps) {
        super(props);
    }

    render() {
        return (
                <Stack spacing={2}>
                    <Heading>Welcome to Cooper's Cupids</Heading>
                    <Heading pb={6}>We're here to make your love life better</Heading>
                    {this.props.is_logged_in ? null : <LoginSignupForm update_login={this.props.update_login }/>}
                </Stack>
            );
    }
}

export default HomeLayout;
