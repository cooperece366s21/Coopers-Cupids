import React, {Component} from "react";
import {Box, Stack} from "@chakra-ui/react";
import EditButton from "../../ui/EditButton/EditButton";
import ProfileViewer from "../../ui/ProfileViewer/ProfileViewer";
import {Profile, getCurrentUserProfile, setUserProfile} from "../../../services/api";

type ProfileLayoutProps = {};
type ProfileLayoutState = {is_editing: boolean; profile: Profile; has_profile: boolean};

class ProfileLayout extends Component<ProfileLayoutProps,ProfileLayoutState> {
    constructor(props: ProfileLayoutProps) {
        super(props);
        this.state = {is_editing: false, has_profile: false, profile: {} as Profile};
    }

    async componentDidMount() {
        const json = await getCurrentUserProfile();

        if(json != null) {
            this.setState({is_editing: false, profile: json, has_profile: true})
        }
    }

    onEditButtonClick = () => {
        this.setState({is_editing: true});
    }

    updateProfile = async (new_profile: Profile) => {
        const json = await setUserProfile(new_profile);
        // Should never be null if we're updating the profile
        // Only checking to make TypeScript happy
        if(json != null) {
            this.setState({profile: json, has_profile: true, is_editing: false});
        }
    }

    render() {
        return (
            <Stack width="full" align="center" justifyContent="center" spacing={4}>
                <ProfileViewer is_editing={this.state.is_editing} profile={this.state.profile}
                               has_profile={this.state.has_profile} editProfile={this.updateProfile}/>
                {/* Edit Button */}
                {/*This button is separate, so the ProfileViewer Component can be reused on the feed page*/}
                {!this.state.is_editing ?
                    <Box>
                        <EditButton has_profile={this.state.has_profile} onClick={this.onEditButtonClick}/>
                    </Box>
                    : null
                }
            </Stack>
        )
    }
}

export default ProfileLayout;