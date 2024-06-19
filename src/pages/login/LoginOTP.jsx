import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import firebase from './firebase'; // Ensure this is your firebase initialization file

const FromInput = styled(Box)(() => ({
    display: "flex",
    gap: "12px"
}));
const FromOTP = styled(Box)(() => ({
    display: "flex",
    gap: "24px",
    flexDirection: "column",
    margin: "100px"
}));

const LoginOTP = () => {
    const [phoneNumber, setPhoneNumber] = useState('+84'); // Set default phone number with +84
    const [otp, setOtp] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const setupRecaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            'recaptcha-container',
            {
                size: "invisible",
                defaultCountry: "VN",
            }
        );

        window.recaptchaVerifier.render().then((widgetId) => {
            window.recaptchaWidgetId = widgetId;
        }).catch(error => {
            console.error("Error rendering reCAPTCHA", error);
        });
    };

    const handleSendOTP = async () => {
        const appVerifier = window.recaptchaVerifier;
        try {
            const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
            window.confirmationResult = confirmationResult;
            alert('OTP sent successfully!');
        } catch (error) {
            console.error("Error during signInWithPhoneNumber", error);
            alert(`Failed to send OTP: ${error.message}`);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            await window.confirmationResult.confirm(otp);
            alert("Verification successful");
            navigate('/'); // Redirect to home page upon successful verification
        } catch (error) {
            console.error("Error during confirmationResult.confirm", error);
            alert(`Verification failed: ${error.message}`);
        }
    };

    useEffect(() => {
        setupRecaptcha();
    }, []);

    return (
        <FromOTP>
            <FromInput>
                <TextField
                    variant='outlined'
                    label='Phone Number'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button variant='contained' onClick={handleSendOTP}>Send OTP</Button>
            </FromInput>
            <FromInput>
                <TextField
                    variant='outlined'
                    label='OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <Button variant='contained' onClick={handleVerifyOTP}>Verify OTP</Button>
            </FromInput>
            {/* Hidden recaptcha container */}
            <div id="recaptcha-container" style={{ display: 'none' }}></div>
        </FromOTP>
    );
};

export default LoginOTP;
