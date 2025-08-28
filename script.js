const carIP = 'http://192.168.4.1'; // Change this to your car's IP

let isWifiMode = true;
let isBluetoothMode = false;

function sendCommand(cmd) {
  if (!isWifiMode) {
    console.log(`[Wi-Fi OFF] Ignored: ${cmd}`);
    return;
  }
  fetch(`${carIP}/${cmd}`)
    .then(response => response.ok ? console.log(`Command sent: ${cmd}`) : console.warn('Command failed'))
    .catch(err => console.error('Send error:', err));
}

// Power toggle
document.getElementById('powerToggle').addEventListener('change', function () {
  sendCommand(this.checked ? 'on' : 'off');
});

// Wi-Fi toggle
document.getElementById('wifiToggle').addEventListener('change', function () {
  const btToggle = document.getElementById('bluetoothToggle');
  if (this.checked) {
    btToggle.checked = false;
    isWifiMode = true;
    isBluetoothMode = false;
    sendCommand('wifi_mode');
  } else {
    isWifiMode = false;
    sendCommand('wifi_off');
  }
});

// Bluetooth toggle
document.getElementById('bluetoothToggle').addEventListener('change', function () {
  const wifiToggle = document.getElementById('wifiToggle');
  if (this.checked) {
    wifiToggle.checked = false;
    isBluetoothMode = true;
    isWifiMode = false;
    sendCommand('bluetooth_mode');
  } else {
    isBluetoothMode = false;
    sendCommand('bluetooth_off');
  }
});

// Joystick
const joystick = nipplejs.create({
  zone: document.getElementById('joystick-wrapper'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'blue',
  size: 150,
});

let lastDirection = '';
joystick.on('dir', (evt, data) => {
  if (data.direction && data.direction.angle !== lastDirection) {
    lastDirection = data.direction.angle;
    document.getElementById('status').innerText = `Direction: ${lastDirection}`;
    sendCommand(lastDirection);
  }
});

joystick.on('end', () => {
  lastDirection = '';
  document.getElementById('status').innerText = 'Stopped';
  sendCommand('stop');
});
