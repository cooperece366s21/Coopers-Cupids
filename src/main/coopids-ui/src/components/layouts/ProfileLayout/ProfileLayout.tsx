import React, {Component} from "react";
import { Box, Button, Flex, Stack, Image, Text } from "@chakra-ui/react";
import EditButton from "../../ui/EditButton/EditButton";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";
import {Profile, getCurrentUserProfile, setUserProfile} from "../../../services/api";

type ProfileLayoutProps = {};
type ProfileLayoutState = {is_editing: boolean; profile: Profile; editedProfile: Profile};

class ProfileLayout extends Component<ProfileLayoutProps,ProfileLayoutState> {
    constructor(props: ProfileLayoutProps) {
        super(props);
        this.state = {is_editing: false, profile: null, editedProfile: null}
    }

    componentDidMount() {
        getCurrentUserProfile().then(json => this.setState({profile: json, editedProfile: json}))
    }

    onEditButtonClick = async () => {
        // Checks if need to save
        if(this.state.is_editing) {
            // Make API call
            const newProfile = await setUserProfile(this.state.editedProfile)
                .then(json => this.setState({profile: json, editedProfile: json}));
        }
        this.setState({is_editing: !this.state.is_editing})
    }

    updateProfile = (key: string, value: string | number | null) => {
        this.setState(prevState => ({editedProfile: {...prevState.editedProfile, key: value}}));
    }

    render() {
        return (
            <Flex width="full" align="center" justifyContent="center">
                {/* Edit Button */}
                <Box float="right">
                    <EditButton is_editing={this.state.is_editing} onClick={this.onEditButtonClick}/>
                </Box>
                <ProfileViewer is_editing={this.state.is_editing} profile={this.state.editedProfile}/>
            </Flex>
        )
    }
}

export default ProfileLayout;