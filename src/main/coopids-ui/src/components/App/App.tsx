import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import NavBar from "../sections/Navbar/navbar";
import ProfileLayout from "../layouts/ProfileLayout/ProfileLayout";
import FeedLayout from "../layouts/FeedLayout/FeedLayout";
import MessageLayout from "../layouts/MessagesLayout/MessageLayout";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";

// Sets types
type AppProps = {};
type AppState = {is_logged_in: boolean};

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {is_logged_in: false};
  }

  // TODO: Add logout button
  update_login = () => {
    this.setState({is_logged_in: !this.state.is_logged_in});
  }

  render() {
    return (
        <BrowserRouter>
          <div className="App">
            <NavBar is_logged_in={this.state.is_logged_in} update_login={this.update_login}/>
            <Switch>
              <Route exact path="/" render={() =>
                  (<HomeLayout is_logged_in={this.state.is_logged_in} update_login={this.update_login} />)
              } />
              {this.state.is_logged_in ?
                  <Route exact path="/Profile" component={ProfileLayout} />
                  : null}
              {this.state.is_logged_in ?
                <Route exact path="/Feed" component={FeedLayout} />
                  : null}
              {this.state.is_logged_in ?
                  <Route exact path="/Messages" component={MessageLayout} />
                  : null}
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
