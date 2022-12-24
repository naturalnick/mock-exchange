import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import "./Director.css";

export default function Director() {
	const { token, handleLogout } = useAuth();
	const currentPage = useLocation();

	return (
		<div>
			<Navbar bg="dark" variant="dark" expand="md">
				<Container>
					<Navbar.Brand className="logo">MockExchange</Navbar.Brand>
					<Navbar.Toggle aria-controls="director-nav" />
					<Navbar.Collapse
						id="director-nav"
						className="justify-content-end"
					>
						<Nav>
							{token ? (
								<>
									<Link
										to="/dashboard"
										className={`d-nav-item ${
											currentPage.pathname === "/dashboard" &&
											"current-page"
										}`}
									>
										Dashboard
									</Link>
									<Link
										to="/trading"
										className={`d-nav-item ${
											currentPage.pathname === "/trading" &&
											"current-page"
										}`}
									>
										Trade
									</Link>
									<Link
										to="/account"
										className={`d-nav-item ${
											currentPage.pathname === "/account" &&
											"current-page"
										}`}
									>
										Account
									</Link>
									<Link
										onClick={handleLogout}
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
