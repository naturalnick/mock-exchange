import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useAuth } from "../../context/AuthProvider";
import "./Login.css";

export default function Login({ setIsRegistering }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [validated, setValidated] = useState(false);

	const { handleLogin, authError, setAuthError } = useAuth();

	function handleSubmit(event) {
		event.preventDefault();
		event.stopPropagation();

		setValidated(true);

		const form = event.currentTarget;
		if (form.checkValidity() === true) {
			handleLogin(email, password);
		}
	}

	function handleKeyDown(e) {
		if (e.key === "Enter") handleSubmit(e);
	}

	return (
		<Card className="login-card">
			<Card.Body>
				<Card.Title>Log In</Card.Title>
				<div className="error">{authError}</div>
				<Form noValidate validated={validated} onSubmit={handleSubmit}>
					<Form.Group className="mb-3" controlId="email-group">
						<Form.Label>Email</Form.Label>
						<Form.Control
							required
							type="text"
							placeholder="eg. name@email.com"
							value={email || ""}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Form.Control.Feedback type="invalid">
							Please provide an email address.
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							required
							type="password"
							placeholder="Password"
							value={password || ""}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={handleKeyDown}
						/>
						<Form.Control.Feedback type="invalid">
							Password is required.
						</Form.Control.Feedback>
					</Form.Group>
					<div className="text-center mb-3">
						<Button variant="primary" type="submit">
							Log In
						</Button>
					</div>
				</Form>
				<div className="type-text">
					Not a member?{" "}
					<span
						className="type-link"
						onClick={() => {
							setAuthError("");
							setIsRegistering(true);
						}}
					>
						Sign Up
					</span>
				</div>
			</Card.Body>
		</Card>
	);
}
