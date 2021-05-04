import React, {Component} from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    Link,
    InputRightElement, InputGroup
} from "@chakra-ui/react";
import api from "../../../services/api";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

// Sets types
type FormProps = {updateLogin: () => void};
type FormState = {username: string; password: string; isLoading: boolean,
                  formType: "Signup" | "Login"; apiError: boolean, showPassword: boolean};

class LoginSignupForm extends Component<FormProps, FormState> {
    constructor(props: FormProps) {
        super(props);
        this.state = {username: "", password: "", isLoading: false, formType: "Login",
            apiError: false, showPassword: false};
    }

    // Makes API Call on button click
    onSubmit = async () => {
        this.setState({isLoading: true});

        const resp = this.state.formType === "Signup" ? await api.signup(this.state.username, this.state.password)
                                                      : await api.login(this.state.username, this.state.password);

        if(resp.status === "Success") {
            // Updates page
            this.setState({apiError: false, isLoading: false})
            this.props.updateLogin();
        }
        // Error
        else {
            // Clears saved values
            this.setState({username: "", password: "", isLoading: false, apiError: true});
        }

    }

    // Creates and returns button to switch forms (login <--> signup)
    getFormSwitchText = () => {
        const formSwitchText = this.state.formType === "Signup" ? "Already have an account?"
                                                                   : "Don't have an account?";

        const newFormType = this.state.formType === "Signup" ? "Login" : "Signup";
        const onFormSwitchTextClick = () => {this.setState({formType: newFormType, apiError: false})};
        return (
            <Link textAlign="center" _hover={{textDecoration: 'None'}}
            onClick={e => {e.preventDefault(); onFormSwitchTextClick();}}>
                {formSwitchText}
            </Link>
        )
    }

    // Toggles password visibility
    togglePasswordVisibility = () => {
        this.setState({showPassword: !this.state.showPassword});
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
                                           onChange={e => this.setState({username: e.currentTarget.value})}
                                    focusBorderColor="#0087C5"/>
                                </FormControl>
                                {/* Password Field */}
                                <FormControl isRequired>
                                    <FormLabel>Password</FormLabel>
                                    <InputGroup>
                                        <Input type={this.state.showPassword ? "text" : "password"}
                                               placeholder="*******" value={this.state.password}
                                               aria-label="Password" borderColor="#FFFFFF"
                                               onChange={e => this.setState({password: e.currentTarget.value})}/>
                                        <InputRightElement width="4.5rem">
                                            <Button h="1.75rem" size="sm" onClick={this.togglePasswordVisibility}
                                                    _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                                        color: "#FFFFFF", border: "1px solid white"}}
                                                    backgroundColor={"#FFFFFF"} focusBorderColor="#0087C5"
                                                    _focus={{outline: "none"}}>
                                                {this.state.showPassword ? "Hide" : "Show"}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>
                                {/* Submit Button */}
                                <Button width="full"
                                        type="submit"
                                        boxShadow='sm'
                                        backgroundColor={"#FFFFFF"}
                                        _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                            color: "#FFFFFF", border: "1px solid white"}}
                                        _active={{boxShadow: 'lg'}}
                                        _focus={{outline: "none"}}
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