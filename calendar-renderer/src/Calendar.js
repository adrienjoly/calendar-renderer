import React, { Component } from 'react';
import './Calendar.css';

const DAY_START = 9 * 60; // in minutes => 9am
const DAY_END = 21 * 60; // in minutes => 9pm
const CONTAINER_WIDTH = 600; // not including padding
const CONTAINER_HEIGHT = 700; // not including padding
const CONTAINER_PADDING = 10; // in px

// computed constants
const HOURS_PER_DAY = DAY_END - DAY_START;
const PIXELS_PER_MINUTE = CONTAINER_HEIGHT / HOURS_PER_DAY;

const containerStyle = {
  width: `${CONTAINER_WIDTH + 2 * CONTAINER_PADDING}px`,
  height: `${CONTAINER_HEIGHT + 2 * CONTAINER_PADDING}px`,
};

const createArrayOfArrays = length =>
  Array.apply(null, { length }).map(() => []);

function layoutEvents(events) {
  let idCounter = 0;
  let laidEvents = events.map(event => Object.assign({id: idCounter++}, event, {
    startHour: Math.floor(event.start / 60),
    endHour: Math.ceil(event.start / 60),
    slots: [],
  }));

  let eventsPerHour = createArrayOfArrays(24);
  
  const computeMaxLen = event =>
  Math.max.apply(Math, event.slots.map(hour => eventsPerHour[hour].length))

  function takeAvailPos(event, eventsPerHour) {
    const conflictEvents = event.slots.reduce((events, hour) =>
      events.concat(eventsPerHour[hour].filter(slotEvent =>
        slotEvent !== event)), []);
    // TODO: remove duplicate events
    console.log('conflict events:', conflictEvents);
    const maxLen = computeMaxLen(event);
    const takenPositions = new Set(conflictEvents.map(slotEvent => slotEvent.pos));
    console.log('token positions:', takenPositions);
    for (let pos = 0; pos < maxLen; ++pos) {
      if (!takenPositions.has(pos)) {
        return pos;
      }
    }
  }

  // TODO: sort events by start time first?
  eventsPerHour = laidEvents.reduce((eventsPerHour, event) => {
    for (let hour = event.startHour; hour <= event.endHour; ++hour) {
      event.slots.push(hour);
      eventsPerHour[hour].push(event);
    }
    if (isNaN(event.pos)) {
      event.pos = takeAvailPos(event, eventsPerHour);
    }
    return eventsPerHour;
  }, eventsPerHour);

  return laidEvents.map((event) => Object.assign({}, event, {
    len: computeMaxLen(event),
  }));
}

class Calendar extends Component {
  render() {
    console.log(this.props);
    const laidEvents = layoutEvents(this.props.events);
    console.log('laid => ', laidEvents);
    const eventStyle = laidEvents.map((event, index) => ({
      height: `${(event.end - event.start) * PIXELS_PER_MINUTE}px`,
      top: `${event.start * PIXELS_PER_MINUTE}px`,
      left: CONTAINER_WIDTH * (event.pos / event.len),
      width: CONTAINER_WIDTH / event.len,
      // TODO: adjust left and width based on collisions
    }));
    const renderedEvents = this.props.events.map((event, index) =>
      <div key={index} className="Calendar-event" style={eventStyle[index]}>
        <div className="Calendar-event-name">Sample Item ({event.start})</div>
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
