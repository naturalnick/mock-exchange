import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, Link } from "react-router-dom";

export default function Director() {
	return (
		<div>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="#home">Navbar</Navbar.Brand>
					<Nav className="me-auto">
						<Nav.Link>
							<Link to="/">Home</Link>
						</Nav.Link>
						<Nav.Link>
							<Link to="/dashboard">Dashboard</Link>
						</Nav.Link>
						<Nav.Link>
							<Link to="/trading">Trading</Link>
						</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
			<Outlet />
		</div>
	);
}
