import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { getTransactions } from "../../utils/API";
import HistoryRow from "./HistoryRow";
import "./History.css";

export default function History() {
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		updateTransactions();

		async function updateTransactions() {
			const updatedTransactions = await getTransactions();
			setTransactions(updatedTransactions);
		}
	}, []);

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
