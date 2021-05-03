import React, {Component} from "react";
import {Button, Grid, GridItem, Image, Stack} from "@chakra-ui/react";
import NavBarToggleButton from "../../ui/NavBarToggleButton/NavBarToggleButton";
import NavBarLink from "../../ui/NavbarLink/NavBarLink";

// Sets types
type NavBarProps = {isLoggedIn: boolean; updateLogin: () => void};
type NavBarState = {isOpen: boolean};

class NavBar extends Component<NavBarProps, NavBarState> {
    constructor(props: NavBarProps) {
        super(props);
        this.state = {isOpen: false};
    }

    // Toggle Navbar state on small screens
    toggleNavBar = () => {this.setState({isOpen: !this.state.isOpen});}

    // Closes Navbar on page change
    closeNavBar = () => {this.setState({isOpen: false});}

    render() {
        return (
            <Grid as="nav" w="fill" mb={8} p={8} templateColumns="repeat(2,auto)" borderBottom={"solid #cfcdcc .5px"}>
                <GridItem display="inline" justifySelf="flex-start" pl={4}>
                    <NavBarLink linkTo={"/"} onPageChange={this.closeNavBar}>
                        <Image src="images/Coopids_logo_large.png" width="9em"/>
                    </NavBarLink>
                </GridItem>
                <NavBarToggleButton onToggle={this.toggleNavBar} isOpen={this.state.isOpen} />
                <GridItem display={{ base: this.state.isOpen ? "block" : "none", md: "block" }} colSpan={[2,2,1,1]}>
                    <Stack spacing={[4,4,10,20]} align="center" justify={["center", "center", "flex-end", "flex-end"]}
                        direction={["column", "column", "row", "row"]} pt={5} pr={4}>
                        {this.props.isLoggedIn ?
                            <NavBarLink linkTo={"/Profile"} onPageChange={this.closeNavBar}>Profile</NavBarLink>
                            : null }
                        {this.props.isLoggedIn ?
                            <NavBarLink linkTo={"/Feed"} onPageChange={this.closeNavBar}>Feed</NavBarLink>
                            : null }
                        {this.props.isLoggedIn ?
                            <NavBarLink linkTo={"/Messages"} onPageChange={this.closeNavBar}>Messages</NavBarLink>
                            : null }
                        {this.props.isLoggedIn ?
                            <Button pt={0} _hover={{background: "#F2BBC1", color: "white"}} onClick={() => {this.closeNavBar();this.props.updateLogin();}}>Logout</Button>
                            : null }
                    </Stack>
                </GridItem>
                {/* TODO: Add settings icon for "change email" & "change password"*/}
            </Grid>
        );
    }
}

export default NavBar;