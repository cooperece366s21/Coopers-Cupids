import React, {Component} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Switch
} from "@chakra-ui/react";
import {getEmailSettings, setEmailSettings, updateEmail, updatePassword} from "../../../services/api";
import FormMessage from "../../ui/FormMessage/FormMessage";

enum responseType {
    NONE,
    SUCCESS,
    MISMATCH_ERROR,
    INCORRECT_PSWD_ERROR
}
type SettingsLayoutProps = {checkCookieExpiration: () => void};
type SettingsLayoutState = {isLoading: boolean, matchEmails: boolean, messageEmails: boolean,
                            newEmail1: string, newEmail2:string, oldPassword: string, newPassword1: string,
                            newPassword2: string, showOldPassword: boolean, showNewPassword1: boolean,
                            showNewPassword2: boolean, preferencesResponse: boolean, emailResponse: responseType,
                            passwordResponse: responseType};

class SettingsLayout extends Component<SettingsLayoutProps, SettingsLayoutState> {
    constructor(props: SettingsLayoutProps) {
        super(props);
        this.state = {isLoading: true, matchEmails: true, messageEmails: true, oldPassword: "",
                      newPassword1: "", newPassword2: "", newEmail1: "", newEmail2: "", showOldPassword: false,
                      showNewPassword1: false, showNewPassword2: false, preferencesResponse: false,
                      emailResponse: responseType.NONE, passwordResponse: responseType.NONE}
    }

    async componentDidMount() {
        // Loads email settings & displays them
        await this.loadEmailSettings();
    }

    // Loads Settings / Email Preferences
    loadEmailSettings = async () => {
        // Loads email settings
        const settings = await getEmailSettings();

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        // If never submitted preferences, assume false
        if(settings === null) {
            this.setState({isLoading: false, matchEmails: false, messageEmails: false});
        } else {
            this.setState({isLoading: false, matchEmails: settings.matchEmails,
                                messageEmails: settings.messageEmails});
        }
    }

    // Updates Settings
    updateSettings = async () => {
        this.setState({isLoading: true});

        await setEmailSettings(this.state.matchEmails, this.state.messageEmails);
        await this.loadEmailSettings();

        this.setState({isLoading:false, preferencesResponse: true});
    }

    // Updates Password
    updatePassword = async () => {
        this.setState({isLoading: true});

        // Confirms old password is correct
        // TODO: Either make new endpoint to request current password or send both passwords to back

        // Checks that new passwords are equal
        if(this.state.newPassword1 === this.state.newPassword2) {
            await updatePassword(this.state.newPassword1);

            // Shows success message & clears form
            this.setState({passwordResponse: responseType.SUCCESS, oldPassword: "",
                                newPassword1: "", newPassword2: ""});
        } else {
            // Shows error message
            this.setState({passwordResponse: responseType.MISMATCH_ERROR});
        }

        this.setState({isLoading:false});
    }

    // Updates Email Address
    updateEmailAddress = async () => {
        this.setState({isLoading: true});

        // Checks that emails are equal
        if(this.state.newEmail1 === this.state.newEmail2) {
            await updateEmail(this.state.newEmail1);

            // Shows success message & clears form
            this.setState({emailResponse: responseType.SUCCESS, newEmail1: "", newEmail2: ""});
        } else {
            // Shows error message
            this.setState({emailResponse: responseType.MISMATCH_ERROR});
        }

        this.setState({isLoading:false});
    }

    // Gets response text for form
    // Parameter is type of form (either email or password)
    getResponseText = (form: string) => {
        // Email Form
        if(form === "Email") {
            // Success
            if(this.state.emailResponse === responseType.SUCCESS) {
                return "SUCCESS! Email Updated!";
            }
            // Mismatch Error
            if(this.state.emailResponse === responseType.MISMATCH_ERROR) {
                return "Uh Oh! Your emails don't match!";
            }
        }

        // Password Form
        if(form === "Password") {
            // Success
            if(this.state.passwordResponse === responseType.SUCCESS) {
                return "SUCCESS! Password Updated!";
            }
            // Mismatch Error
            if(this.state.passwordResponse === responseType.MISMATCH_ERROR) {
                return "Uh Oh! Your new passwords don't match!";
            }
            // Incorrect Old Password Error
            if(this.state.passwordResponse === responseType.INCORRECT_PSWD_ERROR) {
                return "Uh Oh! Your old password doesn't match our records!"
            }
        }

        // Should never get here, but Typescript is annoying
        return "";
    }

