import React, { useState } from 'react';
import { message } from 'antd';
import { AppState, useAppStore } from '../../../stores';
import { AuthModal } from '../../../components/authModal';
import styles from './TwofactorAuth.module.css';

const appStoreSelector = (state: AppState) => ({
  twofactor: state.twofactorsubmit,
  is2fa: state.is2fa,
});
const TwoFactorAuth: React.FunctionComponent = () => {
  const { twofactor } = useAppStore(appStoreSelector);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (otp.length !== 4) {
        throw new Error('OTP must be a 4-digit number');
      } else {
        await twofactor({ otp });
      }
    } catch (err: any) {
        if (err.message !== '2FA_Required') {
      message.error(err?.message ?? err);
    }
    }
  };

  return (
    <AuthModal title="Two-Factor Authentication">
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={handleChange}
          maxLength={6}
          className={styles.input}
          placeholder="Enter 6-digit OTP"
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>
          Submit
        </button>
      </form>
    </AuthModal>
  );
};

export default TwoFactorAuth;
