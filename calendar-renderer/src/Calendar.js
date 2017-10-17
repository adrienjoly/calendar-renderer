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
  width: CONTAINER_WIDTH + 2 * CONTAINER_PADDING,
  height: CONTAINER_HEIGHT + 2 * CONTAINER_PADDING,
  padding: CONTAINER_PADDING,
};

const styleLaidEvent = event => ({
  height: (event.end - event.start) * PIXELS_PER_MINUTE,
  top: CONTAINER_PADDING + event.start * PIXELS_PER_MINUTE,
  left: CONTAINER_PADDING + CONTAINER_WIDTH * (event.pos / event.len),
  width: CONTAINER_WIDTH / event.len,
});

// generic helpers

const createArrayOfArrays = length =>
  Array.apply(null, { length }).map(() => []);

const createRange = (first, last) =>
  Array.apply(null, { length: 1 + last - first }).map((v, i) => first + i);

// layout helpers

const computeMaxLen = (event, eventsPerHour) =>
  Math.max.apply(Math, event.slots.map(hour => eventsPerHour[hour].length));

function takeAvailPos(event, eventsPerHour) {
  const conflictEvents = event.slots.reduce((events, hour) =>
    events.concat(eventsPerHour[hour].filter(slotEvent =>
      slotEvent !== event)), []);
  const takenPositions = new Set(conflictEvents.map(slotEvent => slotEvent.pos));
  const maxPos = computeMaxLen(event, eventsPerHour);
  return createRange(0, maxPos).find(pos => !takenPositions.has(pos));
}

function layoutEvents(events) {
  let eventsPerHour = createArrayOfArrays(24);
  let laidEvents = events.map(initialEvent => {
    const startHour = Math.floor(initialEvent.start / 60);
    const endHour = Math.ceil(initialEvent.start / 60);
    let event = Object.assign({}, initialEvent, {
      slots: createRange(startHour, endHour),
    });
    event.slots.forEach(hour => eventsPerHour[hour].push(event));
    event.pos = takeAvailPos(event, eventsPerHour);
    return event;
  });
  return laidEvents.map((event) => Object.assign({}, event, {
    len: computeMaxLen(event, eventsPerHour),
  }));
}

// rendering functions

const renderEvents = events =>
  layoutEvents(events).map((event, index) =>
    <div key={index} className="Calendar-event" style={styleLaidEvent(event)}>
      <div className="Calendar-event-name">Sample Item ({event.start})</div>
      <div className="Calendar-event-location">Sample Location</div>
    </div>
  );

const renderAxis = () => {
  const hours = createRange(2 * DAY_START / 60, 2 * DAY_END / 60)
    .map(v => v / 2)
    .map((v, i) => {
      if (Number.isInteger(v)) {
        return <p key={i} className="Calendar-axis-hour"><b>{v}:00</b> AM</p> /* todo: AM / PM */
      } else {
        return <p key={i} className="Calendar-axis-half">{Math.floor(v)}:30</p>
      }
    });
  console.log(hours);
  return (
    <div className="Calendar-axis">
      {hours}
    </div>
  );
}

// Calendar component

class Calendar extends Component {
  render() {
    return (
      <div className="Calendar">
        {renderAxis()}
        <div className="Calendar-container" style={containerStyle}>
          {renderEvents(this.props.events)}
        </div>
      </div>
    );
  }
}

export default Calendar;
