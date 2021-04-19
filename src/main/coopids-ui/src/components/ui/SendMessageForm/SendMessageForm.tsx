import React, {Component} from 'react';
import {Button, Flex, FormControl, Input} from "@chakra-ui/react";

type SendMessageFormProps = {sendMessage: (to_userID: string, new_message: string) => void;
                             to_userID: string};
type SendMessageFormState = {new_message: string};

class SendMessageForm extends Component<SendMessageFormProps,SendMessageFormState> {
    constructor(props: SendMessageFormProps) {
        super(props);
        this.state = {new_message: ""};
    }

    render() {
        return (
            <form onSubmit={e => {e.preventDefault();
                            this.props.sendMessage(this.props.to_userID,  this.state.new_message);
                            this.setState({new_message: ""});}}
            >
                <Flex>
                    <FormControl isRequired float="left">
                        <Input type="text" value={this.state.new_message} aria-label="Message-Input"
                               onChange={e => this.setState({new_message: e.currentTarget.value})}
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