import React, {Component} from "react";
import ConversationMenu from "../../ui/ConversationMenu/ConversationMenu";
import {Flex, Heading, Stack} from "@chakra-ui/react";
import {
    Conversation,
    getAllConversations,
    getCurrentUserID,
    getUserConversation,
    Message,
    sendMessage
} from "../../../services/api";
import ConversationViewer from "../../ui/ConversationViewer/ConversationViewer";

type MessageLayoutProps = {checkCookieExpiration: () => void};
// conversationDisplayed is the index in conversations[] of the conversation the user wants to see
type MessageLayoutState = {conversations: Conversation[]; isLoaded: boolean;
                           conversationDisplayed: number | null; currentConversation: Message[]};

// TODO: Update conversation every minute or so, or add a refresh button
class MessageLayout extends Component<MessageLayoutProps,MessageLayoutState> {
    constructor(props: MessageLayoutProps) {
        super(props);
        this.state = {conversations: [], isLoaded: false, conversationDisplayed: null, currentConversation: []};
    }

    async componentDidMount() {
        const conversationResp = await getAllConversations() || [];

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        this.setState({conversations: conversationResp, isLoaded: true,
                            conversationDisplayed: null, currentConversation: []});
    }

    // Changes the conversation shown
    updateConversationViewer = async (newConversation: number | null) => {
        if(newConversation === null) {
            this.setState({conversationDisplayed: newConversation});
        } else {
            const messages = await getUserConversation(this.state.conversations[newConversation].userID);

            // Checks if cookies expired (request failed)
            this.props.checkCookieExpiration();

            this.setState({currentConversation: messages, conversationDisplayed: newConversation});
        }
    }

    sendMessage = async (toUserID: string, newMessage: string) => {
        await sendMessage(toUserID, newMessage);
        const messages = await getUserConversation(toUserID);

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        this.setState({currentConversation: messages});
    }

    render() {
        const currentUserID = getCurrentUserID();

        if(!this.state.isLoaded) {
            return (
                <Heading>Loading Conversations...</Heading>
            )
        }

        return (
            <Stack direction="row">
                <ConversationMenu conversations={this.state.conversations}
                                  updateVisibleConversation={this.updateConversationViewer}
                />
                <ConversationViewer currentConversation={this.state.conversationDisplayed === null ?
                    null :
                    this.state.currentConversation}
                                    toUserInfo={this.state.conversationDisplayed === null ?
                                        null : this.state.conversations[this.state.conversationDisplayed]}
                                    currentUserID={currentUserID} sendMessage={this.sendMessage}
                />
            </Stack>
        );
    }
}

export default MessageLayout;