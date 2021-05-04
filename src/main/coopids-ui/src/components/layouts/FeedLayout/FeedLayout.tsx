import React, {Component} from "react";
import {dislike, getCurrentUserProfile, getFeed, like, Profile} from "../../../services/api";
import {Button, Flex, Heading, Spacer, Stack, Text} from "@chakra-ui/react";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";

type FeedLayoutProps = {};
// name is the name of current user (used for customized text)
// curentFeedUser is the index of the current user being viewed in the feedList
type FeedLayoutState = {userName: string | undefined; feedList: Profile[]; currentFeedUser: number; isLoading: boolean};

class FeedLayout extends Component<FeedLayoutProps,FeedLayoutState> {
    constructor(props: FeedLayoutProps) {
        super(props);
        this.state = {userName: undefined, feedList: [], currentFeedUser: 1, isLoading: true};
    }

    async componentDidMount() {
        const feed = await getFeed() || [];
        const profile = await getCurrentUserProfile();

        this.setState({userName: profile != null ? profile.name : undefined, feedList: feed,
            currentFeedUser: 0, isLoading: false});
    }

    async updateFeed() {
        // Checks if ran out of feed
        if(this.state.currentFeedUser >= this.state.feedList.length-1) {
            const feed = await getFeed();
            this.setState({feedList: feed, currentFeedUser: 0, isLoading: false});
        } else {
            this.setState({currentFeedUser: this.state.currentFeedUser + 1, isLoading: false});
        }
    }

    likeClick = async () => {
        this.setState({isLoading: true})
        await like(this.state.feedList[this.state.currentFeedUser].userID);
        await this.updateFeed();
    }

    dislikeClick = async () => {
        this.setState({isLoading: true})
        await dislike(this.state.feedList[this.state.currentFeedUser].userID);
        await this.updateFeed();
    }

    render() {
        // Loading
        if(this.state.isLoading) {
            return (
                <Heading m={8} mt={14} fontSize={["xl","2xl","3xl","3xl"]}>
                    Loading Feed...
                </Heading>
            )
        }

        // No Profile
        if(this.state.userName === undefined) {
            return(
                <Heading m={8} mt={14} fontSize={["xl","2xl","3xl","3xl"]} lineHeight={2}>
                    Before the coopids can show you other users' profiles, you need to create a profile to show them
                </Heading>
            )
        }

        // Empty Feed
        if(this.state.feedList.length === 0) {
            return (
                <Heading m={8} mt={14} fontSize={["xl","2xl","3xl","3xl"]}  lineHeight={2}>
                    The coopids couldn't find anyone :(<br/>
                    Please convince your friends to join
                </Heading>
            )
        }

        // Only shows if user has a profile & there is a feed to show them
        return (
                <Stack width="full" align="center" justifyContent="center" spacing={4} mb={10}>
                    <ProfileViewer isEditing={false} profile={this.state.feedList[this.state.currentFeedUser]}
                                   currName={this.state.userName} hasProfile={true} editProfile={()=>{}} />
                    <Flex w={"70%"} pt={4}>
                        <Button colorScheme="yellow" float="left" type="submit" w={"45%"}
                                onClick={this.dislikeClick}>
                            Dislike
                        </Button>
                        <Spacer />
                        <Button colorScheme="green" float="right" type="submit" w={"45%"}
                                onClick={this.likeClick}>
                            Like
                        </Button>
                    </Flex>
                </Stack>
            )
    }
}

export default FeedLayout;
