import React, {Component} from "react";
import {
    Box, Stack, Image, Text, Heading, FormControl, FormLabel, Input,
    NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper,
    NumberDecrementStepper, Button, Textarea, Grid, GridItem, Flex
} from "@chakra-ui/react";
import ErrorMessage from "../../ui/ErrorMessage/ErrorMessage";
import {Profile} from "../../../services/api";

// currName is used to change text based on own profile vs feed viewing
type ProfileViewerProps = {isEditing: boolean; profile: Profile; currName: string;
                           hasProfile: boolean; editProfile: (newProfile: Profile) => void};
// editedProfile stores the updated profile before it is sent to the backend
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
            if(!this.props.hasProfile) {
                return (<Heading>You do not have a profile yet.<br/>
                    Please click the button below to get started on your journey.</Heading>);
            } else {
                // Checks whether this is current user's profile or viewing feed
                // Affects text seen
                // Done here and stored, to save space below
                const ownProfile = this.props.currName === this.props.profile.name;
                return (
                    <Grid templateColumns="repeat(2,auto)" w="100%">
                        {/* Intro text*/}
                        {ownProfile ?
                            <GridItem colSpan={2} m={4}>
                                <Text fontSize="xl" lineHeight={2}>The more you include on your profile,
                                    the faster the coopids can find you a match!</Text>
                            </GridItem>
                            : <GridItem colSpan={2} m={4} mt={8}></GridItem>}

                        {/* Profile Picture */}
                        <GridItem colSpan={[2,2,1,1]} m={4} justifySelf="center">
                            <Image borderRadius="full" src={this.props.profile.photo || undefined}
                                   fallbackSrc={"images/Temp_Profile.jpg"}
                                   alt={`${this.props.profile.name} Profile Picture`}
                                   boxSize={["15em","15em","18em","22em"]} fit="cover"/>
                        </GridItem>

                        {/* Name */}
                        <GridItem colSpan={[2,2,1,1]} justifySelf={["center","center","left","left"]} m={4}>
                            <Flex h={"100%"} alignItems={"center"}>
                                {/* Adds custom greeting message to feed */}
                                {!ownProfile ?
                                    <Text fontSize="4xl" lineHeight={2}>
                                        Hi {this.props.currName}!
                                        <br/>My name is {this.props.profile.name}!
                                    </Text>
                                :   <Text fontSize="4xl" lineHeight={2}>
                                        My name is {this.props.profile.name}!
                                    </Text>
                                }
                            </Flex>
                        </GridItem>

                        {/* Age & Location*/}
                        <GridItem colSpan={2} mb={4} mt={[0,0,4,6]}>
                            <Text fontSize="2xl" lineHeight={2}>I am <b>{this.props.profile.age} years old</b> and currently located
                                in <b>{this.props.profile.location}</b></Text>
                        </GridItem>

                        {/* Bio */}
                        <GridItem colSpan={2} mb={4}>
                            <Text fontSize="2xl" lineHeight={2}><b>Let me tell you a little about myself:</b> {this.props.profile.bio}</Text>
                        </GridItem>

                        {/* Interests */}
                        <GridItem colSpan={2}>
                            <Text fontSize="2xl" lineHeight={2}><b>My interests include:</b> {this.props.profile.interests}</Text>
                        </GridItem>
                    </Grid>
                )
            }
    }
}

export default ProfileViewer;