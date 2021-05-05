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
import "./ConversationMenu.css"

type ConversationMenuProps = {conversations: Conversation[];
                              updateVisibleConversation: (newConversation: number | null) => void;};
type ConversationMenuState = {isOpen: boolean};

class ConversationMenu extends Component<ConversationMenuProps,ConversationMenuState> {
    constructor(props: ConversationMenuProps) {
        super(props);
        this.state = {isOpen: false};
    }

    render() {
        const conversationButtons = this.props.conversations.map((value, index) => {
            return (
                <Button w={"95%"} alignSelf={"center"} onClick={() => this.props.updateVisibleConversation(index)}
                        key={`Conversation ${index}`} boxShadow='sm' backgroundColor={"#FFFFFF"}
                        _hover={{boxShadow: 'lg', color: "#F2BBC1"}} _focus={{outline: "none"}} h="100%" p={1.5}>
                    <Stack direction="row" w="100%" h="fit-content" justifyContent={{base: "center", md: "left"}}>
                        <Avatar justifySelf={{base: "center", md: "left"}} size="md" name={value.name} src={value.photo}/>
                        <Text alignSelf="center" h="100%" pl={1} fontSize="md" display={{ base: "none", md: "block" }}>
                            {value.name}
                        </Text>
                    </Stack>
                </Button>
            )
        })

        // Two options depending on size
        return (
                <Box w={["20%","20%","30%","30%"]} minW={["","","240px",""]} maxW="350px" borderRight=".5px solid #FFFFFF">
                    <Stack spacing={4} align="center" h={"100%"}>
                        <Heading display={{ base: "none", md: "block" }} fontSize={["sm","sm","2xl","3xl"]}
                            pt={3} pb={2} w={"full"}>
                            Conversations
                        </Heading>
                        <Stack width="100%" spacing={4} overflowY="auto" pb={10} id="ConversationMenuList">
                            {conversationButtons}
                        </Stack>
                    </Stack>
                </Box>
            );

    }
}

export default ConversationMenu;