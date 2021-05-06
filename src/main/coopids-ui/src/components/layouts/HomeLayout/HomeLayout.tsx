import React, {Component} from "react";
import {Grid, Heading, Stack, Text} from "@chakra-ui/react";
import LoginSignupForm from "../../ui/LoginSignupForm/LoginSignupForm";
import FeatureItem from "../../ui/FeatureItem/FeatureItem";

type HomeLayoutProps = {isLoggedIn: boolean; updateLogin: () => void};
type HomeLayoutState = {};

class HomeLayout extends Component<HomeLayoutProps,HomeLayoutState> {

    render() {
        return (
                <Stack spacing={2} pt={8} pb={20}>
                    <Heading>Welcome to Cooper's Cupids</Heading>
                    <Heading pb={6}>We're here to make your love life better</Heading>
                    {this.props.isLoggedIn ? null : <LoginSignupForm updateLogin={this.props.updateLogin }/>}

                    {/* About */}
                    <Heading size="md" pt={8} pb={4}> About Cooper's Cupids </Heading>
                    <Text p={4} pt={0} align="justify"> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
                        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Text>

                    {/* Features */}
                    <Heading size="md" pt={8} pb={4}> How We'll Help You Find That Special Someone </Heading>
                    <Grid templateColumns={["repeat(1,auto)","repeat(1,auto)","repeat(2,auto)","repeat(2,auto)"]}
                          w="fill" align="center">
                        <FeatureItem iconType={"profile"}
                                     featureText={"Build a unique profile that showcases you"} />
                        <FeatureItem iconType={"users"}
                                     featureText={"View exciting people in your area, filtering to your liking"} />
                        <FeatureItem iconType={"match-making"}
                                     featureText={"Find your perfect date with our one-of-a-kind matchmaking algorithm"} />
                        <FeatureItem iconType={"messages"}
                                     featureText={"Strike up a wonderful conversation with your match"} />
                    </Grid>
                </Stack>
            );
    }
}

export default HomeLayout;
