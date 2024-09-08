"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import * as Api from "@/api";
import Form from "@/components/form/form";
import Input from "@/components/input/input";
import Button from "@/components/button/button";
import styles from "./page.module.css";


const AuthPage = () => {
	const [isSignIn, setIsSignIn] = useState<boolean>(true);

  	const [emailLogin, setEmailLogin] = useState<string>("");
  	const [passwordLogin, setPasswordLogin] = useState<string>("");

	const [emailLoginStatus, setEmailLoginStatus] = useState<"default" | "error">("default");
  	const [passwordLoginStatus, setPasswordLoginStatus] = useState<"default" | "error">("default");

	const [infoLogin, setInfoLogin] = useState<string>("No info");
	const [infoLoginStatus, setInfoLoginStatus] = useState<"error"  | "success" | "default">("default");
	const [buttonLoginIsDisabled, setButtonLoginIsDisabled] = useState<boolean>(false);

	const [nameRegister, setNameRegister] = useState<string>("");
  	const [emailRegister, setEmailRegister] = useState<string>("");
  	const [passwordRegister, setPasswordRegister] = useState<string>("");
  	const [retypedPasswordRegister, setRetypedPasswordRegister] = useState<string>("");

	const [nameRegisterStatus, setNameRegisterStatus] = useState<"default" | "error">("default");
  	const [emailRegisterStatus, setEmailRegisterStatus] = useState<"default" | "error">("default");
  	const [passwordRegisterStatus, setPasswordRegisterStatus] = useState<"default" | "error">("default");
  	const [retypedPasswordRegisterStatus, setRetypedPasswordRegisterStatus] = useState<"default" | "error">("default");
	
	const [infoRegister, setInfoRegister] = useState<string>("No info");
	const [infoRegisterStatus, setInfoRegisterStatus] = useState<"error"  | "success" | "default">("default");
	const [buttonRegisterIsDisabled, setButtonRegisterIsDisabled] = useState<boolean>(false);
	
	const { setIsAuthorized } = useAuth();

	const router = useRouter();

	useEffect(() => {
		const currentUrl: string = window.location.href;
		const url: URL = new URL(currentUrl);
		const isRegister: string | null = url.searchParams.get("isRegister");
		if (isRegister === "true") {
			setIsSignIn(false);
		}
  	}, []);

	const handleLogin = async () => {
		const result  = await Api.auth.login({
			email: emailLogin,
			password: passwordLogin,
		});

		if (200 <= result.status && result.status < 300 && result.token){
			localStorage.setItem("token", result.token);
			setIsAuthorized(true);

			displayLoginMessage("Successfully logged in", true);
			router.push("/");
		}
		else {
			handleLoginError(result.status);
		}
 	};

	const handleLoginError = (status: number) => {
		switch (status) {
			case 403:
				displayLoginMessage("Confirm your email", true);
				break;
			case 404:
				displayLoginMessage("Email or password is incorrect");
				break;
			case 500:
				displayLoginMessage("Server error. Try later");
				break;
			default:
				displayLoginMessage("An unknown error occurred");
		}
  	};

  	const handleRegister = async () => {
		const result  = await Api.auth.register({
			name: nameRegister,
			email: emailRegister,
			password: passwordRegister,
		});

		if (200 <= result.status && result.status < 300){
			displayRegisterMessage("Successfully registered. Check your email to confirm", true);
		}
		else {
			handleRegisterError(result.status);
		}
  	};

	const handleRegisterError = (status: number) => {
		switch (status) {
			case 409:
				displayRegisterMessage("This email already taken");
				break;
			case 500:
				displayRegisterMessage("Server error. Try later");
				break;
			default:
				displayRegisterMessage("An unknown error occurred");
		}
  	};

	const onChangeEmailLogin = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;

		if (input.length > 254) {
			setEmailLoginStatus("error");
			displayLoginMessage("Email is too long");
		} 
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
			setEmailLoginStatus("error");
			displayLoginMessage("Invalid email");
		}
		else {
			setEmailLoginStatus("default");
			hideLoginMessage();
		}

		setEmailLogin(input);
  	};

  	const onChangePasswordLogin = (e: ChangeEvent<HTMLInputElement>) => {
    	const input = e.target.value;

		if (input.length < 8) {
			setPasswordLoginStatus("error");
			displayLoginMessage("Password is too short");
		} 
		else if (input.length > 50) {
			setPasswordLoginStatus("error");
			displayLoginMessage("Password is too long");
		} 
		else{
			setPasswordLoginStatus("default");
			hideLoginMessage();
		}

    	setPasswordLogin(input);
  	};

	const onChangeNameRegister = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;

		if (input.length < 1) {
			setNameRegisterStatus("error");
			displayRegisterMessage("Name can't be empty");
		} 
		else if (input.length > 50) {
			setNameRegisterStatus("error");
			displayRegisterMessage("Name is too long");
		} 
		else {
			setNameRegisterStatus("default");
			hideRegisterMessage();
		}

		setNameRegister(input);
  	};

  	const onChangeEmailRegister = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;

		if (input.length > 254) {
			setEmailRegisterStatus("error");
			displayRegisterMessage("Email is too long");
		} 
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
			setEmailRegisterStatus("error");
			displayRegisterMessage("Invalid email");
		} 
		else {
			setEmailRegisterStatus("default");
			hideRegisterMessage();
		}

		setEmailRegister(input);
  	};

  	const onChangePasswordRegister = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;

		if (input.length < 8) {
			setPasswordRegisterStatus("error");
			displayRegisterMessage("Password is too short");
		} 
		else if (input.length > 50) {
			setPasswordRegisterStatus("error");
			displayRegisterMessage("Password is too long");
		} 
		else if (input !== retypedPasswordRegister && retypedPasswordRegister !== "") {
			setPasswordRegisterStatus("error");
			setRetypedPasswordRegisterStatus("error");
			displayRegisterMessage("Passwords don't match");
		} 
		else {
			setPasswordRegisterStatus("default");
			setRetypedPasswordRegisterStatus("default");
			hideRegisterMessage();
		}

		setPasswordRegister(input);
  	};

  	const onChangeRetypedPasswordRegister = (e: ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;

		if (input !== passwordRegister) {
			setPasswordRegisterStatus("error");
			setRetypedPasswordRegisterStatus("error");
			displayRegisterMessage("Passwords don't match");
		} 
		else {
			if (input.length > 7 && input.length < 51) setPasswordRegisterStatus("default");
			setRetypedPasswordRegisterStatus("default");
			hideRegisterMessage();
		}

		setRetypedPasswordRegister(input);
  	};

	useEffect(() => {
		if (
			emailLoginStatus === "error" ||
			passwordLoginStatus === "error" ||
			emailLogin === "" ||
			passwordLogin === "" 
		) {
			setButtonLoginIsDisabled(true);
		} 
		else {
			setButtonLoginIsDisabled(false);
		}
  	}, [emailLogin, passwordLogin]);
	
	useEffect(() => {
		if (
			nameRegisterStatus === "error" ||
			emailRegisterStatus === "error" ||
			passwordRegisterStatus === "error" ||
			retypedPasswordRegisterStatus === "error" ||
			nameRegister === "" ||
			emailRegister === "" ||
			passwordRegister === "" ||
			retypedPasswordRegister === ""
		) {
			setButtonRegisterIsDisabled(true);
		} 
		else {
			setButtonRegisterIsDisabled(false);
		}
  	}, [nameRegister, emailRegister, passwordRegister, retypedPasswordRegister]);

	const displayLoginMessage = (message: string = "", isSuccess: boolean = false) => {
		if (message !== "") setInfoLogin(message);
		if (isSuccess) setInfoLoginStatus("success");
		else setInfoLoginStatus("error");
	};

	const hideLoginMessage = () => {
		setInfoLogin("No info");
		setInfoLoginStatus("default");
	};

	const displayRegisterMessage = (message: string = "", isSuccess: boolean = false) => {
		if (message !== "") setInfoRegister(message);
		if (isSuccess) setInfoRegisterStatus("success");
		else setInfoRegisterStatus("error");
  	};

  	const hideRegisterMessage = () => {
    	setInfoRegister("No info");
    	setInfoRegisterStatus("default");
  	};

	const handleSignUpClick = () => {
	  setIsSignIn(false);
	};

	const handleSignInClick = () => {
	  setIsSignIn(true);
	};

  	return (
		<div className={styles.screen}>
			<article className={styles.container}>
				<div className={styles.block}>
					<section className={styles.block_item}>
						<h2 className={styles.block_item__title}>
							Already have an account?
						</h2>
						<Button
							label="Log In"
							onClick={handleSignInClick}
							disabled={false}
						/>
					</section>
					<section className={styles.block_item}>
						<h2 className={styles.block_item__title}>Don't have an account?</h2>
						<Button
							label="Create"
							onClick={handleSignUpClick}
							disabled={false}
						/>
					</section>
				</div>

				<div className={`${styles.form_box} ${isSignIn ? "" : styles.active}`}>
					<Form className={styles.form_signin} title="Log In" info={infoLogin} infoStatus={infoLoginStatus}>
						<Input 
							value={emailLogin} 
							onChange={onChangeEmailLogin}
							type="text"
							status={emailLoginStatus}
							placeholder="Email"
						/>
						<Input 
							value={passwordLogin} 
							onChange={onChangePasswordLogin}
							type="password"
							status={passwordLoginStatus}
							placeholder="Password"
						/>

						<Button
							label="Sign In"
							onClick={handleLogin}
							disabled={buttonLoginIsDisabled}
						/>
						<p>
							<a href="/auth/password/forgot" className={styles.form__forgot}>
								Forgot Password?
							</a>
						</p>
					</Form>

					<Form className={styles.form_signup} title="Create an account" info={infoRegister} infoStatus={infoRegisterStatus}>
						<Input 
							value={nameRegister} 
							onChange={onChangeNameRegister}
							type="text"
							status={nameRegisterStatus}
							placeholder="Name"
						/>
						<Input 
							value={emailRegister} 
							onChange={onChangeEmailRegister}
							type="text"
							status={emailRegisterStatus}
							placeholder="Email"
						/>
						<Input 
							value={passwordRegister} 
							onChange={onChangePasswordRegister}
							type="password"
							status={passwordRegisterStatus}
							placeholder="Password"
						/>
						<Input 
							value={retypedPasswordRegister} 
							onChange={onChangeRetypedPasswordRegister}
							type="password"
							status={retypedPasswordRegisterStatus}
							placeholder="Retype password"
						/>

						<Button
							label="Create"
							onClick={handleRegister}
							disabled={buttonRegisterIsDisabled}
						/>
					</Form>
				</div>
			</article>
		</div>
  	);
};

export default AuthPage;
