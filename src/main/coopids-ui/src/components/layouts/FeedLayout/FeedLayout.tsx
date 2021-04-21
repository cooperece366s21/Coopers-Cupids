import React, {Component} from "react";
import {dislike, getFeed, like, Profile} from "../../../services/api";
import {Button, Flex, Heading, Spacer, Stack} from "@chakra-ui/react";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";

type FeedLayoutProps = {};
type FeedLayoutState = {feed_list: Profile[], current_user: number};

class FeedLayout extends Component<FeedLayoutProps,FeedLayoutState> {
    constructor(props: FeedLayoutProps) {
        super(props);
        this.state = {feed_list: [], current_user: 1};
    }

    async componentDidMount() {
        const feed = await getFeed();
        this.setState({feed_list: feed, current_user: 0});
    }

    async updateFeed() {
        // Checks if ran out of feed
        if(this.state.current_user >= this.state.feed_list.length-1) {
            const feed = await getFeed();
            this.setState({feed_list: feed, current_user: 0});
        } else {
            this.setState({current_user: this.state.current_user + 1});
        }
    }

    likeClick = async () => {
        await like(this.state.feed_list[this.state.current_user].userID);
        this.updateFeed();
    }

    dislikeClick = async () => {
        await dislike(this.state.feed_list[this.state.current_user].userID);
        this.updateFeed();
    }

    render() {
        if(this.state.current_user >= this.state.feed_list.length) {
            return (
                <Heading>Loading Feed...</Heading>
            )
        }

        return (
                // TODO: Only show this if current user has a profile
                <Stack width="full" align="center" justifyContent="center" spacing={4}>
                    <ProfileViewer is_editing={false} profile={this.state.feed_list[this.state.current_user]}
                                   has_profile={true} editProfile={()=>{}} />
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
