import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import "./Director.css";

export default function Director() {
	const { token, onLogout } = useAuth();
	return (
		<div>
			<Navbar bg="dark" variant="dark" expand="md">
				<Container>
					<Navbar.Brand href="#home">Navbar</Navbar.Brand>
					<Navbar.Toggle aria-controls="director-nav" />
					<Navbar.Collapse
						id="director-nav"
						className="justify-content-end"
					>
						<Nav>
							<Link to="/" className="d-nav-item">
								Home
							</Link>
							<Link to="/dashboard" className="d-nav-item">
								Dashboard
							</Link>
							<Link to="/trading" className="d-nav-item">
								Trading
							</Link>
							{token ? (
								<Button onClick={onLogout} className="">
									Log Out
								</Button>
							) : (
								<Button onClick={onLogout} className="">
									Log In
								</Button>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Outlet />
		</div>
	);
}
