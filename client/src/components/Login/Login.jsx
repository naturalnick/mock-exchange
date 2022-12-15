import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useAuth } from "../../context/AuthProvider";
import "./Login.css";

export default function Login({ setIsRegistering }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { onLogin } = useAuth();

	function handleClick() {
		//validate form here
		onLogin(email, password);
	}
	return (
		<Card className="login-card">
			<Card.Body>
				<Card.Title>Log In</Card.Title>
				<Form className="max-width">
					<Form.Group className="mb-3" controlId="email-group">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							placeholder="eg. name@email.com"
							value={email || ""}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Password"
							value={password || ""}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</Form.Group>
					<div className="text-center mb-3">
						<Button variant="primary" onClick={handleClick}>
							Log In
						</Button>
					</div>
				</Form>
				<div className="type-text">
					Not a member?{" "}
					<span
						className="type-link"
						onClick={() => setIsRegistering(true)}
					>
						Sign Up
					</span>
				</div>
			</Card.Body>
		</Card>
	);
}
