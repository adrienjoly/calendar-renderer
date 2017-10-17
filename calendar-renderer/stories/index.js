import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Calendar from '../src/Calendar';

storiesOf('Calendar', module)
  .add('Provided data', () => (
    <Calendar events={[
      {start: 30, end: 150},
      {start: 540, end: 600},
      {start: 560, end: 620},
      {start: 610, end: 670} // test: should be at position 0
    ]} />
  ))
  .add('Small overlap', () => (
    <Calendar events={[
      {start: 30, end: 150},
      {start: 140, end: 180}, // test: should overlap with the previous
    ]} />
  ))
