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
    DrawerFooter, Divider, Avatar, Text
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
                <Button w={"95%"} alignSelf={"center"} onClick={() => this.props.updateVisibleConversation(index)}
                        key={`Conversation ${index}`} boxShadow='sm' backgroundColor={"#FFFFFF"}
                        _hover={{boxShadow: 'lg', color: "#F2BBC1"}} _focus={{outline: "none"}} h="100%" p={1}>
                    <Stack direction="row" w="100%" h="fit-content">
                        <Avatar justifySelf="left" size="md" name={value.name} src={value.photo}/>
                        <Text alignSelf="center" h="100%" pl={4} fontSize="lg">
                            {value.name}
                        </Text>
                    </Stack>
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


                <Box w={["20%","20%","30%","30%"]} maxW="350px" borderRight=".5px solid #FFFFFF">
                    <Stack spacing={4} align="center">
                        <Heading display={{ base: "none", md: "block" }} fontSize={["sm","sm","2xl","3xl"]}
                            pt={2} pb={4} w={"full"} borderBottom=".5px solid #FFFFFF">
                            Conversations
                        </Heading>
                        <Stack width="100%" spacing={4}>
                            {conversationButtons}
                        </Stack>
                    </Stack>
                </Box>
            );

    }
}

export default ConversationMenu;