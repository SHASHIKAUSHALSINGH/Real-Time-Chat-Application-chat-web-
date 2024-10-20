//Socket connects the client and server
const socket = io('http://localhost:8000');

// Get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageinp');
const messageContainer = document.querySelector(".container");

// Audio that will be played on receiving messages 
const audio = new Audio('WhatsappTone.mp3');

// Function that would append event info to the container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position === 'left') {
        audio.play();
    }
};

// Ask new user his/her name and let the server know
const promptName = () => {
    const name = prompt("Enter your name to join");
    if (name) {
        socket.emit('new-user-joined', name);
    } else {
        promptName(); // If no name is entered, prompt again
    }
};

promptName();

// If new user joins, receive his/her name from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// If server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});

// If form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});
