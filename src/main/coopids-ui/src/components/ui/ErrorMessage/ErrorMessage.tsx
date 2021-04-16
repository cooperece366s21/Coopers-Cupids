import React, {Component} from "react";
import {Alert, AlertDescription, AlertIcon, Box} from "@chakra-ui/react";

// Sets types
type ErrorMessageProps = {message: string};
type ErrorMessageState = {};

class ErrorMessage extends Component<ErrorMessageProps, ErrorMessageState> {

    render() {
        return (
            <Box my={4}>
                <Alert status="error" borderRadius={4}>
                    <AlertIcon />
                    <AlertDescription>{this.props.message}</AlertDescription>
                </Alert>
            </Box>

        );
    }
}

export default ErrorMessage;