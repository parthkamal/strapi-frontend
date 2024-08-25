import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import './Chat.css';

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState('');
  const socketRef = useRef(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const socket = io(BACKEND_URL);
    socketRef.current = socket;

    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem('jwt');
        const response = await axios.get(`${BACKEND_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserName(response.data.username);

        socket.on('message', (msg) => {
          if (msg.user === response.data.username) {
            setMessages((prevMessages) => [...prevMessages, msg]);
          }
        });
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserName();

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current) {
      socketRef.current.emit('message', { user: userName, text: message });
      setMessage('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.reload();
  };

  return (
    <Container className="chat-container">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2>Chat</h2>
            <Button variant="secondary" onClick={handleLogout}>Logout</Button>
          </div>
          <div className="user-info">
            <strong>Welcome, {userName}!</strong>
          </div>
          <ListGroup className="message-list">
            {messages.map((msg, index) => (
              <ListGroup.Item key={index} className={'message'}>
                <strong>{msg.user}:</strong> {msg.text}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form className="message-form" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control style={{width: '75rem', padding: '10px'}}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className='message-input'
              />
            </Form.Group>
            <Button variant="primary"  className="send-button" type="submit">Send</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
