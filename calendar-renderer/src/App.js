import React, { Component } from 'react';
import './App.css';
import Calendar from './Calendar';

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: []
    };
    window.layoutDay = (events) => this.setState({ events });
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

setTimeout(() => {
  window.layoutDay([
    {start: 30, end: 150},
    {start: 540, end: 600},
    {start: 560, end: 620},
    {start: 610, end: 670}
  ]);
}, 1);

export default App;
