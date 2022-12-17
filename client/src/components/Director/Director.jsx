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
					<Navbar.Brand href="#home">Mock Invest</Navbar.Brand>
					<Navbar.Toggle aria-controls="director-nav" />
					<Navbar.Collapse
						id="director-nav"
						className="justify-content-end"
					>
						<Nav>
							{token ? (
								<>
									<Link to="/dashboard" className="d-nav-item">
										Dashboard
									</Link>
									<Link to="/trading" className="d-nav-item">
										Trade
									</Link>
									<Link to="/account" className="d-nav-item">
										Account
									</Link>
									<Link
										onClick={onLogout}
										className="d-nav-item logout"
									>
										Log Out
									</Link>
								</>
							) : (
								<Link to="/" className="d-nav-item">
									Welcome
								</Link>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
			<Container className="page">
				<Outlet />
			</Container>
		</div>
	);
}
