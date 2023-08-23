function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`;
}

const startButton = document.querySelector('[data-start]');
const stopButton = document.querySelector('[data-stop]');

let intervalId = 0;

function changeBackgroundColor() {
  const color = getRandomHexColor();
  document.body.style.backgroundColor = color;
}

startButton.addEventListener('click', function () {
  startButton.disabled = true;
  stopButton.disabled = false;
  intervalId = setInterval(changeBackgroundColor, 1000);
});

stopButton.addEventListener('click', function () {
  startButton.disabled = false;
  stopButton.disabled = true;
  clearInterval(intervalId);
});

stopButton.disabled = true;
