import React, {Component} from "react";
import {Box, Heading, Stack} from "@chakra-ui/react";
import EditButton from "../../ui/EditButton/EditButton";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";
import {Profile, getCurrentUserProfile, setUserProfile} from "../../../services/api";

type ProfileLayoutProps = {checkCookieExpiration: () => void};
type ProfileLayoutState = {isEditing: boolean; profile: Profile; hasProfile: boolean; isLoading: boolean};

class ProfileLayout extends Component<ProfileLayoutProps,ProfileLayoutState> {
    constructor(props: ProfileLayoutProps) {
        super(props);
        this.state = {isEditing: false, profile: {} as Profile, hasProfile: false, isLoading: true};
    }

    async componentDidMount() {
        const json = await getCurrentUserProfile();

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        if(json != null) {
            this.setState({isEditing: false, profile: json, hasProfile: true, isLoading: false});
        } else {
            this.setState({isEditing: false, profile: {} as Profile, hasProfile: false, isLoading: false});
        }
    }

    onEditButtonClick = () => {
        this.setState({isEditing: true});
    }

    updateProfile = async (newProfile: Profile) => {
        this.setState({isLoading: true});
        const json = await setUserProfile(newProfile);

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        // Should never be null if we're updating the profile
        // Only checking to make TypeScript happy
        if(json != null) {
            this.setState({isEditing: false, profile: json, hasProfile: true, isLoading: false});
        }
    }

    render() {
        // Checks if loading profile
        if(this.state.isLoading) {
            return (
                <Heading m={8} pt={14} fontSize={["xl","2xl","3xl","3xl"]}>
                    Loading Profile...
                </Heading>
            );
        }

        return (
            <Stack width="full" align="center" justifyContent="center" spacing={4} pt={8} pb={20}>
                <ProfileViewer isEditing={this.state.isEditing} profile={this.state.profile}
                               currName={this.state.profile.name} hasProfile={this.state.hasProfile}
                               editProfile={this.updateProfile}/>
                {/* Edit Button */}
                {/* This button is separate, so the ProfileViewer Component can be reused on the feed page */}
                {!this.state.isEditing ?
                    <Box>
                        <EditButton hasProfile={this.state.hasProfile} onClick={this.onEditButtonClick}/>
                    </Box>
                    : null
                }
            </Stack>
        );
    }
}

export default ProfileLayout;
