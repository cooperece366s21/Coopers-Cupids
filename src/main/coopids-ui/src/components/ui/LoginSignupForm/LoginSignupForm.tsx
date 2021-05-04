import React, {Component} from "react";
import {Box, Button, Flex, FormControl, FormLabel, Heading, Input, Stack, Link} from "@chakra-ui/react";
import api from "../../../services/api";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Sets types
type FormProps = {updateLogin: () => void};
type FormState = {username: string; password: string; isLoading: boolean,
                  formType: "Signup" | "Login"; apiError: boolean};

class LoginSignupForm extends Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);
        this.state = {username: "", password: "", isLoading: false, formType: "Login", apiError: false};
    }

    // Makes API Call on button click
    onSubmit = async () => {
        this.setState({isLoading: true});

        // Checks for empty fields
        if(this.state.username === "" || this.state.password === "") {
            this.setState({apiError: false, isLoading: false});
            return;
        }

        const resp = this.state.formType === "Signup" ? await api.signup(this.state.username, this.state.password)
                                                       : await api.login(this.state.username, this.state.password);

        if(resp.status === "Success") {
            // UPDATE PAGE
            this.setState({apiError: false, isLoading: false})
            // TODO: REDIRECT
            this.props.updateLogin();
        }
        // ERROR
        else {
            // Clears saved values
            this.setState({username: "", password: "", isLoading: false, apiError: true});
        }

    }

    // TODO: Disable button while API is loading request (when isLoading = true)
    getFormSwitchText = () => {
        const formSwitchText = this.state.formType === "Signup" ? "Already have an account?"
                                                                   : "Don't have an account?";

        const newFormType = this.state.formType === "Signup" ? "Login" : "Signup";
        const onFormSwitchTextClick = () => {this.setState({formType: newFormType, apiError: false})};
        return (
            <Link textAlign="center" _hover={{textDecoration: 'None'}} onClick={e => {e.preventDefault(); onFormSwitchTextClick();}}>
                {formSwitchText}
            </Link>
        )
    }

    render() {
        const headerText = this.state.formType === "Signup" ? "Sign Up" : "Welcome Back";
        const errorMessage = this.state.formType === "Signup" ? "Username already taken"
                                                                : "Invalid username or password";

        return (
            <Flex width="full" align="center" justifyContent="center">
                <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#FFFFFF">
                    <Box textAlign="center">
                        <Heading>{headerText}</Heading>
                    </Box>
                    <Box my={4} textAlign="left">
                        <form onSubmit={e => {e.preventDefault(); this.onSubmit()}}>
                            <Stack spacing={4}>
                                {/* Error Message */}
                                {this.state.apiError && <ErrorMessage message={errorMessage} />}
                                {/* Username Field */}
                                <FormControl isRequired>
                                    <FormLabel>Email Address</FormLabel>
                                    <Input type="email" placeholder="Cooopers@Cupids.com" value={this.state.username}
                                           aria-label="Email"  borderColor="#FFFFFF"
                                           onChange={e => this.setState({username: e.currentTarget.value})}/>
                                </FormControl>
                                {/* Password Field */}
                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" placeholder="*******" value={this.state.password}
                                           aria-label="Password" borderColor="#FFFFFF"
                                           onChange={e => this.setState({password: e.currentTarget.value})}/>
                                </FormControl>
                                {/* Submit Button */}
                                <Button width="full"
                                        type="submit"
                                        boxShadow='sm'
                                        backgroundColor={"#FFFFFF"}
                                        _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                            color: "#FFFFFF", border: "1px solid white"}}
                                        _active={{boxShadow: 'lg'}}
                                        isLoading={this.state.isLoading}>
                                    {this.state.formType === "Signup" ? "Create Account" : "Login"}
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