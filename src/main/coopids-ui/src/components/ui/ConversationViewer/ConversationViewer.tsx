import React, {Component} from "react";
import {Conversation, Message} from "../../../services/api";
import {Box, Heading, Stack, Text} from "@chakra-ui/react";
import SendMessageForm from "../SendMessageForm/SendMessageForm";

type ConversationViewerProps = {current_conversation: Message[] | null; to_user_info: Conversation;
                                current_userID: string; sendMessage: (to_userID: string, new_message: string) => void};
type ConversationViewerState = {};

class ConversationViewer extends Component<ConversationViewerProps,ConversationViewerState> {

    displayMessages = () => {
        // Should never be null, but need to keep TypeScript happy
        if(this.props.current_conversation === null) {return null}

        const messages = this.props.current_conversation.map(
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

        return (
            <Box float="right" pl={2}>
                <Heading borderBottom="3px solid black">Conversation with {this.props.to_user_info.name}</Heading>
                <Stack width="100%" pb={4}>
                    {this.displayMessages()}
                </Stack>
                <SendMessageForm sendMessage={this.props.sendMessage} to_userID={this.props.to_user_info.userID} />
            </Box>
        );
    }
}

export default ConversationViewer;