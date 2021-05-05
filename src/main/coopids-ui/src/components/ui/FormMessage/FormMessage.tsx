import React, {Component} from "react";
import {Alert, AlertDescription, AlertIcon, Box} from "@chakra-ui/react";

// Sets types
type FormMessageProps = {message: string, type: "info" | "warning" | "success" | "error" | undefined};
type FormMessageState = {};

class FormMessage extends Component<FormMessageProps, FormMessageState> {

    render() {
        return (
            <Box my={4}>
                <Alert status={this.props.type} borderRadius={4}>
                    <AlertIcon />
                    <AlertDescription>{this.props.message}</AlertDescription>
                </Alert>
            </Box>

        );
    }
}

export default FormMessage;