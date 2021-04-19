import React, {Component} from 'react';
import './App.css';
import NavBar from "../sections/Navbar/Navbar";
import LoginSignupForm from "../ui/LoginSignupForm/LoginSignupForm";
import ProfileLayout from "../layouts/ProfileLayout/ProfileLayout";
import FeedLayout from "../layouts/FeedLayout/FeedLayout";
import MessageLayout from "../layouts/MessagesLayout/MessageLayout";

// Sets types
type AppProps = {};
type AppState = {};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    // Make backend requests here
    this.setState({});
  }

  render() {
    return (
        <div className="App">
          <NavBar />
          <MessageLayout />
        </div>
    );
  }
}

export default App;
