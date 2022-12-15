import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useAuth } from "../../context/AuthProvider";
import "./Register.css";

export default function Register({ setIsRegistering }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [matchingPassword, setMatchingPassword] = useState("");

	const { onRegister } = useAuth();

	function handleClick() {
		//validate form here
		onRegister(email, password);
	}

	return (
		<Card className="login-card">
			<Card.Body>
				<Card.Title>Register</Card.Title>
				<Form className="max-width">
					<Form.Group className="mb-3" controlId="email-group">
						<Form.Label>Email</Form.Label>
						<Form.Control
							type="email"
							placeholder="eg. name@email.com"
							value={email || ""}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Form.Text className="text-muted">
							For authentication only, we'll never share it with anyone
							else.
						</Form.Text>
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
					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control
							type="password"
							placeholder="Re-type Password"
							value={matchingPassword || ""}
							onChange={(e) => setMatchingPassword(e.target.value)}
						/>
					</Form.Group>
					<div className="text-center mb-3">
						<Button
							className="me-auto"
							variant="primary"
							onClick={handleClick}
						>
							Sign Up
						</Button>
					</div>
				</Form>
				<div className="type-text">
					Have an account?{" "}
					<span
						className="type-link"
						onClick={() => setIsRegistering(false)}
					>
						Sign In
					</span>
				</div>
			</Card.Body>
		</Card>
	);
}
