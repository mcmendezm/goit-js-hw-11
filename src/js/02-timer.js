import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const datePicker = flatpickr('#datetime-picker', {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    const currentDate = new Date();
    currentDate.setSeconds(0, 0); // Remove milliseconds

    if (selectedDate <= currentDate) {
      Notiflix.Notify.warning('Please choose a date in the future');
      return;
    }

    const startButton = document.querySelector('[data-start]');
    startButton.disabled = false;
  },
});

const timer = document.querySelector('.timer');
const daysElement = timer.querySelector('[data-days]');
const hoursElement = timer.querySelector('[data-hours]');
const minutesElement = timer.querySelector('[data-minutes]');
const secondsElement = timer.querySelector('[data-seconds]');
let countdownIntervalId;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateTimer() {
  const currentDate = new Date();
  const selectedDate = datePicker.selectedDates[0];
  const timeRemaining = selectedDate.getTime() - currentDate.getTime();

  if (timeRemaining <= 0) {
    clearInterval(countdownIntervalId);
    Notiflix.Report.success('Time is up!', 'The countdown has finished.', 'OK');
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeRemaining);

  daysElement.textContent = addLeadingZero(days);
  hoursElement.textContent = addLeadingZero(hours);
  minutesElement.textContent = addLeadingZero(minutes);
  secondsElement.textContent = addLeadingZero(seconds);
}

function startTimer() {
  countdownIntervalId = setInterval(updateTimer, 1000);
}

const startButton = document.querySelector('[data-start]');
startButton.addEventListener('click', startTimer);
startButton.disabled = true;
