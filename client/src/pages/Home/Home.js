import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useAuth } from "../../context/AuthProvider";

export default function Home() {
	const { onLogin } = useAuth();
	return (
		<Container>
			<Row>
				<Col md={6}>Hero</Col>
				<Col md={6}>Login</Col>
			</Row>
			<Button onClick={onLogin}>Login</Button>
		</Container>
	);
}
