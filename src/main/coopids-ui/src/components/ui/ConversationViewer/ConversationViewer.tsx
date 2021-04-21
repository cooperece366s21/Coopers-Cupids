import React, {Component} from "react";
import {Conversation, Message} from "../../../services/api";
import {Box, Heading, Stack, Text} from "@chakra-ui/react";
import SendMessageForm from "../SendMessageForm/SendMessageForm";

type ConversationViewerProps = {currentConversation: Message[] | null; toUserInfo: Conversation | null;
                                currentUserID: string; sendMessage: (toUserID: string, newMessage: string) => void};
type ConversationViewerState = {};

class ConversationViewer extends Component<ConversationViewerProps,ConversationViewerState> {

    displayMessages = () => {
        // Should never be null, but need to keep TypeScript happy
        if(this.props.currentConversation === null) {return null}

        const messages = this.props.currentConversation.map(
            (message, index) => {
                // Checks sender of message
                if(message.fromUserID === this.props.currentUserID) {
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
        if (this.props.currentConversation === null || this.props.toUserInfo === null) {
            return (
                <Heading pl={2}>Please pick a conversation to display</Heading>
            );
        }

        return (
            <Box float="right" pl={2}>
                <Heading borderBottom="3px solid black">Conversation with {this.props.toUserInfo.name}</Heading>
                <Stack width="100%" pb={4}>
                    {this.displayMessages()}
                </Stack>
                <SendMessageForm sendMessage={this.props.sendMessage} toUserID={this.props.toUserInfo.userID} />
            </Box>
        );
    }
}

export default ConversationViewer;