import React, {Component} from "react";
import ConversationMenu from "../../ui/ConversationMenu/ConversationMenu";
import {Flex, Heading, Stack} from "@chakra-ui/react";
import {
    Conversation,
    getAllConversations,
    getCurrentUserID,
    getUserConversation,
    Message,
    sendMessage, unmatch
} from "../../../services/api";
import ConversationViewer from "../../ui/ConversationViewer/ConversationViewer";
import "./MessageLayout.css"

type MessageLayoutProps = {checkCookieExpiration: () => void};
// conversationDisplayed is the index in conversations[] of the conversation the user wants to see
type MessageLayoutState = {conversations: Conversation[]; isLoading: boolean;
                           conversationDisplayed: number | null; currentConversation: Message[]};

// TODO: Update conversation every minute or so, or add a refresh button
class MessageLayout extends Component<MessageLayoutProps,MessageLayoutState> {
    constructor(props: MessageLayoutProps) {
        super(props);
        this.state = {conversations: [], isLoading: true, conversationDisplayed: null, currentConversation: []};
    }

    async componentDidMount() {
        const conversationResp = await getAllConversations() || [];

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        this.setState({conversations: conversationResp, isLoading: false,
                            conversationDisplayed: null, currentConversation: []});
    }

    // Updates the list of conversation, while keeping the current conversation active
    updateConversationList = async () => {
        this.updateConversationViewer(null);

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
    }

    // Changes the conversation shown
    updateConversationViewer = async (newConversation: number | null) => {
        if(newConversation === null) {
            this.setState({conversationDisplayed: newConversation, currentConversation: []});
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

    render() {
        const currentUserID = getCurrentUserID();

        if(this.state.isLoading) {
            return (
                <Heading>Loading Conversations...</Heading>
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
                                    currentUserID={currentUserID} sendMessage={this.sendMessage}
                                    unmatch={this.unmatch}
                />
            </Stack>
        );
    }
}

export default MessageLayout;