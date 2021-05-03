import React, {Component} from "react";
import {Box, Button, Grid, Stack} from "@chakra-ui/react";
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

    // TODO: Only show home page when not logged in
    render() {
        return (
            <Grid as="nav" w="fill" mb={8} p={8}>
                <NavBarToggleButton onToggle={this.toggleNavBar} isOpen={this.state.isOpen} />
                <Box display={{ base: this.state.isOpen ? "block" : "none", md: "block" }}>
                    <Stack spacing={[4,4,8,8]} align="center" justify={["center", "center", "flex-end", "flex-end"]}
                        direction={["column", "column", "row", "row"]}>
                        <NavBarLink linkTo={"/"} onPageChange={this.closeNavBar}>Home</NavBarLink>
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
                            <Button pt={0} onClick={() => {this.closeNavBar();this.props.updateLogin();}}>Logout</Button>
                            : null }
                    </Stack>
                </Box>
                {/* TODO: Add settings icon for "change password" and "logout" */}
            </Grid>
        );
    }
}

export default NavBar;