import React, {Component} from 'react';
import {Box, Button, FormControl, FormLabel, Heading, Input, Stack} from "@chakra-ui/react";

type SettingsLayoutProps = {checkCookieExpiration: () => void};
type SettingsLayoutState = {isLoading: boolean};

class SettingsLayout extends Component<SettingsLayoutProps, SettingsLayoutState> {
    constructor(props: SettingsLayoutProps) {
        super(props);
        this.state = {isLoading: true}
    }

    async componentDidMount() {
        await this.loadSettings();
    }

    // Load Settings / Email Preferences
    loadSettings = async () => {
        // TODO: Implement API Call
        this.setState({isLoading: false});
    }

    // Updates Settings
    updateSettings = async () => {

    }

    render() {
        return (
            <Stack spacing={4}>
                <Heading m={8} mt={14} fontSize={["xl","2xl","3xl","3xl"]}>
                    Settings
                </Heading>

                {/* Settings Form */}
                <Box textAlign="left" alignSelf="center" p={8} maxWidth="500px" borderWidth={1}
                     borderRadius={8} boxShadow="lg" borderColor="#FFFFFF">
                    <form onSubmit={e => {e.preventDefault();
                        this.updateSettings()}}>
                        <Stack spacing={4}>
                            {/* Receive emails on matches */}
                            <FormControl>

                            </FormControl>

                            {/* Receive emails on messages */}
                            <FormControl>

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

                {/* Password Change Form */}
                <Box  textAlign="left" alignSelf="center" p={8} maxWidth="500px" borderWidth={1}
                      borderRadius={8} boxShadow="lg" borderColor="#FFFFFF">
                    <form onSubmit={e => {e.preventDefault();
                        this.updateSettings()}}>
                        <Stack spacing={4}>
                            {/* Old password */}
                            <FormControl>

                            </FormControl>

                            {/* New password */}
                            <FormControl>

                            </FormControl>

                            {/* New password confirm */}
                            <FormControl>

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
            </Stack>
        );
    }
}

export default SettingsLayout;