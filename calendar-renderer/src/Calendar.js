import React, { Component } from 'react';
import './Calendar.css';

const DAY_START_HR = 9; // 9am
const DAY_END_HR = 21; // 9pm
const DAY_START = DAY_START_HR * 60; // => in minutes
const DAY_END = DAY_END_HR * 60; // => in minutes
const CONTAINER_WIDTH = 600; // not including padding
const CONTAINER_HEIGHT = 720;
const CONTAINER_PADDING = 10; // in px (left and right only)

// computed constants

const MINUTES_PER_DAY = DAY_END - DAY_START;
const PIXELS_PER_MINUTE = CONTAINER_HEIGHT / MINUTES_PER_DAY;

const containerStyle = {
  width: CONTAINER_WIDTH + 2 * CONTAINER_PADDING,
  height: CONTAINER_HEIGHT,
  padding: `0 ${CONTAINER_PADDING}px`,
};

const getMinutes = hour =>
  Number.isInteger(hour) ? '00' : '30';

const getHourClassName = hour =>
  Number.isInteger(hour) ? 'Calendar-axis-hour' : 'Calendar-axis-half';

const styleHourOnAxis = hour => ({
  height: 30 * PIXELS_PER_MINUTE,
  top: (hour - DAY_START_HR) * 60 * PIXELS_PER_MINUTE,
});

const styleLaidEvent = event => ({
  height: (event.end - event.start) * PIXELS_PER_MINUTE,
  top: event.start * PIXELS_PER_MINUTE,
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
      <div className="Calendar-event-name">Sample Item</div>
      <div className="Calendar-event-location">Sample Location</div>
    </div>
  );

const renderHours = () =>
  createRange(2 * DAY_START / 60, 2 * DAY_END / 60)
    .map(v => v / 2)
    .map((hour, i) => (
      <p
        key={i}
        className={getHourClassName(hour)}
        style={styleHourOnAxis(hour)}
      >
        <span className="axis-time">
          {1 + (Math.floor(hour) - 1) % 12}:{getMinutes(hour)}
        </span>
        &nbsp;
        <span className="axis-day-period">
          {hour < 12 ? 'AM' : 'PM'}
        </span>
      </p>
    ));

// Calendar component

class Calendar extends Component {
  render() {
    return (
      <div className="Calendar">
        <div className="Calendar-axis">
          {renderHours()}
        </div>
        <div className="Calendar-container" style={containerStyle}>
          {renderEvents(this.props.events)}
        </div>
      </div>
    );
  }
}

export default Calendar;
