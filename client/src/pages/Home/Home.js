import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";
import Hero from "../../components/Hero/Hero";

export default function Home() {
	const [isRegistering, setIsRegistering] = useState(false);
	return (
		<Row>
			<Col md={7}>
				<Hero />
			</Col>
			<Col md={5}>
				{isRegistering ? (
					<Register setIsRegistering={setIsRegistering} />
				) : (
					<Login setIsRegistering={setIsRegistering} />
				)}
			</Col>
		</Row>
	);
}
