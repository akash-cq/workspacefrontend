import React, { useCallback, useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { AppState, useAppStore } from '../../../stores';
import { AuthModal } from '../../../components/authModal';
import styles from './TwofactorAuth.module.css';

const appStoreSelector = (state: AppState) => ({
  twofactor: state.twofactorsubmit,
  is2fa: state.is2fa,
  resend: state.resend,
});
const TwoFactorAuth: React.FunctionComponent = () => {
  const { twofactor, resend } = useAppStore(appStoreSelector);
  const [otp, setOtp] = useState('');
  const [isResend, setResend] = useState(false);
  const [optRe, setOtpre] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };
  const changeOtp = useCallback(() => {
      const timer = setTimeout(() => {
        setResend(true);
      }, 60000);
      return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (localStorage.getItem('is')) {
      setOtpre(true);
      setResend(true);
    } else {
      changeOtp();
    }
  }, [changeOtp]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (otp.length !== 4) {
        throw new Error('OTP must be a 4-digit number');
      } else {
        await twofactor({ otp });
        localStorage.clear();
      }
      } catch (err: any) {
        if (err.message !== '2FA_Required') {
      message.error(err?.message ?? err);
    }
    }
  };
  const requestOtp = async () => {
    if (optRe) {
        message.error('you have alreasy make a request for otp');
      } else {
       try {
          const response = await resend();
          if (response) {
            message.success('otp Re-send successfuly');
            setOtpre(true);
            localStorage.setItem('is', JSON.stringify('true'));
          } else {
            throw new Error('something is Wrong');
          }
        } catch (err: any) {
          message.error(err?.message);
          setOtpre(false);
       }
      }
  };
  return (
    <AuthModal title="Two-Factor Authentication">
      <>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleChange}
            maxLength={4}
            className={styles.input}
            placeholder="Enter 4-digit OTP"
          />
          <Button type="primary" className={styles.button}>
            {' '}
            Submit
          </Button>
        </form>
        {isResend && (
          <p className={styles.recontainer}>
            Don&apos;t received the otp?&nbsp;&nbsp;
            <Button
              type="primary"
              onClick={requestOtp}
              className={`${styles.otpresend} ${
                optRe ? styles.notallowed : ''
              }`}
            >
              Re-Send
            </Button>
          </p>
        )}
      </>
    </AuthModal>
  );
};

export default TwoFactorAuth;
