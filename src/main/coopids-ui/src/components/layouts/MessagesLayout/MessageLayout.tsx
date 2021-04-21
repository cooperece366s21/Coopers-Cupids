import React, {Component} from "react";
import ConversationMenu from "../../ui/ConversationMenu/ConversationMenu";
import {Flex, Heading} from "@chakra-ui/react";
import {
    Conversation,
    getAllConversations,
    getCurrentUserID,
    getUserConversation,
    Message,
    sendMessage
} from "../../../services/api";
import ConversationViewer from "../../ui/ConversationViewer/ConversationViewer";

type MessageLayoutProps = {};
// Conversation_displayed is the index in conversations[] of the conversation the user wants to see
type MessageLayoutState = {conversations: Conversation[]; is_loaded: boolean;
                           conversation_displayed: number | null; current_conversation: Message[]};

// TODO: Update conversation every minute or so, or add a refresh button
class MessageLayout extends Component<MessageLayoutProps,MessageLayoutState> {
    constructor(props: MessageLayoutProps) {
        super(props);
        this.state = {conversations: [], is_loaded: false, conversation_displayed: null, current_conversation: []};
    }

    async componentDidMount() {
        const conversation_resp = await getAllConversations();
        this.setState({conversations: conversation_resp, is_loaded: true,
                            conversation_displayed: null, current_conversation: []});
    }

    // Changes the conversation shown
    updateConversationViewer = async (new_conversation: number | null) => {
        if(new_conversation === null) {
            this.setState({conversation_displayed: new_conversation});
        } else {
            const messages = await getUserConversation(this.state.conversations[new_conversation].userID);
            this.setState({current_conversation: messages, conversation_displayed: new_conversation});
        }
    }

    sendMessage = async (to_userID: string, new_message: string) => {
        await sendMessage(to_userID, new_message);
        const messages = await getUserConversation(to_userID);
        this.setState({current_conversation: messages});
    }

    render() {
        const current_userID = getCurrentUserID();

        if(!this.state.is_loaded) {
            return (
                <Heading>Loading Conversations...</Heading>
            )
        }

        return (
            <Flex pl={4}>
                <ConversationMenu conversations={this.state.conversations}
                                  updateVisibleConversation={this.updateConversationViewer}
                                  current_userID={current_userID}
                />
                <ConversationViewer current_conversation={this.state.conversation_displayed === null ?
                                                          null :
                                                          this.state.current_conversation}
                                    to_user_info={this.state.conversation_displayed === null ?
                                                  null : this.state.conversations[this.state.conversation_displayed]}
                                    current_userID={current_userID} sendMessage={this.sendMessage}
                />
            </Flex>
        );
    }
}

export default MessageLayout;