import React, {Component} from "react";
import ConversationMenu from "../../ui/ConversationMenu/ConversationMenu";
import {Button, Flex, Heading, Stack} from "@chakra-ui/react";
import {
    Conversation,
    getAllConversations,
    getCurrentUserID,
    getUserConversation, getUserProfile,
    Message, Profile,
    sendMessage, unmatch
} from "../../../services/api";
import ConversationViewer from "../../ui/ConversationViewer/ConversationViewer";
import "./MessageLayout.css"
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";

type MessageLayoutProps = {checkCookieExpiration: () => void};
// conversationDisplayed is the index in conversations[] of the conversation the user wants to see
type MessageLayoutState = {conversations: Conversation[]; isLoading: boolean;
                           conversationDisplayed: number | null; currentConversation: Message[]
                           showProfile: boolean; userProfile: Profile; ConversationRefresh: NodeJS.Timeout | null};

class MessageLayout extends Component<MessageLayoutProps,MessageLayoutState> {
    constructor(props: MessageLayoutProps) {
        super(props);
        this.state = {conversations: [], isLoading: true, conversationDisplayed: null, currentConversation: [],
                      showProfile: false, userProfile: {} as Profile, ConversationRefresh: null};
    }

    async componentDidMount() {
        const conversationResp = await getAllConversations() || [];

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        this.setState({conversations: conversationResp, isLoading: false,
                            conversationDisplayed: null, currentConversation: [],
                            ConversationRefresh: setInterval(this.updateConversationList, 2000)});
    }

    componentWillUnmount() {
        if(this.state.ConversationRefresh !== null) {
            clearInterval(this.state.ConversationRefresh);
        }
    }

    // Updates the list of conversation, while keeping the current conversation active
    updateConversationList = async () => {
        // Order may change so save uid to reset current convo as active
        const oldConversationUID = this.state.conversationDisplayed !== null ?
            this.state.conversations[this.state.conversationDisplayed].userID : null;

        const conversationResp = await getAllConversations() || [];

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        this.setState({conversations: conversationResp});

        // Updates displayed conversation to old one
        if(oldConversationUID !== null) {
            // Find new number
            for(let i = 0; i < this.state.conversations.length; i++) {
                // Updates conversation viewer
                if(this.state.conversations[i].userID === oldConversationUID) {
                    this.updateConversationViewer(i);
                    return;
                }
            }
        }

        // If unmatched
        this.updateConversationViewer(null);
    }

    // Changes the conversation shown
    updateConversationViewer = async (newConversation: number | null) => {
        if(newConversation === null) {
            this.setState({conversationDisplayed: null, currentConversation: []});
        } else {
            const messages = await getUserConversation(this.state.conversations[newConversation].userID);

            // Checks if cookies expired (request failed)
            this.props.checkCookieExpiration();

            this.setState({currentConversation: messages, conversationDisplayed: newConversation});
        }
    }

    // Sends message
    sendMessage = async (toUserID: string, newMessage: string) => {
        await sendMessage(toUserID, newMessage);
        const messages = await getUserConversation(toUserID);

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        this.setState({currentConversation: messages});
    }

    // Unmatches with user
    // Unmatching deletes conversation, so conversation list must be refreshed
    unmatch = async (unmatchedUserID: string) => {
        await unmatch(unmatchedUserID);

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        // Updates conversations
        await this.updateConversationList();
    }

    // Shows profile of other user in conversation
    showProfile = async (userID: string | null) => {
        // Will never be null, but need to keep typescript happy
        if(userID === null) {
            return;
        }

        const userProfile = await getUserProfile(userID);

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        if(userProfile !== null) {
            this.setState({showProfile: true, userProfile: userProfile});
        }
    }

    hideProfile = () => {
        this.setState({showProfile: false, userProfile: {} as Profile});
    }

    render() {
        const currentUserID = getCurrentUserID();

        if(this.state.isLoading) {
            return (
                <Heading pt={8}>Loading Conversations...</Heading>
            )
        }

        // Shows profile on icon click
        if(this.state.showProfile) {
            return (
                <Stack width="100%" align="center" justifyContent="center" spacing={4} mb={10}>
                    <Flex w="100%">
                        <Button onClick={this.hideProfile} float="left" m={8} mb={0} w="20%" minW="150px">
                            Back
                        </Button>
                    </Flex>
                    <ProfileViewer isEditing={false} profile={this.state.userProfile} currName={null}
                                   hasProfile={true} editProfile={() => {}}/>
                </Stack>
            )

        }

        return (
            <Stack direction="row" h="100%" w="100%" id="MessageLayout">
                <ConversationMenu conversations={this.state.conversations}
                                  updateVisibleConversation={this.updateConversationViewer}
                />
                <ConversationViewer currentConversation={this.state.conversationDisplayed === null ?
                                        null : this.state.currentConversation}
                                    toUserInfo={this.state.conversationDisplayed === null ?
                                        null : this.state.conversations[this.state.conversationDisplayed]}
                                    noConvos = {this.state.conversations.length === 0} currentUserID={currentUserID}
                                    sendMessage={this.sendMessage} unmatch={this.unmatch} showProfile={this.showProfile}
                />
            </Stack>
        );
    }
}

export default MessageLayout;