import React, {Component} from "react";
import {
    Box, Stack, Image, Text, Heading, FormControl, FormLabel, Input,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, Button, Textarea
} from "@chakra-ui/react";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import {Profile} from "../../../services/api";

type ProfileViewerProps = {is_editing: boolean; profile: Profile;
                           has_profile: boolean; editProfile: (new_profile: Profile) => void};
type ProfileViewerState = {error: boolean, is_loading: boolean, editedProfile: Profile};

class ProfileViewer extends Component<ProfileViewerProps,ProfileViewerState> {
    constructor(props: ProfileViewerProps) {
        super(props);
        this.state = {error: false, is_loading: false, editedProfile: {...this.props.profile}}
    }

    onSubmit = async (new_profile: Profile) => {
        this.setState({is_loading: true});

        await this.props.editProfile(new_profile);

        this.setState({is_loading: false});
    }

    render() {
            // If editing, show form instead
            if(this.props.is_editing) {

                return (
                    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                        <Box textAlign="center">
                            <Heading>Edit your profile</Heading>
                        </Box>
                        <Box my={4} textAlign="left">
                            <form onSubmit={e => e.preventDefault()} action="">
                                <Stack spacing={4}>
                                    {/* Error Message */}
                                    {/* In future, will have error depending on incorrect field */}
                                    {this.state.error && <ErrorMessage message="Incorrect Input" />}
                                    {/* Photo Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Photo</FormLabel>
                                        <Input type="name" value={this.state.editedProfile.photo || ""}
                                               aria-label="Photo"
                                               onChange={e => {e.persist(); this.setState(prevState => ({
                                                   editedProfile: {...prevState.editedProfile,
                                                                   photo: e.target.value}
                                               }))}}
                                        />
                                    </FormControl>
                                    {/* Name Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Name</FormLabel>
                                        <Input type="name" value={this.state.editedProfile.name || ""}
                                               aria-label="Name"
                                               onChange={e => {e.persist(); this.setState(prevState => ({
                                                   editedProfile: {...prevState.editedProfile,
                                                       name: e.target.value}
                                               }))}}
                                        />
                                    </FormControl>
                                    {/* Age Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Age</FormLabel>
                                        <NumberInput min={18}
                                                     value={this.state.editedProfile.age || ""}
                                                     onChange={e => this.setState(prevState => ({
                                                         editedProfile: {...prevState.editedProfile,
                                                             age: Number(e)}
                                                     }))}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                    {/* Bio Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Bio</FormLabel>
                                        <Textarea type="name" value={this.state.editedProfile.bio || ""}
                                                  aria-label="Bio"
                                                  onChange={e => {e.persist(); this.setState(prevState => ({
                                                      editedProfile: {...prevState.editedProfile,
                                                          bio: e.target.value}
                                                  }))}}
                                        />
                                    </FormControl>
                                    {/* Location Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Location</FormLabel>
                                        <Input type="name" value={this.state.editedProfile.location || ""}
                                               aria-label="Location"
                                               onChange={e => {e.persist(); this.setState(prevState => ({
                                                   editedProfile: {...prevState.editedProfile,
                                                       location: e.target.value}
                                               }))}}
                                        />
                                    </FormControl>
                                    {/* Interests Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Interests</FormLabel>
                                        <Input type="name" value={this.state.editedProfile.interests || ""}
                                               aria-label="Interests"
                                               onChange={e => {e.persist(); this.setState(prevState => ({
                                                   editedProfile: {...prevState.editedProfile,
                                                       interests: e.target.value}
                                               }))}}
                                        />
                                    </FormControl>
                                    <Button width="full"
                                            type="submit"
                                            boxShadow='sm'
                                            _hover={{boxShadow: 'md'}}
                                            _active={{boxShadow: 'lg'}}
                                            onClick={() => this.onSubmit(this.state.editedProfile)}
                                            isLoading={this.state.is_loading}
                                    >
                                        {this.props.has_profile ? "Update Profile" : "Create Profile"}
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                )
            }

            // Will only pull a non-profiled user if current user
            // In future will take some profile info at sign-up which can be added to later on
            if(!this.props.has_profile) {
                return (<Heading>You do not have a profile.<br/>Please click the button below to get started.</Heading>)
            } else {
                return (
                    <Stack spacing={6}>
                        {/* Profile Picture */}
                        <Box>
                            <Image src={this.props.profile.photo || undefined} alt={`${this.props.profile.name} Profile Picture`} />
                        </Box>
                        {/* Name */}
                        <Box>
                            <Text><b>NAME:</b> {this.props.profile.name}</Text>
                        </Box>
                        {/* Age */}
                        {this.props.profile.age ?
                            <Box>
                                <Text><b>AGE:</b> {this.props.profile.age}</Text>
                            </Box> 
                            : null 
                        }
                        {/* Bio */}
                        {this.props.profile.bio ?
                            <Box>
                                <Text><b>BIO:</b> {this.props.profile.bio}</Text>
                            </Box> 
                            : null 
                        }
                        {/* Location */}
                        {this.props.profile.location ?
                            <Box>
                                <Text><b>LOCATION:</b> {this.props.profile.location}</Text>
                            </Box> 
                            : null 
                        }
                        {/* Interests */}
                        {this.props.profile.interests ?
                            <Box>
                                <Text><b>INTERESTS:</b> {this.props.profile.interests}</Text>
                            </Box> 
                            : null 
                        }
                    </Stack>
                )
            }
    }
}

export default ProfileViewer;