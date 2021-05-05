import React, {Component} from 'react';
import {Box, Button, Flex, FormControl, Input} from "@chakra-ui/react";

type SendMessageFormProps = {sendMessage: (toUserID: string, newMessage: string) => void;
                             toUserID: string};
type SendMessageFormState = {newMessage: string};

class SendMessageForm extends Component<SendMessageFormProps,SendMessageFormState> {
    constructor(props: SendMessageFormProps) {
        super(props);
        this.state = {newMessage: ""};
    }

    render() {
        return (
            <form onSubmit={e => {e.preventDefault();
                            this.props.sendMessage(this.props.toUserID,  this.state.newMessage);
                            this.setState({newMessage: ""});}}
            >
                <Flex mr={6} ml={6}>
                    <FormControl isRequired>
                        <Input type="text" value={this.state.newMessage} aria-label="Message-Input"
                               placeholder={"Write a message to your match!"}
                               _placeholder={{"font-size": ".9em", "align-self": "center"}}
                               onChange={e => this.setState({newMessage: e.currentTarget.value})}
                               borderColor="#FFFFFF"
                        />
                    </FormControl>
                    {/* Send Message Button */}
                    <Button type="submit" width="20%" ml={4} justifySelf="flex-end" boxShadow='sm'
                            color="green" backgroundColor={"#FFFFFF"} _hover={{boxShadow: 'md',
                            backgroundColor: "#F2BBC1", border: "1px solid green"}} _active={{boxShadow: 'lg'}}>
                        Send
                    </Button>
                </Flex>
            </form>
        );
    }
}

export default SendMessageForm;