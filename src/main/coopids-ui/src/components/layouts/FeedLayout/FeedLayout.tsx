import React, {Component} from "react";
import {dislike, getFeed, like, Profile} from "../../../services/api";
import {Button, Flex, Heading, Spacer, Stack} from "@chakra-ui/react";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";

type FeedLayoutProps = {};
type FeedLayoutState = {feedList: Profile[], currentUser: number};

class FeedLayout extends Component<FeedLayoutProps,FeedLayoutState> {
    constructor(props: FeedLayoutProps) {
        super(props);
        this.state = {feedList: [], currentUser: 1};
    }

    async componentDidMount() {
        const feed = await getFeed() || [];
        this.setState({feedList: feed, currentUser: 0});
    }

    async updateFeed() {
        // Checks if ran out of feed
        if(this.state.currentUser >= this.state.feedList.length-1) {
            const feed = await getFeed();
            this.setState({feedList: feed, currentUser: 0});
        } else {
            this.setState({currentUser: this.state.currentUser + 1});
        }
    }

    likeClick = async () => {
        await like(this.state.feedList[this.state.currentUser].userID);
        await this.updateFeed();
    }

    dislikeClick = async () => {
        await dislike(this.state.feedList[this.state.currentUser].userID);
        await this.updateFeed();
    }

    render() {
        // TODO: Maybe differentiate empty vs no profile based on null response from API
        // API gives [] when empty, null when no profile
        if(this.state.feedList.length === 0) {
            return (
                <Heading>Feed is empty<br/>Please create a profile or convince your friends to join Coopids</Heading>
            )
        }
        if(this.state.currentUser >= this.state.feedList.length) {
            return (
                <Heading>Loading Feed...</Heading>
            )
        }

        return (
                // TODO: Only show this if current user has a profile
                <Stack width="full" align="center" justifyContent="center" spacing={4}>
                    <ProfileViewer isEditing={false} profile={this.state.feedList[this.state.currentUser]}
                                   hasProfile={true} editProfile={()=>{}} />
                    <Flex w={"50%"} pt={4}>
                        <Button colorScheme="yellow" float="left" type="submit" w={"40%"}
                                onClick={this.dislikeClick}>
                            Dislike
                        </Button>
                        <Spacer />
                        <Button colorScheme="green" float="right" type="submit" w={"40%"}
                                onClick={this.likeClick}>
                            Like
                        </Button>
                    </Flex>
                </Stack>
            )
    }
}

export default FeedLayout;
