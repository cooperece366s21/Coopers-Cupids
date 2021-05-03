import React, {Component} from "react";
import {
    Box, Stack, Image, Text, Heading, FormControl, FormLabel, Input,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, Button, Textarea, Grid, GridItem
} from "@chakra-ui/react";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import {Profile} from "../../../services/api";

type ProfileViewerProps = {isEditing: boolean; profile: Profile;
                           hasProfile: boolean; editProfile: (newProfile: Profile) => void};
type ProfileViewerState = {error: boolean, isLoading: boolean, editedProfile: Profile};

class ProfileViewer extends Component<ProfileViewerProps,ProfileViewerState> {
    constructor(props: ProfileViewerProps) {
        super(props);
        this.state = {error: false, isLoading: false, editedProfile: {...this.props.profile}}
    }

    onSubmit = async (newProfile: Profile) => {
        this.setState({isLoading: true});

        await this.props.editProfile(newProfile);

        this.setState({isLoading: false});
    }

    render() {
            // If editing, show form instead
            if(this.props.isEditing) {

                return (
                    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                        <Box textAlign="center">
                            <Heading>Edit your profile</Heading>
                        </Box>
                        <Box my={4} textAlign="left">
                            <form onSubmit={e => {e.preventDefault();
                                this.onSubmit(this.state.editedProfile)}} >
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
                                            isLoading={this.state.isLoading}
                                    >
                                        {this.props.hasProfile ? "Update Profile" : "Create Profile"}
                                    </Button>
                                </Stack>
                            </form>
                        </Box>
                    </Box>
                )
            }

            // Will only pull a non-profiled user if current user
            // In future will take some profile info at sign-up which can be added to later on
            if(!this.props.hasProfile) {
                return (<Heading>You do not have a profile.<br/>Please click the button below to get started.</Heading>)
            } else {
                return (
                    <Grid templateColumns="repeat(2,auto)" w="fill" align="center">
                        {/* Profile Picture */}
                        <GridItem>
                            <Image src={this.props.profile.photo || undefined} alt={`${this.props.profile.name} Profile Picture`} />
                        </GridItem>

                        {/* Name */}
                        <GridItem>
                            <Text>Hi! My name is {this.props.profile.name}!</Text>
                        </GridItem>

                        {/* Age & Location*/}
                        <GridItem colSpan={2}>
                            <Text>I am <b>{this.props.profile.age} years old</b> and currently located
                                in <b>{this.props.profile.location}</b></Text>
                        </GridItem>

                        {/* Bio */}
                        <GridItem colSpan={2}>
                            <Text><b>Here's a little about me:</b> {this.props.profile.bio}</Text>
                        </GridItem>

                        {/* Interests */}
                        <GridItem colSpan={2}>
                            <Text><b>My interests include:</b> {this.props.profile.interests}</Text>
                        </GridItem>

                    </Grid>
                )
            }
    }
}

export default ProfileViewer;