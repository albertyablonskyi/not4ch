const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Chat history file
const chatHistoryFile = path.join(__dirname, 'chat-history.json');
if (!fs.existsSync(chatHistoryFile)) {
    fs.writeFileSync(chatHistoryFile, JSON.stringify([]));
}

// Get chat history
app.get('/chat', (req, res) => {
    const chatHistory = JSON.parse(fs.readFileSync(chatHistoryFile));
    res.json(chatHistory);
});

// Post a new message
app.post('/chat', (req, res) => {
    const { username, message } = req.body;
    const newMessage = { username, message, timestamp: new Date().toUTCString() };

    const chatHistory = JSON.parse(fs.readFileSync(chatHistoryFile));
    chatHistory.push(newMessage);

    fs.writeFileSync(chatHistoryFile, JSON.stringify(chatHistory));

    res.status(201).json(newMessage);
});

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
