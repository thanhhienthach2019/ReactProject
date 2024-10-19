import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Login.css';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { useNavigate } from 'react-router-dom';
import { Container, Content, Footer, Form, Button, Panel, InputGroup, Stack, VStack, Message, Divider, Loader } from 'rsuite';
import { FaRegEye, FaRegEyeSlash, FaGoogle } from 'react-icons/fa';
import { ToastUtils } from '../../utils/ToastUtils';

const Password = React.forwardRef((props, ref) => {
    const [visible, setVisible] = React.useState(false);

    const handleChange = () => {
        setVisible(!visible);
    };

    return (
        <InputGroup inside ref={ref} {...props}>
            <input
                type={visible ? 'text' : 'password'}
                className="rs-input"
                {...props}
            />
            <InputGroup.Button onClick={handleChange}>
                {visible ? <FaRegEye /> : <FaRegEyeSlash />}
            </InputGroup.Button>
        </InputGroup>
    );
});

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [message, setMessage] = useState({ content: '', type: '' });
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [expiryTime, setExpiryTime] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);    
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isFactorLogin, setisFactorLogin] = useState(false);

    // timer
    useEffect(() => {
        if (requiresTwoFactor && expiryTime > 0) {
            setRemainingTime(expiryTime * 60); // Convert min to sec
        }
    }, [requiresTwoFactor, expiryTime]);

    useEffect(() => {
        let interval;
        if (remainingTime > 0 && requiresTwoFactor) {
            interval = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);
        }

        if (remainingTime === 0 && requiresTwoFactor) {
            setMessage({ content: 'Hết thời gian xác thực. Vui lòng đăng nhập lại.', type: 'error' });
            setRequiresTwoFactor(false); // back to login
        }

        return () => clearInterval(interval);
    }, [remainingTime, requiresTwoFactor]);

    const getDeviceFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    };

    const handleLogin = useCallback(async () => {
        setIsLoading(true);
        try {
            const deviceFingerprint = await getDeviceFingerprint();
            const response = await axios.post('https://localhost:7241/api/User/login', {
                username,
                password,
            }, {
                headers: {
                    'device-fingerprint': deviceFingerprint,
                },
            });
            if (response.data.requiresTwoFactor) {
                setRequiresTwoFactor(true);
                setMessage({ content: response.data.Message, type: 'info' });
                setRemainingTime(1);
                setExpiryTime(response.data.expiryTime);
            } else {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('refreshToken', response.data.refreshToken);                
                ToastUtils.success('Đăng nhập thành công');                            
                setTimeout(() => {
                    navigate('/main');
                }, 1000);
                setIsLoggedIn(true);                
            }
        } catch (error) {
            const content = error.response?.data?.message || 'Đăng nhập thất bại!';            
            ToastUtils.error(content);
            return false; 
        } finally {
            setIsLoading(false); // Kết thúc chờ
        }
    }, [username, password, navigate]);

    const handleTwoFactorLogin = useCallback(async () => {
        setIsLoading(true);
        try {
            const deviceFingerprint = await getDeviceFingerprint();
            const response = await axios.post('https://localhost:7241/api/User/verify-2fa-login', {
                username,
                twoFactorCode,
            }, {
                headers: {
                    'device-fingerprint': deviceFingerprint,
                },
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('refreshToken', response.data.refreshToken);            
            ToastUtils.success('Xác thực thành công');
            setTimeout(() => {
                navigate('/main');
            }, 1000);             
            setisFactorLogin(true);
        } catch (error) {
            const content = error.response?.data || 'Xác thực mã thất bại!';            
            ToastUtils.error(content);
            return false;
        } finally {
            setIsLoading(false); // Kết thúc chờ            
        }
    }, [username, twoFactorCode, navigate]);

    // convert min to sec for display
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <Container>
            <Content>
                <Stack alignItems="center" justifyContent="center" style={{ height: '100vh' }}>
                    <Panel header="Đăng nhập" bordered style={{ width: 400 }}>
                        {message.content && (
                            <Message showIcon type={message.type}>
                                <strong>{message.type === 'success' ? 'Thành công!' : 'Lỗi!'}</strong> {message.content}
                            </Message>
                        )}
                        {!requiresTwoFactor ? (
                            <Form fluid onSubmit={handleLogin}>
                                <Form.Group>
                                    <Form.ControlLabel>Tên đăng nhập</Form.ControlLabel>
                                    <Form.Control name="username" value={username} onChange={(e) => setUsername(e)} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.ControlLabel>Mật khẩu</Form.ControlLabel>
                                    <Form.Control name="password" autoComplete="off" accepter={Password} value={password} onChange={(e) => setPassword(e.target.value)} required />
                                </Form.Group>
                                <VStack spacing={10}>
                                    {isLoading ? (
                                        <Loader center content="Đang xử lý..." />
                                    ) : (
                                        !isLoggedIn ? ( // Nếu chưa đăng nhập
                                            <Button appearance="primary" block type="submit">
                                                Đăng nhập
                                            </Button>
                                        ) : ( // Nếu đã đăng nhập
                                            <Loader center content="Đang xử lý..." />
                                        )
                                    )}
                                    <div className="login-links">
                                        <a href="/register">Tạo tài khoản</a>
                                        <a href="/forgot-password">Quên mật khẩu?</a>
                                    </div>
                                </VStack>
                            </Form>
                        ) : (
                            <Form fluid onSubmit={handleTwoFactorLogin}>
                                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                                    Mã xác thực đã được gửi đến email của bạn
                                </p>
                                <Form.Group>
                                    <Form.ControlLabel>Mã xác thực</Form.ControlLabel>
                                    <Form.Control name="twoFactorCode" value={twoFactorCode} onChange={(e) => setTwoFactorCode(e)} required />
                                </Form.Group>
                                <p style={{ textAlign: 'center', color: 'red' }}>
                                    Thời gian còn lại: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                                </p>
                                <VStack spacing={10}>
                                    {isLoading ? (
                                        <Loader center content="Đang xử lý..." />
                                    ) : (
                                        !isFactorLogin ? ( // Nếu chưa xác thực
                                            <Button appearance="primary" block type="submit">
                                                Xác thực
                                            </Button>
                                        ) : ( // Nếu đã xác thực 
                                            <Loader center content="Đang xử lý..." />
                                        )
                                    )}
                                </VStack>
                            </Form>
                        )}

                        <Divider>HOẶC</Divider>

                        <Button endIcon={<FaGoogle />} block href="#">
                            Tiếp tục với Google
                        </Button>
                    </Panel>
                </Stack>
            </Content>
            <Footer>
                <p style={{ textAlign: 'center' }}>Bản quyền © 2024</p>
            </Footer>
        </Container>
    );
};

export default Login;
