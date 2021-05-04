import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavBar from "../sections/Navbar/Navbar";
import ProfileLayout from "../layouts/ProfileLayout/ProfileLayout";
import FeedLayout from "../layouts/FeedLayout/FeedLayout";
import MessageLayout from "../layouts/MessagesLayout/MessageLayout";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import {isStillSignedIn, logout} from "../../services/api";

// Sets types
type AppProps = {};
type AppState = {isLoggedIn: boolean};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    // TODO: Update is_logged_in based on local_storage values
    this.state = {isLoggedIn: false};
  }

  componentDidMount() {
    if(isStillSignedIn()) {
      this.setState({isLoggedIn: true});
    }
  }

  updateLogin = () => {
    if(this.state.isLoggedIn) {
      logout();
    }
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  // Checks if cookies have expired
  // Resets state when cookies expire
  // Should be called whenever a request is made
  CheckCookieExpiration = () => {
    if(!isStillSignedIn()) {
      this.setState({isLoggedIn: false});
    }
  }

  render() {
    if(!this.state.isLoggedIn) {
      return (
          <BrowserRouter>
            <div className="App">
              <NavBar isLoggedIn={this.state.isLoggedIn} updateLogin={this.updateLogin}/>
              <HomeLayout isLoggedIn={this.state.isLoggedIn} updateLogin={this.updateLogin} />
            </div>
          </BrowserRouter>
      );
    }

    return (
        <BrowserRouter>
          <div className="App">
            <NavBar isLoggedIn={this.state.isLoggedIn} updateLogin={this.updateLogin}/>
            <Switch>
              <Route exact path="/" render={() =>
                  (<HomeLayout isLoggedIn={this.state.isLoggedIn} updateLogin={this.updateLogin} />)
              } />
              <Route exact path="/Profile" render={() =>
                  (<ProfileLayout checkCookieExpiration={this.CheckCookieExpiration}/>)
              } />
              <Route exact path="/Feed" render={() =>
                  (<FeedLayout checkCookieExpiration={this.CheckCookieExpiration}/>)
              } />
              <Route exact path="/Messages" render={() =>
                  (<MessageLayout checkCookieExpiration={this.CheckCookieExpiration}/>)
              } />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
