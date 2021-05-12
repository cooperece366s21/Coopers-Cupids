import React, {Component} from "react";
import {Box, Grid, Heading, Stack, Text} from "@chakra-ui/react";
import LoginSignupForm from "../../ui/LoginSignupForm/LoginSignupForm";
import FeatureItem from "../../ui/FeatureItem/FeatureItem";

type HomeLayoutProps = {isLoggedIn: boolean; updateLogin: () => void};
type HomeLayoutState = {};

class HomeLayout extends Component<HomeLayoutProps,HomeLayoutState> {

    render() {
        return (
            <Box w="100%" align="center">
                <Stack spacing={2} pt={8} pb={20} pl={6} pr={6} maxW="1200px" alignContent="center">
                    <Heading>Welcome to Cooper's Cupids</Heading>
                    <Heading pb={6}>We're here to make your love life better</Heading>
                    {this.props.isLoggedIn ? null : <LoginSignupForm updateLogin={this.props.updateLogin }/>}

                    {/* About */}
                    <Heading size="md" pt={8} pb={4}> About Cooper's Cupids </Heading>
                    <Text p={4} pt={0} align="justify">
                        Are your unhappy in your current relationship? Are you lonely, but don't know any single people
                        in your area? Well, worry no more! Whether you're going through a mid-life crisis or just
                        getting into the game, Cooper's Cupids (Coopids) is the website for you. Cooper's Coopids is
                        the newest and most elite dating app of the decade. With our seamless profile creation,
                        state-of-the-art feed building algorithm, and a conversation interface that will keep you
                        talking all night long, we will make sure you find that special someone and solve all of life's
                        woes.
                    </Text>

                    {/* Features */}
                    <Heading size="md" pt={8} pb={4}> How We'll Help You Find That Special Someone </Heading>
                    <Grid templateColumns={["repeat(1,auto)","repeat(1,auto)","repeat(2,auto)","repeat(2,auto)"]}
                          w="fill" align="center">
                        <FeatureItem iconType={"profile"}
                                     featureText={"Build a unique profile that showcases you"} />
                        <FeatureItem iconType={"users"}
                                     featureText={"View exciting people in your area, filtered to your liking"} />
                        <FeatureItem iconType={"match-making"}
                                     featureText={"Find your perfect date with our one-of-a-kind matchmaking algorithm"} />
                        <FeatureItem iconType={"messages"}
                                     featureText={"Strike up a wonderful conversation with your match"} />
                    </Grid>
                </Stack>
            </Box>
            );
    }
}

export default HomeLayout;
