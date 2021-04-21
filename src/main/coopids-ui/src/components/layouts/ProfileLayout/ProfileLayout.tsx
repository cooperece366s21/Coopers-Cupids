import React, {Component} from "react";
import {Box, Stack} from "@chakra-ui/react";
import EditButton from "../../ui/EditButton/EditButton";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";
import {Profile, getCurrentUserProfile, setUserProfile} from "../../../services/api";

type ProfileLayoutProps = {};
type ProfileLayoutState = {isEditing: boolean; profile: Profile; hasProfile: boolean};

class ProfileLayout extends Component<ProfileLayoutProps,ProfileLayoutState> {
    constructor(props: ProfileLayoutProps) {
        super(props);
        this.state = {isEditing: false, hasProfile: false, profile: {} as Profile};
    }

    async componentDidMount() {
        const json = await getCurrentUserProfile();

        if(json != null) {
            this.setState({isEditing: false, profile: json, hasProfile: true})
        }
    }

    onEditButtonClick = () => {
        this.setState({isEditing: true});
    }

    updateProfile = async (newProfile: Profile) => {
        const json = await setUserProfile(newProfile);
        // Should never be null if we're updating the profile
        // Only checking to make TypeScript happy
        if(json != null) {
            this.setState({profile: json, hasProfile: true, isEditing: false});
        }
    }

    render() {
        return (
            <Stack width="full" align="center" justifyContent="center" spacing={4}>
                <ProfileViewer isEditing={this.state.isEditing} profile={this.state.profile}
                               hasProfile={this.state.hasProfile} editProfile={this.updateProfile}/>
                {/* Edit Button */}
                {/*This button is separate, so the ProfileViewer Component can be reused on the feed page*/}
                {!this.state.isEditing ?
                    <Box>
                        <EditButton hasProfile={this.state.hasProfile} onClick={this.onEditButtonClick}/>
                    </Box>
                    : null
                }
            </Stack>
        )
    }
}

export default ProfileLayout;