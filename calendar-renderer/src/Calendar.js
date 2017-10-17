import React, { Component } from 'react';
import './Calendar.css';

const DAY_START = 9 * 60; // in minutes => 9am
const DAY_END = 21 * 60; // in minutes => 9pm
const CONTAINER_WIDTH = 600; // not including 2 x 10px padding
const CONTAINER_HEIGHT = 700; // not including 2 x 10px padding

// computed constants
const HOURS_PER_DAY = DAY_END - DAY_START;
const PIXELS_PER_MINUTE = CONTAINER_HEIGHT / HOURS_PER_DAY;

const containerStyle = {
  width: `${CONTAINER_WIDTH}px`,
  height: `${CONTAINER_HEIGHT}px`,
};

class Calendar extends Component {
  render() {
    console.log(this.props);
    const eventStyle = this.props.events.map((event, index) => ({
      height: `${(event.end - event.start) * PIXELS_PER_MINUTE}px`,
      top: `${event.start * PIXELS_PER_MINUTE}px`,
      // TODO: adjust left and width based on collisions
    }));
    const renderedEvents = this.props.events.map((event, index) =>
      <div key={index} className="Calendar-event" style={eventStyle[index]}>
        <div className="Calendar-event-name">{event.start} => {(DAY_START + event.start) / 60}</div>
        <div className="Calendar-event-location">Sample Location</div>
      </div>
    );
    return (
      <div className="Calendar">
        <div className="Calendar-container" style={containerStyle}>
          {renderedEvents}
        </div>
      </div>
    );
  }
}

export default Calendar;
