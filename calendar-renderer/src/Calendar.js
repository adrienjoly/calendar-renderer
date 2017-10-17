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

// to position hour and half hour entries on side axis
const styleHourOnAxis = hour => ({
  height: 30 * PIXELS_PER_MINUTE,
  top: (hour - DAY_START_HR) * 60 * PIXELS_PER_MINUTE,
});

// to position events based on `pos` and `len` props
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

// returns an array of events conflicting/overlapping with a given event
const getConflictingEvents = (event, eventSlots) =>
  event.slots.reduce((conflictEvents, slot) =>
    conflictEvents.concat(eventSlots[slot]), []);

// returns a Set of positions that were already affected to conflicting events
const getTakenPositions = (event, eventSlots) =>
  new Set(getConflictingEvents(event, eventSlots)
    .map(slotEvent => slotEvent.pos));

// returns the maximum number of conflicting events, for a given event
const computeMaxLen = (event, eventSlots) =>
  event.slots.reduce((max, slot) => Math.max(max, eventSlots[slot].length), 0);

// returns the first available position for an event, based on conflicting events
// warning: this function mutates event
function takeAvailPos(event, eventSlots) {
  const takenPositions = getTakenPositions(event, eventSlots)
  const maxPos = computeMaxLen(event, eventSlots);
  return event.pos = createRange(0, maxPos).find(pos => !takenPositions.has(pos));
}

// returns an array of events that contain `pos` and `len` props (for positionning)
function layoutEvents(events) {
  let timestamps = new Set();
  // 1) populate the `timestamps` Set + add a `slots` prop to each events
  let laidEvents = events.map(initialEvent => {
    timestamps
      .add(initialEvent.start)
      .add(initialEvent.end)
    return Object.assign({}, initialEvent, { slots: [] });
  });
  // 2) populate eventSlots based on events + timestamps
  let eventSlots = Array.from(timestamps).sort().map((timestamp, index) => {
    const containedEvents = laidEvents.filter(event => event.start <= timestamp && event.end > timestamp);
    containedEvents.forEach(event => event.slots.push(index));
    return containedEvents;
  });
  return laidEvents.map(event => Object.assign({}, event, {
    pos: takeAvailPos(event, eventSlots),
    len: computeMaxLen(event, eventSlots),
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
