import React, {Component} from "react";
import {Box, Stack} from "@chakra-ui/react";
import EditButton from "../../ui/EditButton/EditButton";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";
import {Profile, getCurrentUserProfile, setUserProfile} from "../../../services/api";

type ProfileLayoutProps = {checkCookieExpiration: () => void};
type ProfileLayoutState = {isEditing: boolean; profile: Profile; hasProfile: boolean};

class ProfileLayout extends Component<ProfileLayoutProps,ProfileLayoutState> {
    constructor(props: ProfileLayoutProps) {
        super(props);
        this.state = {isEditing: false, hasProfile: false, profile: {} as Profile};
    }

    async componentDidMount() {
        const json = await getCurrentUserProfile();

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        if(json != null) {
            this.setState({isEditing: false, profile: json, hasProfile: true})
        }
    }

    onEditButtonClick = () => {
        this.setState({isEditing: true});
    }

    updateProfile = async (newProfile: Profile) => {
        const json = await setUserProfile(newProfile);

        // Checks if cookies expired (request failed)
        this.props.checkCookieExpiration();

        // Should never be null if we're updating the profile
        // Only checking to make TypeScript happy
        if(json != null) {
            this.setState({profile: json, hasProfile: true, isEditing: false});
        }
    }

    render() {
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
