import {
	Button, Form, Input, message, Image, Checkbox,
} from 'antd';
import React, { useCallback, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import style from './login.module.css';
import { AppState, useAppStore } from '../../../stores';
import { AuthModal } from '../../../components/authModal';

const appStoreSelector = (state: AppState) => ({
	loginRequest: state.login,
	faRequest: state.twofactorAuth,
});

export const Login:React.FunctionComponent = () => {
	const { loginRequest, faRequest } = useAppStore(appStoreSelector);
	const [loading, setLoading] = useState<boolean>(false);
	const history = useHistory();
	const handleLoginFormSubmit = useCallback(async (value: any) => {
		setLoading(true);
		try {
			console.log(value);
			await loginRequest(value);
		} catch (error:any) {
			if (error?.message === '2FA_REQUIRED') {
				message.success('2FA Required. OTP is sent to your email');
				setLoading(false);
				faRequest(true);
				history.replace('/login/2fa');
				return;
			}
			message.error(error?.message ?? error);
			setLoading(false);
		}
	}, [loginRequest, faRequest, history]);

	return (
		<AuthModal title="Login Into Your Account">
			<>
				<Form
					layout="vertical"
					onFinish={handleLoginFormSubmit}
					className={style.formOnly}
				>
					<Form.Item
						label="Email"
						name="email"
						requiredMark="optional"
						rules={[{
							required: true, whitespace: true, message: 'Please enter email!',
						}, {
							type: 'email', message: 'Please enter valid email',
						}]}
						normalize={(value, prevVal, prevVals) => value.trim().toLowerCase()}
					>
						<Input
							placeholder="Enter you email"
						/>
					</Form.Item>

					<div className={style.passwordContainer}>
						<Form.Item
							label="Password"
							name="password"
							requiredMark="optional"
							rules={[{
								required: true, whitespace: true, message: 'Please enter password!',
							},
							]}
						>
							{
							}
							<Input.Password
								placeholder="Enter your password"
							/>
						</Form.Item>
						<div className={style.remeberMeContainer}>
							<Form.Item
								name="rememberMe"
								labelAlign="right"
								valuePropName="checked"
							>
								<Checkbox>Remember me</Checkbox>
							</Form.Item>
							<Link className={style.forgotPasswordLink} to="/forgot">Forgot Password</Link>
						</div>
					</div>
					<Form.Item>
						<div className={style.actionButton}>
							<Button
								type="primary"
								size="large"
								htmlType="submit"
								loading={loading}
								className={style.loginButton}
							>
								Login
							</Button>
							<p style={{ marginBottom: '0px' }}>
								Don&apos;t have an account?&nbsp;&nbsp;
								<Link to="/signup">SignUp</Link>
							</p>
						</div>
					</Form.Item>
				</Form>
			</>
		</AuthModal>
	);
};
