import React, { Component } from 'react';
import './App.css';
import Calendar from './Calendar';

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: []
    };
  }
  render() {
    return (
      <div className="App">
        <Calendar events={this.state.events}>
        </Calendar>
      </div>
    );
  }
}

export default App;
