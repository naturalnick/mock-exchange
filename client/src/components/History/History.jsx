import { useState, useEffect, useCallback } from "react";
import Table from "react-bootstrap/Table";
import { useAuth } from "../../context/AuthProvider";
import { getTransactions } from "../../utils/API";
import "./History.css";
import HistoryRow from "./HistoryRow";

export default function History() {
	const { token } = useAuth();
	const [transactions, setTransactions] = useState([]);

	const updateTransactions = useCallback(async () => {
		const updatedTransactions = await getTransactions(token);
		setTransactions(updatedTransactions);
	}, [token]);

	useEffect(() => {
		updateTransactions();
	}, [updateTransactions]);

	function displayTransactions() {
		return transactions.length > 0 ? (
			transactions.map((transaction) => {
				return <HistoryRow key={transaction.id} {...transaction} />;
			})
		) : (
			<tr>
				<td className="centered" colSpan={6}>
					All your transactions will be recorded here.
				</td>
			</tr>
		);
	}

	return (
		<>
			<h3>History</h3>
			<Table striped hover>
				<thead>
					<tr>
						<th>Date</th>
						<th>Symbol</th>
						<th>Action</th>
						<th>Quantity</th>
						<th>Share Price</th>
						<th>Total Price</th>
					</tr>
				</thead>
				<tbody>{displayTransactions()}</tbody>
			</Table>
		</>
	);
}
