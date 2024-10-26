document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const whatsappLink = document.getElementById('whatsapp-link');

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        const messageText = document.createElement('p');
        messageText.textContent = message;

        messageElement.appendChild(messageText);
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        appendMessage('user', message);
        userInput.value = '';
        fetchReply(message);
    }

    async function fetchReply(message) {
        appendMessage('bot', '🤔 Typing...');
        try {
            const response = await fetch('https://your-vercel-deployment-url.com/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            const data = await response.json();
            // Remove 'Typing...' message
            const typingMessage = document.querySelector('.chat-message.bot:last-child p');
            typingMessage.textContent = data.reply;
        } catch (error) {
            console.error('Error:', error);
            const typingMessage = document.querySelector('.chat-message.bot:last-child p');
            typingMessage.textContent = '❌ An error occurred. Please try again.';
        }
    }

    // WhatsApp Integration
    whatsappLink.addEventListener('click', function(e) {
        e.preventDefault();
        const phoneNumber = '525528503766'; // Replace with your WhatsApp number
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        window.open(whatsappUrl, '_blank');
    });
});
