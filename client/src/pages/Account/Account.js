import jwt_decode from "jwt-decode";
import History from "../../components/History/History";
import { useAccount } from "../../context/AccountProvider";
import { useAuth } from "../../context/AuthProvider";
import Card from "react-bootstrap/Card";

export default function Account() {
	const { accountNumber } = useAccount();
	const { token } = useAuth();
	return (
		<div>
			<h3>Account</h3>
			<Card style={{ color: "black", marginBottom: "20px" }}>
				<Card.Body>
					<Card.Text>Account Number: {accountNumber}</Card.Text>
					<Card.Text>Email: {jwt_decode(token).email}</Card.Text>
				</Card.Body>
			</Card>
			<History />
		</div>
	);
}
