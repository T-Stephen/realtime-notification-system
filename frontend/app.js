const state = {
  socket: null,
  isPaused: false,
  totalCount: 0,
  serverUrl: 'http://localhost:3000'
};

const statusBadge = document.getElementById('status-badge');
const statusText = document.getElementById('status-text');
const totalCountElem = document.getElementById('total-count');
const serverUrlInput = document.getElementById('server-url');
const btnConnect = document.getElementById('btn-connect');
const btnPause = document.getElementById('btn-pause');
const pauseText = document.getElementById('pause-text');
const btnClear = document.getElementById('btn-clear');
const btnTest = document.getElementById('btn-test');
const btnClearConsole = document.getElementById('btn-clear-console');
const notifContainer = document.getElementById('notifications-container');
const emptyState = document.getElementById('empty-state');
const consoleOutput = document.getElementById('console-output');

function logToTerminal(msg, type = 'system') {
  const timestamp = new Date().toLocaleTimeString();
  const formattedText = `[${timestamp}] ${msg}`;
  
  console.log(`%c[SocketLog] ${formattedText}`, type === 'error' ? 'color: red' : type === 'success' ? 'color: green' : 'color: cyan');

  const line = document.createElement('div');
  line.className = `console-line ${type}`;
  line.textContent = formattedText;
  
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function updateStatus(status, text) {
  statusBadge.className = `status-badge ${status}`;
  statusText.textContent = text;
}

function displayNotification(data) {
  if (state.isPaused) return;

  if (emptyState && emptyState.parentElement) {
    emptyState.remove();
  }

  let id = '#';
  let messageText = '';
  let timeStr = new Date().toLocaleTimeString();

  if (typeof data === 'object' && data !== null) {
    id = data.id !== undefined ? `#${data.id}` : '#';
    messageText = data.message || JSON.stringify(data);
    timeStr = data.time || timeStr;
  } else {
    messageText = String(data);
  }

  const card = document.createElement('div');
  card.className = 'notification-item';
  card.innerHTML = `
    <div class="notif-icon-box">
      <i class="fa-solid fa-bell"></i>
    </div>
    <div class="notif-content">
      <div class="notif-meta">
        <span class="notif-id">${id}</span>
        <span class="notif-time">${timeStr}</span>
      </div>
      <div class="notif-text">${escapeHtml(messageText)}</div>
    </div>
  `;

  notifContainer.insertBefore(card, notifContainer.firstChild);

  if (notifContainer.children.length > 50) {
    notifContainer.removeChild(notifContainer.lastChild);
  }
}

function handleIncomingNotification(rawData, eventName = 'notification') {
  state.totalCount++;
  totalCountElem.textContent = state.totalCount;

  let parsed = rawData;

  if (typeof rawData === 'string') {
    try {
      parsed = JSON.parse(rawData);
    } catch (e) {
      parsed = rawData;
    }
  }

  const displayText = typeof parsed === 'object' ? JSON.stringify(parsed) : String(parsed);
  logToTerminal(`[RECV:${eventName}] -> ${displayText}`, 'incoming');

  displayNotification(parsed);
}

function initSocket() {
  const targetUrl = serverUrlInput.value.trim() || 'http://localhost:3000';
  state.serverUrl = targetUrl;

  if (state.socket) {
    logToTerminal(`Disconnecting existing connection...`, 'system');
    state.socket.disconnect();
    state.socket = null;
  }

  updateStatus('connecting', 'Connecting...');
  logToTerminal(`Initiating connection to ${targetUrl}...`, 'system');

  try {
    state.socket = io(targetUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      timeout: 10000
    });

    state.socket.on('connect', () => {
      updateStatus('connected', 'Connected');
      logToTerminal(`Connected successfully! Socket ID: ${state.socket.id}`, 'success');
    });

    state.socket.on('disconnect', (reason) => {
      updateStatus('disconnected', 'Disconnected');
      logToTerminal(`Socket disconnected. Reason: ${reason}`, 'error');
    });

    state.socket.on('connect_error', (error) => {
      updateStatus('disconnected', 'Conn Error');
      logToTerminal(`Connection error: ${error.message}`, 'error');
    });

    state.socket.on('notification', (data) => handleIncomingNotification(data, 'notification'));
    state.socket.on('notifications_channel', (data) => handleIncomingNotification(data, 'notifications_channel'));
    state.socket.on('message', (data) => handleIncomingNotification(data, 'message'));
    state.socket.on('alert', (data) => handleIncomingNotification(data, 'alert'));

    state.socket.onAny((eventName, ...args) => {
      const explicitEvents = ['notification', 'notifications_channel', 'message', 'alert', 'connect', 'disconnect'];
      if (!explicitEvents.includes(eventName)) {
        args.forEach((payload) => handleIncomingNotification(payload, eventName));
      }
    });

  } catch (err) {
    updateStatus('disconnected', 'Failed');
    logToTerminal(`Socket initialization failed: ${err.message}`, 'error');
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

btnConnect.addEventListener('click', () => {
  initSocket();
});

serverUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    initSocket();
  }
});

btnPause.addEventListener('click', () => {
  state.isPaused = !state.isPaused;
  if (state.isPaused) {
    btnPause.classList.add('btn-primary');
    btnPause.classList.remove('btn-secondary');
    btnPause.innerHTML = '<i class="fa-solid fa-play"></i> <span id="pause-text">Resume Feed</span>';
    logToTerminal('[SYSTEM] Feed rendering paused.', 'system');
  } else {
    btnPause.classList.remove('btn-primary');
    btnPause.classList.add('btn-secondary');
    btnPause.innerHTML = '<i class="fa-solid fa-pause"></i> <span id="pause-text">Pause Feed</span>';
    logToTerminal('[SYSTEM] Feed rendering resumed.', 'system');
  }
});

btnClear.addEventListener('click', () => {
  notifContainer.innerHTML = `
    <div id="empty-state" class="empty-state">
      <div class="empty-icon">
        <i class="fa-regular fa-bell-slash"></i>
      </div>
      <h3>Waiting for incoming events...</h3>
      <p>Connect to the WebSocket server to begin streaming real-time notifications.</p>
    </div>
  `;
  logToTerminal('[SYSTEM] Notification feed cleared.', 'system');
});

btnClearConsole.addEventListener('click', () => {
  consoleOutput.innerHTML = '';
  logToTerminal('[SYSTEM] Console cleared.', 'system');
});

btnTest.addEventListener('click', () => {
  const testPayload = {
    id: 'TEST-' + Math.floor(Math.random() * 1000),
    message: 'Manual Test Event: Notification engine client received test pulse!',
    time: new Date().toLocaleTimeString()
  };
  handleIncomingNotification(testPayload, 'test_event');
});

window.addEventListener('DOMContentLoaded', () => {
  initSocket();
});
