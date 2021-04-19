import React, {Component} from "react";
import {
    Box,
    Stack,
    Button,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody, Heading,
    DrawerFooter
} from "@chakra-ui/react";
import {Conversation} from "../../../services/api";

type ConversationMenuProps = {conversations: Conversation[];
                              updateVisibleConversation: (new_conversation: number | null) => void;
                              current_userID: string};
type ConversationMenuState = {is_open: boolean};

class ConversationMenu extends Component<ConversationMenuProps,ConversationMenuState> {
    constructor(props: ConversationMenuProps) {
        super(props);
        this.state = {is_open: false};
    }

    drawerOnClick = () => {
        this.setState({is_open: !this.state.is_open});
    }

    render() {
        const conversationButtons = this.props.conversations.map((value, index) => {
            return (
                <Button onClick={() => this.props.updateVisibleConversation(index)} key={`Conversation ${index}`}>
                    {value.user1ID === this.props.current_userID ? value.user2ID : value.user1ID}
                </Button>
            )
        })

        // Two options depending on size
        return (
                <Box float="left">
                    {/*On regular screens, show as side bar*/}
                    <Box display={{ base: "none", md: "block" }} pr={2} borderRight="3px solid black">
                        <Stack spacing={8} align="center">
                            <Heading borderBottom="3px solid black">Conversations</Heading>
                            <Stack width="100%">
                                {conversationButtons}
                            </Stack>
                        </Stack>
                    </Box>

                    {/*When screen is too small, change side bar to draw overlay*/}
                    <Box display={{ base: "block", md: "none" }}>
                        <Button onClick={this.drawerOnClick}>
                            Conversations
                        </Button>
                        <Drawer isOpen={this.state.is_open} onClose={()=>{}} placement="left">
                            <DrawerOverlay>
                                <DrawerContent>
                                    <DrawerHeader borderBottomWidth="1px">Conversations</DrawerHeader>
                                    <DrawerBody>
                                        <Stack>
                                            {conversationButtons}
                                        </Stack>
                                    </DrawerBody>
                                    <DrawerFooter>
                                        <Button onClick={this.drawerOnClick}>
                                            Back
                                        </Button>
                                    </DrawerFooter>
                                </DrawerContent>
                            </DrawerOverlay>
                        </Drawer>
                    </Box>
                </Box>
            );

    }
}

export default ConversationMenu;