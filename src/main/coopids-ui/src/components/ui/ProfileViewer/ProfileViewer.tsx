import React, {Component} from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    GridItem,
    Heading,
    Image,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Spacer,
    Stack,
    Text,
    Textarea
} from "@chakra-ui/react";
import {Profile} from "../../../services/api";

// currName is used to change text based on own profile vs feed viewing
type ProfileViewerProps = {isEditing: boolean; profile: Profile; currName: string | null;
                           hasProfile: boolean; editProfile: (newProfile: Profile) => void};
// editedProfile stores the updated profile before it is sent to the backend
type ProfileViewerState = {isLoading: boolean, editedProfile: Profile};

class ProfileViewer extends Component<ProfileViewerProps,ProfileViewerState> {
    constructor(props: ProfileViewerProps) {
        super(props);
        this.state = {isLoading: false, editedProfile: {...this.props.profile}}
    }

    onSubmit = async (newProfile: Profile) => {
        this.setState({isLoading: true});

        // Removes whitespace from interest list
        newProfile.interests = newProfile.interests.split(",")
            .map(interest => interest.trim()).join();

        await this.props.editProfile(newProfile);
    }

    render() {
            // If editing, show form instead
            if(this.props.isEditing) {

                return (
                    <Box p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg" borderColor="#FFFFFF">
                        <Box textAlign="center">
                            <Heading>Edit your profile</Heading>
                        </Box>
                        <Box my={4} textAlign="left">
                            <form onSubmit={e => {e.preventDefault();
                                this.onSubmit(this.state.editedProfile)}} >
                                <Stack spacing={4}>
                                    {/* Photo Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Photo</FormLabel>
                                        <Input type="name" value={this.state.editedProfile.photo || ""}
                                               aria-label="Photo"  borderColor="#FFFFFF"
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
                                               aria-label="Name"  borderColor="#FFFFFF"
                                               onChange={e => {e.persist(); this.setState(prevState => ({
                                                   editedProfile: {...prevState.editedProfile,
                                                       name: e.target.value}
                                               }))}}
                                        />
                                    </FormControl>
                                    {/* Age Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Age</FormLabel>
                                        <NumberInput min={18}  borderColor="#FFFFFF"
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
                                                  aria-label="Bio"  borderColor="#FFFFFF"
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
                                               aria-label="Location"  borderColor="#FFFFFF"
                                               onChange={e => {e.persist(); this.setState(prevState => ({
                                                   editedProfile: {...prevState.editedProfile,
                                                       location: e.target.value}
                                               }))}}
                                        />
                                    </FormControl>
                                    {/* Interests Field */}
                                    <FormControl isRequired>
                                        <FormLabel>Interests (Comma-Separated List)</FormLabel>
                                        <Input type="name" value={this.state.editedProfile.interests || ""}
                                               aria-label="Interests"  borderColor="#FFFFFF"
                                               onChange={e => {e.persist(); this.setState(prevState => ({
                                                   editedProfile: {...prevState.editedProfile,
                                                       interests: e.target.value}
                                               }))}}
                                        />
                                    </FormControl>
                                    <Spacer/>
                                    <Button width="full" type="submit" boxShadow='sm'
                                            backgroundColor={"#FFFFFF"}
                                            _hover={{boxShadow: 'md', backgroundColor: "#F2BBC1",
                                                color: "#FFFFFF", border: "1px solid white"}}
                                            _active={{boxShadow: 'lg'}} _focus={{outline: "none"}}
                                            isLoading={this.state.isLoading}>
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
                return (<Heading m={8} mt={14} fontSize={["xl","2xl","3xl","3xl"]}  lineHeight={2}>
                            You do not have a profile yet<br/>
                            Please click the button below to get started on your journey
                        </Heading>);
            } else {
                // Checks whether this is current user's profile or viewing feed
                // Affects text seen
                // Done here and stored, to save space below
                const ownProfile = this.props.currName === this.props.profile.name;
                return (
                    <Grid templateColumns="repeat(2,auto)" w="100%" maxW={"1200px"}>
                        {/* Intro text*/}
                        {ownProfile ?
                            <GridItem colSpan={2} m={4}>
                                <Text fontSize="xl" lineHeight={2}>The more you include on your profile,
                                    the faster the coopids can find you a match!</Text>
                            </GridItem>
                            : <GridItem colSpan={2} m={4} mt={8}>{/* Just to take up the same space */}</GridItem>}

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
                                {!ownProfile && this.props.currName !== null ?
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
                        <GridItem colSpan={2} mb={4} mt={[0,0,4,6]} ml={6} mr={6}>
                            <Text fontSize={["xl","xl","2xl","2xl"]} lineHeight={2}>
                                I am <b>{this.props.profile.age} years old</b> and currently located in <b>
                                {this.props.profile.location}</b>
                            </Text>
                        </GridItem>

                        {/* Bio */}
                        <GridItem colSpan={2} mb={4} ml={6} mr={6}>
                            <Text fontSize={["xl","xl","2xl","2xl"]} lineHeight={2} align="center">
                                <b>Let me tell you a little about myself:</b> {this.props.profile.bio}
                            </Text>
                        </GridItem>

                        {/* Interests */}
                        <GridItem colSpan={2} ml={6} mr={6}>
                            <Text fontSize={["xl","xl","2xl","2xl"]} lineHeight={2} align="center">
                                <b>My interests include:</b> {this.props.profile.interests.split(',').join(', ')}
                            </Text>
                        </GridItem>
                    </Grid>
                )
            }
    }
}

export default ProfileViewer;