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

  update_login = () => {
    if(this.state.isLoggedIn) {
      logout();
    }
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  render() {
    if(!this.state.isLoggedIn) {
      return (
          <BrowserRouter>
            <div className="App">
              <NavBar isLoggedIn={this.state.isLoggedIn} updateLogin={this.update_login}/>
              <HomeLayout isLoggedIn={this.state.isLoggedIn} updateLogin={this.update_login} />
            </div>
          </BrowserRouter>
      );
    }

    return (
        <BrowserRouter>
          <div className="App">
            <NavBar isLoggedIn={this.state.isLoggedIn} updateLogin={this.update_login}/>
            <Switch>
              <Route exact path="/" render={() =>
                  (<HomeLayout isLoggedIn={this.state.isLoggedIn} updateLogin={this.update_login} />)
              } />
              <Route exact path="/Profile" component={ProfileLayout} />
              <Route exact path="/Feed" component={FeedLayout} />
              <Route exact path="/Messages" component={MessageLayout} />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
