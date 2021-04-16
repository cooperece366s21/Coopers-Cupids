import React, {Component} from 'react';
import './App.css';
import LoginSignupForm from "../ui/LoginSignupForm/LoginSignupForm";
import NavBar from "../sections/NavBar/navbar";

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
          <LoginSignupForm />
        </div>
    );
  }
}

export default App;
