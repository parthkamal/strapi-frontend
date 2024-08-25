import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import './Login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BACKEND_URL}/api/auth/local`, {
                identifier: email,
                password,
            });
            localStorage.setItem('jwt', response.data.jwt);
            alert('Login successful');
            navigate('/chat');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className={'main-container'}>
            <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3" controlId="formBasicEmail">
                    <FormLabel>Email address</FormLabel>
                    <FormControl type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </FormGroup>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <FormLabel>Password</FormLabel>
                    <FormControl type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Login
                </Button>
                {error && <p>{error}</p>}
                <p className='mt-3'>
                    <span>Don't have an account ? </span>
                    <a className="link-opacity-50-hover" onClick={() => navigate('/signup')}>Create one</a>
                </p>
            </Form>
        </div>

    );
};

export default Login;

