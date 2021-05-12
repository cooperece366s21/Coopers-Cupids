import React, {Component} from "react";
import {Conversation, Message} from "../../../services/api";
import {Avatar, Box, Button, Flex, Heading, Stack, Text} from "@chakra-ui/react";
import SendMessageForm from "../SendMessageForm/SendMessageForm";
import "./ConversationViewer.css"
import {FaHeartBroken} from "react-icons/all";


type ConversationViewerProps = {currentConversation: Message[] | null; toUserInfo: Conversation | null;
                                noConvos: boolean; sendMessage: (toUserID: string, newMessage: string) => void;
                                unmatch: (userID: string) => void; showProfile: (userID: string | null) => void};
type ConversationViewerState = {};

class ConversationViewer extends Component<ConversationViewerProps,ConversationViewerState> {
    // This will scroll to bottom whenever a new message is added
    componentDidUpdate(prevProps: Readonly<ConversationViewerProps>, prevState: Readonly<ConversationViewerState>, snapshot?: any) {
        if(prevProps.currentConversation === null || prevProps.toUserInfo === null ||
            (this.props.toUserInfo !== null && prevProps.toUserInfo.userID !== this.props.toUserInfo.userID) ||
            (this.props.currentConversation !== null
                && prevProps.currentConversation.length !== this.props.currentConversation.length)) {
            const messageViewer = document.getElementById("ConversationViewer")
            // To keep typescript happy
            if(messageViewer !== null) {
                messageViewer.scrollTop = 0;
            }
        }
    }

    displayMessages = () => {
        // Should never be null, but need to keep TypeScript happy
        if(this.props.currentConversation === null) {return null}

        // Reverses list, since div is flipped to show new messages on bottom
        let prevDay: string[] = [];
        const messages = this.props.currentConversation.map(
            (message, index) => {
                // Checks who sent message
                const fromCurrentUser = message.fromUserID !== this.props.toUserInfo!.userID;

                // Checks timestamp
                const messageDate = message.timestamp.toString().split(',').map(e => e.trim());
                if(prevDay.length === 0 || messageDate[0] !== prevDay[0]) {
                    prevDay = messageDate;

                    return (
                      <Box w="100%">
                          <Text align="center" color="black" key={`Message ${index} Date ${messageDate[0]}`}>
                              {prevDay[0]}
                          </Text>
                          <Text align={fromCurrentUser ? "right" : "left"} float={fromCurrentUser ? "right" : "left"}
                                color={fromCurrentUser ? "green" : "blue"} key={`Message ${index}`}>
                              {message.messageText}
                          </Text>
                      </Box>
                    );
                }

                return (
                    <Text align={fromCurrentUser ? "right" : "left"} float={fromCurrentUser ? "right" : "left"}
                          color={fromCurrentUser ? "green" : "blue"} key={`Message ${index}`}>
                        {message.messageText}
                    </Text>
                );
            }
        ).reverse()

        return messages;
    }

    // Changes color of broken heart icon on hover
    changeIconColor = (color: string) => {
        const heartIcon = document.getElementById("BrokenHeartIcon");
        if(heartIcon !== null) {
            heartIcon.style.fill = color;
        }
    }

    render() {
        if (this.props.currentConversation === null || this.props.toUserInfo === null) {
            return (
                <Box w="full">
                    <Heading fontSize={["xl","2xl","3xl","3xl"]} mt={4} mr={4}>
                        {this.props.noConvos ?
                            "Once the Coopids match you with a user, a new conversation will appear in the left menu" :
                            "Please pick a conversation to display"}
                    </Heading>
                </Box>
            );
        }

        return (
            <Stack w="100%" pt={4} pb={6} pr={2} pl={0}>
                {/* Name & Icon banner on top of conversation*/}
                <Flex pl={4} pr={4} pb={2} w="100%" h="fit-content" borderBottom=".5px solid #FFFFFF">
                    <Stack direction="row" justifySelf="flex-start" w="100%" spacing={2}>
                        {/* Icon with profile picture - Button to view profile*/}
                        <Avatar as="button" size="md" name={this.props.toUserInfo.name}
                                src={this.props.toUserInfo.photo} _hover={{boxShadow: 'lg'}}
                                onClick={e => {e.preventDefault();
                                        this.props.showProfile(this.props.toUserInfo ?
                                        this.props.toUserInfo.userID : null)}}/>
                        {/* Name of other user */}
                        <Text alignSelf="center" pl={2} fontSize="lg">
                            {this.props.toUserInfo.name}
                        </Text>
                    </Stack>

                    {/* Unmatching Icon */}
                    <Button p={2} alignSelf="center" justifySelf="flex-end" backgroundColor="#FFFFFF"
                            _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1", color: "#FFFFFF",
                            border: "1px solid white"}} onMouseOver={e => this.changeIconColor("#FFFFFF")}
                            onMouseOut={e => this.changeIconColor("#F2BBC1")}
                            _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}
                            onClick={e => {e.preventDefault();
                                // toUserInfo should never be null if this page is showing,
                                // but gotta keep typescript happy
                                this.props.unmatch(this.props.toUserInfo ? this.props.toUserInfo.userID : "")}}>
                        <FaHeartBroken fill="#F2BBC1" id="BrokenHeartIcon" size="25px"/>
                    </Button>
                </Flex>

                {/* Conversation Viewer */}
                {/* column-reverse flips stack so scrolls up from bottom
                - messages are fed in reverse to account for this*/}
                <Stack flexDirection="column-reverse" width="100%" h="100%" pb={4} pr={8} pl={8}
                       overflowY="auto" id="ConversationViewer">
                    {this.displayMessages()}
                </Stack>

                {/* Send Message Button*/}
                <SendMessageForm sendMessage={this.props.sendMessage} toUserID={this.props.toUserInfo.userID} />
            </Stack>
        );
    }
}

export default ConversationViewer;