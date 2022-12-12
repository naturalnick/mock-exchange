import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useAuth } from "../../context/AuthProvider";
import "./Login.css";

export default function Login() {
	const { onLogin } = useAuth();
	return (
		<Card className="login-card">
			<Card.Body>
				<Card.Title>Log In</Card.Title>
				<Form className="max-width">
					<Form.Group className="mb-3" controlId="email-group">
						<Form.Label>Email address</Form.Label>
						<Form.Control type="email" placeholder="eg. name@email.com" />
						<Form.Text className="text-muted">
							For authentication only, we'll never share it with anyone
							else.
						</Form.Text>
					</Form.Group>

					<Form.Group className="mb-3" controlId="formBasicPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Password" />
					</Form.Group>
					<Button variant="primary" onClick={onLogin}>
						Log In
					</Button>
				</Form>
			</Card.Body>
		</Card>
	);
}
