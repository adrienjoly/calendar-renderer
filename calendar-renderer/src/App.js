import React, { Component } from 'react';
import './App.css';
import Calendar from './Calendar';

const EVENTS = [
  {start: 30, end: 150},
  {start: 540, end: 600},
  {start: 560, end: 620},
  {start: 610, end: 670}
];

const EVENTS_WITH_IDS = (events => {
  let idCounter = 0;
  return events.map(evt => Object.assign({ id: idCounter++ }, evt));
})(EVENTS);

class App extends Component {
  constructor() {
    super();
    this.state = {
      events: EVENTS_WITH_IDS
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

/*
setTimeout(() => {
  window.layoutDay(EVENTS_WITH_IDS);
}, 1);
*/

export default App;
