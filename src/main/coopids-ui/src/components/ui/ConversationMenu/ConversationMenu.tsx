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
    DrawerFooter, Divider
} from "@chakra-ui/react";
import {Conversation} from "../../../services/api";

type ConversationMenuProps = {conversations: Conversation[];
                              updateVisibleConversation: (newConversation: number | null) => void;};
type ConversationMenuState = {isOpen: boolean};

class ConversationMenu extends Component<ConversationMenuProps,ConversationMenuState> {
    constructor(props: ConversationMenuProps) {
        super(props);
        this.state = {isOpen: false};
    }

    drawerOnClick = () => {
        this.setState({isOpen: !this.state.isOpen});
    }

    render() {
        const conversationButtons = this.props.conversations.map((value, index) => {
            return (
                // TODO: Add picture as icon next to name
                <Button onClick={() => this.props.updateVisibleConversation(index)} key={`Conversation ${index}`}>
                    {value.name}
                </Button>
            )
        })

        // Two options depending on size
        return (
                //      TODO: FOR PHONE SCREENS
                //     {/*When screen is too small, change side bar to draw overlay*/}
                //     <Box display={{ base: "block", md: "none" }}>
                //         <Button onClick={this.drawerOnClick}>
                //             Conversations
                //         </Button>
                //         <Drawer isOpen={this.state.isOpen} onClose={()=>{}} placement="left">
                //             <DrawerOverlay>
                //                 <DrawerContent>
                //                     <DrawerHeader borderBottomWidth="1px">Conversations</DrawerHeader>
                //                     <DrawerBody>
                //                         <Stack>
                //                             {conversationButtons}
                //                         </Stack>
                //                     </DrawerBody>
                //                     <DrawerFooter>
                //                         <Button onClick={this.drawerOnClick}>
                //                             Back
                //                         </Button>
                //                     </DrawerFooter>
                //                 </DrawerContent>
                //             </DrawerOverlay>
                //         </Drawer>
                //     </Box>


                <Box w={["20%","20%","30%","30%"]} maxW="350px" borderRight="3px solid black">
                    <Stack spacing={4} align="center">
                        <Heading display={{ base: "none", md: "block" }} fontSize={["sm","sm","2xl","3xl"]}
                            mt={2}>
                            Conversations
                        </Heading>
                        <Divider display={{ base: "none", md: "block" }}/>
                        <Stack width="100%">
                            {conversationButtons}
                        </Stack>
                    </Stack>
                </Box>
            );

    }
}

export default ConversationMenu;