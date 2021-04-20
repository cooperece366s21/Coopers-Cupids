import React, {Component} from "react";
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Link} from "@chakra-ui/react";
import api from "../../../services/api";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Sets types
type FormProps = {update_login: () => void};
type FormState = {username: string; password: string, is_loading: boolean,
                  form_type: "Signup" | "Login", api_error: boolean};

class LoginSignupForm extends Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);
        this.state = {username: "", password: "", is_loading: false, form_type: "Signup", api_error: false};
    }

    // Makes API Call on button click
    onSubmit = async () => {
        this.setState({is_loading: true});

        // Checks for empty fields
        if(this.state.username === "" || this.state.password === "") {
            this.setState({api_error: false, is_loading: false});
            return;
        }

        const resp = this.state.form_type === "Signup" ? await api.signup(this.state.username, this.state.password)
                                                       : await api.login(this.state.username, this.state.password);

        if(resp.status === "Success") {
            // UPDATE PAGE
            this.setState({api_error: false, is_loading: false})
            // TODO: REDIRECT
            this.props.update_login();
        }
        // ERROR
        else {
            // Clears saved values
            this.setState({username: "", password: "", is_loading: false, api_error: true});
        }

    }

    // TODO: Disable button while API is loading request (when is_loading = true)
    getFormSwitchText = () => {
        const form_switch_text = this.state.form_type === "Signup" ? "Already have an account?"
                                                                   : "Don't have an account?";

        const new_form_type = this.state.form_type === "Signup" ? "Login" : "Signup";
        const onFormSwitchTextClick = () => {this.setState({form_type: new_form_type, api_error: false})};
        return (
            <Link textAlign="center" _hover={{textDecoration: 'None'}} onClick={e => {e.preventDefault(); onFormSwitchTextClick();}}>
                {form_switch_text}
            </Link>
        )
    }

    render() {
        const header_text = this.state.form_type === "Signup" ? "Sign Up" : "Welcome Back";
        const error_message = this.state.form_type === "Signup" ? "Username already taken"
                                                                : "Invalid username or password";

        return (
            <Flex width="full" align="center" justifyContent="center">
                <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                    <Box textAlign="center">
                        <Heading>{header_text}</Heading>
                    </Box>
                    <Box my={4} textAlign="left">
                        <form onSubmit={e => e.preventDefault()}>
                            <Stack spacing={4}>
                                {/* Error Message */}
                                {this.state.api_error && <ErrorMessage message={error_message} />}
                                {/* Username Field */}
                                <FormControl isRequired>
                                    <FormLabel>Username</FormLabel>
                                    <Input type="name" placeholder="Username" value={this.state.username} aria-label="Username"
                                           onChange={e => this.setState({username: e.currentTarget.value})}/>
                                </FormControl>
                                {/* Password Field */}
                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" placeholder="*******" value={this.state.password} aria-label="Password"
                                           onChange={e => this.setState({password: e.currentTarget.value})}/>
                                </FormControl>
                                {/* Submit Button */}
                                <Button width="full"
                                        type="submit"
                                        boxShadow='sm'
                                        _hover={{boxShadow: 'md'}}
                                        _active={{boxShadow: 'lg'}}
                                        onClick={this.onSubmit}
                                        isLoading={this.state.is_loading}>
                                    {this.state.form_type === "Signup" ? "Create Account" : "Login"}
                                </Button>
                                {/* Switch Form Type (Between login & signup) */}
                                {this.getFormSwitchText()}
                            </Stack>
                        </form>
                    </Box>
                </Box>
            </Flex>
        );
    }
}

export default LoginSignupForm;