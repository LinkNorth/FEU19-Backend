let socket = io();


let form = document.querySelector('form');
let input = document.querySelector('input');
let chat = document.querySelector('#chat');

form.addEventListener('submit', e => {
  e.preventDefault();
  let value = input.value;
  socket.emit('new_message', value);
  input.value = '';
  addMessage(value);
});

socket.on('message', (data) => {
  addMessage(data);
});

function addMessage(data) {
  let p = document.createElement('p');
  p.textContent = data;
  chat.appendChild(p);
}
