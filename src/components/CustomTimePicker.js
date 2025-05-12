// src/components/CustomTimePicker.js

import React from 'react';

const CustomTimePicker = ({ value, onChange }) => {
  // Если значение не задано или выбранный час вне диапазона [12,21], используем "12:00"
  let [selectedHour, selectedMinute] = value ? value.split(':') : ['12', '00'];
  if (+selectedHour < 12 || +selectedHour > 21) {
    selectedHour = '12';
    selectedMinute = '00';
  }

  // Массив часов от 12 до 21
  const hours = [];
  for (let i = 12; i <= 21; i++) {
    hours.push(i.toString().padStart(2, '0'));
  }
  // Минуты только "00" и "30"
  const minutesOptions = ['00', '30'];

  const handleHourChange = (e) => {
    onChange(`${e.target.value}:${selectedMinute}`);
  };

  const handleMinuteChange = (e) => {
    onChange(`${selectedHour}:${e.target.value}`);
  };

  return (
    <div className="custom-time-picker">
      <select
        className="time-select hour-select"
        value={selectedHour}
        onChange={handleHourChange}
      >
        {hours.map((hour) => (
          <option key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className="time-separator">:</span>
      <select
        className="time-select minute-select"
        value={selectedMinute}
        onChange={handleMinuteChange}
      >
        {minutesOptions.map((min) => (
          <option key={min} value={min}>
            {min}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CustomTimePicker;
