import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './ChatbotForm.css'; 
const ChatbotForm = () => {
 // State hooks
 const [skillLevel, setSkillLevel] = useState('beginner'); // Skill level state
 const [userMessage, setUserMessage] = useState('');
 const [messages, setMessages] = useState([]);
 const [loading, setLoading] = useState(false);
 const [waitingForFeedback, setWaitingForFeedback] = useState(false);
 const [userFeedback, setUserFeedback] = useState('');
 // Ref to scroll to the bottom of the chat messages
 const messagesEndRef = useRef(null);
 // Effect to scroll to the latest message
 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages]);
 // Handle changes in user message
 const handleUserMessageChange = (e) => setUserMessage(e.target.value);
 // Handle changes in skill level
 const handleSkillLevelChange = (e) => setSkillLevel(e.target.value);
 // Handle changes in user feedback
 const handleFeedbackChange = (e) => setUserFeedback(e.target.value);
 // Submit user message and get chatbot response
 const handleSubmit = async (e) => {
 e.preventDefault();
 // Add user message to chat
 setMessages((prevMessages) => [
 ...prevMessages,
 { sender: 'user', text: userMessage },
 ]);
 setUserMessage('');
 setLoading(true);
 try {
 // Call API to get chatbot response
 const response = await axios.post('http://localhost:8000/api/chatbot/', {
 topic: userMessage,
 skill_level: skillLevel, // Send the selected skill level
 });
 // Add chatbot response to chat
 setMessages((prevMessages) => [
 ...prevMessages,
 { sender: 'chatbot', text: response.data.response_text },
 ]);
 if (response.data.feedback_prompt) {
 setMessages((prevMessages) => [
 ...prevMessages,
 { sender: 'chatbot', text: response.data.feedback_prompt },
 ]);
 setWaitingForFeedback(true);
 }
 } catch (error) {
 setMessages((prevMessages) => [
 ...prevMessages,
 { sender: 'chatbot', text: 'Sorry, something went wrong!' },
 ]);
 } finally {
 setLoading(false);
 }
 };
 // Submit feedback from the user
 const handleFeedbackSubmit = async (e) => {
 e.preventDefault();
 // Handle feedback logic
 const feedbackResponse = userFeedback.toLowerCase() === 'yes' ?
 'Thank you for your feedback!' : 'I’ll improve later.';
 // Add feedback response to the chat
 setMessages((prevMessages) => [
 ...prevMessages,
 { sender: 'chatbot', text: feedbackResponse },
 ]);
 // Reset feedback state and continue the chat
 setWaitingForFeedback(false);
 setUserFeedback('');
 // After feedback, continue to the next user input
 setMessages((prevMessages) => [
 ...prevMessages,
 { sender: 'chatbot', text: 'How can I assist you further?' },
 ]);
 };
 return (
 <div className="chatbot-container">
 <h1 className="chatbot-title">Intelliquorum</h1>
 {/* Skill Level Selector */}
 <div className="skill-level-selector">
 <label htmlFor="skill-level">Select Skill Level</label>
 <select
 id="skill-level"
 value={skillLevel}
 onChange={handleSkillLevelChange} // Use setSkillLevel here
 >
 <option value="beginner">Beginner</option>
 <option value="intermediate">Intermediate</option>
 <option value="advanced">Advanced</option>
 </select>
 </div>
 {/* Chat messages */}
 <div className="chat-messages">
 {messages.map((message, index) => (
 <div key={index} className={`chat-bubble ${message.sender === 'chatbot' ? 'chatbot-bubble' : 'user￾bubble'}`}>
 {/* Symbol for chatbot or user */}
 <div className="symbol">
 {message.sender === 'chatbot' ? '🤖' : '👤'} {/* Emoji symbols */}
 </div>
 <div className="message-text">{message.text}</div>
 </div>
 ))}
 {loading && (
 <div className="chat-bubble chatbot-bubble typing-indicator">
 <div className="symbol">🤖</div> {/* Chatbot symbol for typing indicator */}
 <div className="typing-dot"></div>
 <div className="typing-dot"></div>
 <div className="typing-dot"></div>
 </div>
 )}
 </div>
 {/* Scroll to bottom of messages */}
 <div ref={messagesEndRef}></div>
 {/* User input form */}
 {!waitingForFeedback ? (
 <form onSubmit={handleSubmit} className="user-input-form">
 <input
 type="text"
 value={userMessage}
 onChange={handleUserMessageChange}
 placeholder="Ask me something..."
 required
 />
 <button type="submit" disabled={loading}>Send</button>
 </form>
 ) : (
 <form onSubmit={handleFeedbackSubmit} className="user-input-form">
 <input
 type="text"
 value={userFeedback}
 onChange={handleFeedbackChange}
 placeholder="Type Yes or No..."
 required
 />
 <button type="submit">Submit Feedback</button>
 </form>
 )}
 </div>
 );
};
export default ChatbotForm;