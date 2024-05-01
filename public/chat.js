document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatHistory = document.getElementById('chat-history');
    const usernameModal = document.getElementById('username-modal');
    const usernameForm = document.getElementById('username-form');
    const modalUsernameInput = document.getElementById('initial-username');

    // Check if a username is already set in localStorage
    let username = localStorage.getItem('username');

    if (!username) {
        usernameModal.style.display = 'flex';
        modalUsernameInput.focus();

        usernameForm.addEventListener('submit', (e) => {
            e.preventDefault();
            username = modalUsernameInput.value.trim();
            if (username && username.length >= 3) {
                localStorage.setItem('username', username);
                usernameModal.style.display = 'none';
            } else {
                alert('Username must be at least 3 characters.');
            }
        });
    } else {
        usernameModal.style.display = 'none';
    }

    fetch('/chat')
        .then(response => response.json())
        .then(messages => {
            chatHistory.innerHTML = messages.map(message => 
                `
                <div class="message-bubble">
                <span class="username">
                    <div class="tooltip">${message.username}
                        <span class="tooltiptext">${message.timestamp}</span>
                    </div>
                </span>
                <span class="message">${message.message}</span>
                </div>
                `
            ).join('');

            chatHistory.scrollTop = chatHistory.scrollHeight;


        });



    // Send a new message when the form is submitted
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const messageData = {
            username,
            message: document.getElementById('message').value.trim(),
        };

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData),
        })
        .then(response => response.json())
        .finally(() => {
            window.location.reload();
        });
    });

});
