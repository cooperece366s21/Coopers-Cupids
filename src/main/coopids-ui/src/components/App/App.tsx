import React, {Component} from 'react';
import logo from '../../logo.svg';
import './App.css';

// Sets types
type AppProps = {};
type AppState = {};

class App extends Component<AppProps, AppState> {
  constructor(props) {
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
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    );
  }
}

export default App;
