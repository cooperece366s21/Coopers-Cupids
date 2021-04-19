import React, {Component} from "react";
import ConversationMenu from "../../ui/ConversationMenu/ConversationMenu";
import {Flex, Heading, Spacer} from "@chakra-ui/react";
import {Conversation, getAllConversations} from "../../../services/api";

type MessageLayoutProps = {};
type MessageLayoutState = {conversations: Conversation[]; is_loaded: boolean, conversation_displayed: number | null};

class MessageLayout extends Component<MessageLayoutProps,MessageLayoutState> {
    constructor(props: MessageLayoutProps) {
        super(props);
        this.state = {conversations: [], is_loaded: false, conversation_displayed: null};
    }

    async componentDidMount() {
        const conversation_resp = await getAllConversations();
        this.setState({conversations: conversation_resp, is_loaded: true, conversation_displayed: null});
    }

    // Changes the conversation shown
    updateConversationViewer = (new_conversation: number | null) => {
        this.setState({conversation_displayed: new_conversation});
    }

    render() {
        if(!this.state.is_loaded) {
            return (
                <Heading>Loading Conversations...</Heading>
            )
        }

        return (
            <Flex pl={4}>
                <ConversationMenu conversations={this.state.conversations}
                                  updateVisibleConversation={this.updateConversationViewer} />
                <Spacer />
            </Flex>
        )
    }
}

export default MessageLayout;