import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";
import Hero from "../../components/Hero/Hero";

export default function Home() {
	const [isRegistering, setIsRegistering] = useState(false);
	return (
		<>
			<Row>
				<Col md={7}>
					<Hero />
				</Col>
				<Col className="my-auto" md={5}>
					{isRegistering ? (
						<Register setIsRegistering={setIsRegistering} />
					) : (
						<Login setIsRegistering={setIsRegistering} />
					)}
				</Col>
			</Row>
			<Row style={{ backgroundColor: "#212529", padding: "20px" }}>
				<Col sm={9}>
					<h4 style={{ marginRight: "20%" }}>
						Start with $100,000 (not real money) in your account when you
						sign up.
					</h4>
					<br />
					<h4 style={{ textAlign: "right", marginLeft: "20%" }}>
						Use the fantasy money to invest in real stocks. Watch as your
						investments go up and down.
					</h4>
					<br />
					<h4 style={{ marginRight: "20%" }}>
						Prepare yourself for your future investing.
					</h4>
				</Col>
				<Col sm={3} style={{ textAlign: "center" }}>
					<img
						src={require("../../images/money.png")}
						alt="hero"
						width={"100%"}
					/>
				</Col>
			</Row>
			<Row
				style={{
					padding: "20px",
					marginTop: "20px",
					color: "#D1DBB6",
				}}
			>
				<Col>
					MockExchange was created by Nick Schaefer. See{" "}
					<a href="https://github.com/naturalnick/mock-invest">
						source code on GitHub.
					</a>
				</Col>
			</Row>
		</>
	);
}
