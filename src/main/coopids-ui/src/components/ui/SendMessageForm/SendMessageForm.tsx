import React, {Component} from 'react';
import {Button, Flex, FormControl, Input} from "@chakra-ui/react";

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
                <Flex>
                    <FormControl isRequired float="left">
                        <Input type="text" value={this.state.newMessage} aria-label="Message-Input"
                               onChange={e => this.setState({newMessage: e.currentTarget.value})}
                        />
                    </FormControl>
                    {/* Send Message Button */}
                    <Button width="full" float="right" boxShadow='sm' _hover={{boxShadow: 'md'}}
                            _active={{boxShadow: 'lg'}} type="submit" color="green">
                        Send
                    </Button>
                </Flex>
            </form>
        );
    }
}

export default SendMessageForm;