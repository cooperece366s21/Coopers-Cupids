import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavBar from "../sections/Navbar/Navbar";
import ProfileLayout from "../layouts/ProfileLayout/ProfileLayout";
import FeedLayout from "../layouts/FeedLayout/FeedLayout";
import MessageLayout from "../layouts/MessagesLayout/MessageLayout";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import {isStillSignedIn} from "../../services/api";

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
    this.setState({isLoggedIn: !this.state.isLoggedIn});
  }

  render() {
    return (
        <BrowserRouter>
          <div className="App">
            <NavBar isLoggedIn={this.state.isLoggedIn} updateLogin={this.update_login}/>
            <Switch>
              <Route exact path="/" render={() =>
                  (<HomeLayout isLoggedIn={this.state.isLoggedIn} updateLogin={this.update_login} />)
              } />
              {this.state.isLoggedIn ?
                  <Route exact path="/Profile" component={ProfileLayout} />
                  : null}
              {this.state.isLoggedIn ?
                <Route exact path="/Feed" component={FeedLayout} />
                  : null}
              {this.state.isLoggedIn ?
                  <Route exact path="/Messages" component={MessageLayout} />
                  : null}
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
