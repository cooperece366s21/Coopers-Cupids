import React, {Component} from "react";
import { Box, Stack, Image, Text, Heading, FormControl, FormLabel, Input,
         NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
         NumberDecrementStepper } from "@chakra-ui/react";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import { Profile } from "../../../services/api";

type ProfileViewerProps = {is_editing: boolean, profile: Profile, editedProfile: Profile};
type ProfileViewerState = {error: boolean};

class ProfileViewer extends Component<ProfileViewerProps,ProfileViewerState> {

    render() {
            // If editing, show form instead
            if(this.props.is_editing) {

                return (
                    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                        <Box textAlign="center">
                            <Heading>Edit your profile</Heading>
                        </Box>
                        <Box my={4} textAlign="left">
                            <form onSubmit={e => e.preventDefault()}>
                                <Stack spacing={4}>
                                    {/* Error Message */}
                                    {/* In future, will have error depending on incorrect field */}
                                    {this.state.error && <ErrorMessage message="Incorrect Input" />}
                                    {/* Photo Field */}
                                    <FormControl>
                                        <FormLabel>Photo</FormLabel>
                                        <Input type="name" placeholder={editedProfile.photo || ""} 
                                            value={editedProfile.photo || ""} aria-label="Photo"
                                            onChange={e => editedProfile.photo = e.currentTarget.value}/>
                                    </FormControl>
                                    {/* Name Field */}
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <Input type="name" placeholder={editedProfile.name || ""} 
                                            value={editedProfile.name || ""} aria-label="Name"
                                            onChange={e => editedProfile.name = e.currentTarget.value}/>
                                    </FormControl>
                                    {/* Age Field */}
                                    <FormControl>
                                        <FormLabel>Age</FormLabel>
                                        <NumberInput defaultValue={editedProfile.age || 18} min={18} 
                                                     value={editedProfile.age || 18}
                                                     onChange={e => editedProfile.age = Number(e)}>
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                    {/* Bio Field */}
                                    <FormControl>
                                        <FormLabel>Bio</FormLabel>
                                        <Input type="name" placeholder={editedProfile.bio || ""} 
                                            value={editedProfile.bio || ""} aria-label="Bio"
                                            onChange={e => editedProfile.bio = e.currentTarget.value}/>
                                    </FormControl>
                                    {/* Location Field */}
                                    <FormControl>
                                        <FormLabel>Location</FormLabel>
                                        <Input type="name" placeholder={editedProfile.location || ""} 
                                            value={editedProfile.location || ""} aria-label="Location"
                                            onChange={e => editedProfile.location = e.currentTarget.value}/>
                                    </FormControl>
                                    {/* Interests Field */}
                                    <FormControl>
                                        <FormLabel>Interests</FormLabel>
                                        <Input type="name" placeholder={editedProfile.interests || ""} 
                                            value={editedProfile.interests || ""} aria-label="Interests"
                                            onChange={e => editedProfile.interests = e.currentTarget.value}/>
                                    </FormControl>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                )
            }

            // Will only pull a non-profiled user if current user
            // In future will take some profile info at sign-up which can be added to later on
            if(this.props.profile == null) {
                return (<Heading>You do not have a profile.<br/>Please click the <i>edit</i> button above.</Heading>)
            } else {
                return (
                    <Stack spacing={4}>
                        {/* Profile Picture */}
                        <Box>
                            <Image src={this.props.profile.photo || undefined} alt={`${this.props.profile.name} Profile Picture`} />
                        </Box>
                        {/* Name */}
                        <Box>
                            <Text>{this.props.profile.name}</Text>
                        </Box>
                        {/* Age */}
                        {this.props.profile.age ?
                            <Box>
                                <Text>{this.props.profile.age}</Text>
                            </Box> 
                            : null 
                        }
                        {/* Bio */}
                        {this.props.profile.bio ?
                            <Box>
                                <Text>{this.props.profile.bio}</Text>
                            </Box> 
                            : null 
                        }
                        {/* Location */}
                        {this.props.profile.location ?
                            <Box>
                                <Text>{this.props.profile.location}</Text>
                            </Box> 
                            : null 
                        }
                        {/* Interests */}
                        {this.props.profile.interests ?
                            <Box>
                                <Text>{this.props.profile.interests}</Text>
                            </Box> 
                            : null 
                        }
                    </Stack>
                )
            }
    }
}

export default ProfileViewer;