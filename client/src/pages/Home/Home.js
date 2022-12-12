import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Login from "../../components/Login/Login";
import Hero from "../../components/Hero/Hero";

export default function Home() {
	return (
		<Row>
			<Col md={8}>
				<Hero />
			</Col>
			<Col md={4}>
				<Login />
			</Col>
		</Row>
	);
}
