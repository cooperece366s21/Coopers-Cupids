import React, {Component} from "react";
import {Conversation} from "../../../services/api";
import {Box, Heading, Stack, Text} from "@chakra-ui/react";
import SendMessageForm from "../SendMessageForm/SendMessageForm";

type ConversationViewerProps = {current_conversation: Conversation | null;
                                current_userID: string; sendMessage: (to_userID: string, new_message: string) => void};
type ConversationViewerState = {};

class ConversationViewer extends Component<ConversationViewerProps,ConversationViewerState> {

    displayMessages = () => {
        const messages = this.props.current_conversation?.messages.map(
            (message, index) => {
                // Checks sender of message
                if(message.from_userID === this.props.current_userID) {
                    // Current user
                    return (
                        <Text align="right" float="right" color="green" key={`Message ${index}`}>
                            {message.messageText}
                        </Text>
                    )
                }

                // Other user
                return (
                    <Text align="left" float="left" color="blue" key={`Message ${index}`}>
                        {message.messageText}
                    </Text>
                )
            }
        )

        return messages;
    }

    render() {
        if (this.props.current_conversation === null) {
            return (
                <Heading pl={2}>Please pick a conversation to display</Heading>
            );
        }

        const conversation_with = this.props.current_conversation.user1ID === this.props.current_userID ?
                                  this.props.current_conversation.user2ID :
                                  this.props.current_conversation.user1ID;

        return (
            <Box float="right" pl={2}>
                <Heading borderBottom="3px solid black">Conversation with {conversation_with}</Heading>
                <Stack width="100%" pb={4}>
                    {this.displayMessages()}
                </Stack>
                <SendMessageForm sendMessage={this.props.sendMessage} to_userID={conversation_with} />
            </Box>
        );
    }
}

export default ConversationViewer;