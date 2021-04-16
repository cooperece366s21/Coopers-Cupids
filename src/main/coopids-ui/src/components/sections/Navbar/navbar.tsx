import React, {Component} from "react";

// Sets types
type NavbarProps = {};
type NavbarState = {currentPage: "Home" | "Feed" | "Messages" | "Profile" | "Settings"};

class Navbar extends Component<NavbarProps, NavbarState> {
    constructor(props: NavbarProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1>THIS WILL BE A NAVBAR AT SOME POINT I PROMISE</h1>
            </div>
        );
    }
}

export default Navbar;