import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token')
  }
});

socket.on('connect_error', (error) => {
  if (error.message === 'unauthorized') {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.auth = { token: localStorage.getItem('token') };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;
