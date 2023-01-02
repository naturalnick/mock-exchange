import jwt_decode from "jwt-decode";
import History from "../../components/History/History";
import { useAccount } from "../../context/AccountProvider";
import { useAuth } from "../../context/AuthProvider";
import Card from "react-bootstrap/Card";

export default function Account() {
	const { accountNumber } = useAccount();
	const { token } = useAuth();
	const truncatedAccountNum = String(accountNumber).slice(-4);

	return (
		<div>
			<h3>Account</h3>
			<Card style={{ color: "black", marginBottom: "20px" }}>
				<Card.Header>Info</Card.Header>
				<Card.Body>
					<Card.Text>
						Account Number: ************{truncatedAccountNum}
					</Card.Text>
					<Card.Text>Email: {jwt_decode(token).email}</Card.Text>
				</Card.Body>
				{/* <Card.Header>Actions</Card.Header>
				<Card.Body>
					<Card.Link onClick={() => console.log("change password")}>
						Change Password
					</Card.Link>
					<Card.Link
						style={{ color: "red" }}
						onClick={() => console.log("delete")}
					>
						Delete Account
					</Card.Link>
				</Card.Body> */}
			</Card>
			<History />
		</div>
	);
}
