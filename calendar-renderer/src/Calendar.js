import React, { Component } from 'react';
import './Calendar.css';

class Calendar extends Component {
  render() {
    console.log(this.props);
    return (
      <div className="Calendar">
        <div className="Calendar-container">
          Coucou
        </div>
      </div>
    );
  }
}

export default Calendar;
