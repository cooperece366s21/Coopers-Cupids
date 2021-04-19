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

type ConversationMenuProps = {conversations: Conversation[]; updateVisibleConversation: (new_conversation: number | null) => void};
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
        // Two options depending on size
        return (
                <Box float="left">
                    {/*On regular screens, show as side bar*/}
                    <Box display={{ base: "none", md: "block" }} pr={2} borderRight="3px solid black">
                        <Stack spacing={8} align="center">
                            <Heading borderBottom="3px solid black">Conversations</Heading>
                            <p>Hello</p>
                            <p>Hello again</p>
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
                                        <p>Hello</p>
                                        <p>Hello again</p>
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