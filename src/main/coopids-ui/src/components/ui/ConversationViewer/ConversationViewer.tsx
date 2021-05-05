import React, {Component} from "react";
import {Conversation, Message} from "../../../services/api";
import {Avatar, Box, Button, Heading, Stack, Text} from "@chakra-ui/react";
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
                <Box w="full">
                    <Heading fontSize={["xl","2xl","3xl","3xl"]} mt={4}>
                        Please pick a conversation to display
                    </Heading>
                </Box>
            );
        }

        return (
            <Stack w="full" p={6} pt={4}>
                {/* Name & Icon banner on top of conversation*/}
                <Box alignSelf="center" h="fit-content" w="100%">
                    <Stack direction="row" borderBottom=".5px solid #FFFFFF" pb={2}
                           justifyContent="left" >
                        <Avatar as="button" justifySelf="left" size="md" name={this.props.toUserInfo.name}
                                src={this.props.toUserInfo.photo} _hover={{boxShadow: 'lg'}}
                                onClick={e => {e.preventDefault(); /*TODO: SHOW PROFILE*/}}/>
                        <Text alignSelf="center" h="100%" pl={2} fontSize="lg">
                            {this.props.toUserInfo.name}
                        </Text>
                    </Stack>
                </Box>

                {/* Conversation Viewer */}
                <Stack width="100%" h="100%" pb={4} overflowY="auto">
                    {this.displayMessages()}
                </Stack>

                {/* Send Message Button*/}
                <SendMessageForm sendMessage={this.props.sendMessage} toUserID={this.props.toUserInfo.userID} />
            </Stack>
        );
    }
}

export default ConversationViewer;