    render() {
        return (
            <Stack spacing={6} mb={14}>
                <Heading mt={14} mb={6} fontSize={["3xl","4xl","4xl","5xl"]}>
                    Settings
                </Heading>

                {/* Settings Form */}
                <Box textAlign="left" alignSelf="center" p={8} minW={["250px","400px","400px","400px"]} maxWidth="500px"
                     w={["312px", "auto", "auto", "auto"]} borderWidth={1} borderRadius={8} boxShadow="lg"
                     borderColor="#FFFFFF">
                    <Box textAlign="center">
                        <Heading  fontSize={["2xl","3xl","3xl","3xl"]}>
                            Email Preferences
                        </Heading>
                    </Box>
                    <Box mt={6}>
                        <form onSubmit={e => {e.preventDefault();
                            this.updateSettings()}}>

                            {/* Success Message */}
                            {this.state.preferencesResponse ?
                                <FormMessage message={"Success! Preferences Updated!"} type={"success"}/>
                            : null}

                            <Stack spacing={4}>
                                {/* Receive emails on matches */}
                                <FormControl display="flex" alignItems="center">
                                    <Switch mr={4}/>
                                    <FormLabel>
                                        Receive emails for matches
                                    </FormLabel>
                                </FormControl>

                                {/* Receive emails on messages */}
                                <FormControl display="flex" alignItems="center">
                                    <Switch mr={4} _focus={{outline: "none"}}/>
                                    <FormLabel>
                                        Receive emails for new messages
                                    </FormLabel>
                                </FormControl>

                                <Button width="full" type="submit" boxShadow='sm'
                                        backgroundColor={"#FFFFFF"}
                                        _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                            color: "#FFFFFF", border: "1px solid white"}}
                                        _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}
                                        isLoading={this.state.isLoading}>
                                    Update Preferences
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                </Box>

                {/* Email Change Form */}
                <Box textAlign="left" alignSelf="center" p={8} minW={["250px","400px","400px","400px"]} maxWidth="500px"
                     w={["312px", "auto", "auto", "auto"]} borderWidth={1} borderRadius={8} boxShadow="lg"
                     borderColor="#FFFFFF">
                    <Box textAlign="center">
                        <Heading fontSize={["2xl","3xl","3xl","3xl"]}>Update Email Address</Heading>
                    </Box>
                    <Box mt={6}>
                        <form onSubmit={e => {e.preventDefault();
                            this.updateEmailAddress()}}>

                            {/* Success / Error Message */}
                            {this.state.emailResponse === responseType.SUCCESS ?
                                <FormMessage message={this.getResponseText("Email")} type={"success"}/>
                            : this.state.emailResponse === responseType.MISMATCH_ERROR ?
                                <FormMessage message={this.getResponseText("Email")} type={"error"}/>
                            : null}

                            <Stack spacing={4}>
                                {/* New Email Field */}
                                <FormControl isRequired>
                                    <FormLabel>New Email</FormLabel>
                                    <Input type="email"
                                           placeholder="Cooopers@Cupids.com" value={this.state.newEmail1}
                                           aria-label="New Email" borderColor="#FFFFFF"
                                           onChange={e => this.setState({newEmail1: e.currentTarget.value})}
                                    />
                                </FormControl>

                                {/* New Email Confirm Field */}
                                <FormControl isRequired>
                                    <FormLabel>Confirm New Email</FormLabel>
                                    <Input type="email"
                                           placeholder="Cooopers@Cupids.com" value={this.state.newEmail2}
                                           aria-label="New Email Confirm" borderColor="#FFFFFF"
                                           onChange={e => this.setState({newEmail2: e.currentTarget.value})}
                                    />
                                </FormControl>

                                <Button width="full" type="submit" boxShadow='sm'
                                        backgroundColor={"#FFFFFF"}
                                        _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                            color: "#FFFFFF", border: "1px solid white"}}
                                        _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}
                                        isLoading={this.state.isLoading}>
                                    Update Email Address
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                </Box>

                {/* Password Change Form */}
                <Box textAlign="left" alignSelf="center" p={8} minW={["250px","400px","400px","400px"]} maxWidth="500px"
                     w={["312px", "auto", "auto", "auto"]} borderWidth={1} borderRadius={8} boxShadow="lg"
                     borderColor="#FFFFFF">
                    <Box textAlign="center">
                        <Heading fontSize={["2xl","3xl","3xl","3xl"]}>Update Password</Heading>
                    </Box>
                    <Box mt={6}>
                        <form onSubmit={e => {e.preventDefault();
                            this.updatePassword()}}>

                            {/* Success / Error Message */}
                            {this.state.passwordResponse === responseType.SUCCESS ?
                                <FormMessage message={this.getResponseText("Password")} type={"success"}/>
                            : this.state.passwordResponse === responseType.MISMATCH_ERROR ||
                            this.state.passwordResponse === responseType.INCORRECT_PSWD_ERROR ?
                                <FormMessage message={this.getResponseText("Password")} type={"error"}/>
                            : null}

                            <Stack spacing={4}>
                                {/* Old Password Field */}
                                <FormControl isRequired>
                                    <FormLabel>Old Password</FormLabel>
                                    <InputGroup>
                                        <Input type={this.state.showOldPassword ? "text" : "password"}
                                               placeholder="*******" value={this.state.oldPassword}
                                               aria-label="Old Password" borderColor="#FFFFFF"
                                               onChange={e => this.setState({oldPassword: e.currentTarget.value})}
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Button h="1.75rem" size="sm" onClick={e => this.setState(
                                                    {showOldPassword: !this.state.showOldPassword})}
                                                    _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                                        color: "#FFFFFF", border: "1px solid white"}}
                                                    backgroundColor={"#FFFFFF"} focusBorderColor="#0087C5"
                                                    _focus={{outline: "none"}}>
                                                {this.state.showOldPassword ? "Hide" : "Show"}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                {/* New Password Field */}
                                <FormControl isRequired>
                                    <FormLabel>New Password</FormLabel>
                                    <InputGroup>
                                        <Input type={this.state.showNewPassword1 ? "text" : "password"}
                                               placeholder="*******" value={this.state.newPassword1}
                                               aria-label="New Password" borderColor="#FFFFFF"
                                               onChange={e => this.setState({newPassword1: e.currentTarget.value})}
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Button h="1.75rem" size="sm" onClick={e => this.setState(
                                                    {showNewPassword1: !this.state.showNewPassword1})}
                                                    _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                                        color: "#FFFFFF", border: "1px solid white"}}
                                                    backgroundColor={"#FFFFFF"} focusBorderColor="#0087C5"
                                                    _focus={{outline: "none"}}>
                                                {this.state.showNewPassword1 ? "Hide" : "Show"}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                {/* New Password Confirm Field */}
                                <FormControl isRequired>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <InputGroup>
                                        <Input type={this.state.showNewPassword2 ? "text" : "password"}
                                               placeholder="*******" value={this.state.newPassword2}
                                               aria-label="New Password Confirm" borderColor="#FFFFFF"
                                               onChange={e => this.setState({newPassword2: e.currentTarget.value})}
                                        />
                                        <InputRightElement width="4.5rem">
                                            <Button h="1.75rem" size="sm" onClick={e => this.setState(
                                                    {showNewPassword2: !this.state.showNewPassword2})}
                                                    _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                                        color: "#FFFFFF", border: "1px solid white"}}
                                                    backgroundColor={"#FFFFFF"} focusBorderColor="#0087C5"
                                                    _focus={{outline: "none"}}>
                                                {this.state.showNewPassword2 ? "Hide" : "Show"}
                                            </Button>
                                        </InputRightElement>
                                    </InputGroup>
                                </FormControl>

                                <Button width="full" type="submit" boxShadow='sm'
                                        backgroundColor={"#FFFFFF"}
                                        _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                            color: "#FFFFFF", border: "1px solid white"}}
                                        _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}
                                        isLoading={this.state.isLoading}>
                                    Update Password
                                </Button>
                            </Stack>
                        </form>
                    </Box>
                </Box>
            </Stack>
        );
    }
}

export default SettingsLayout;