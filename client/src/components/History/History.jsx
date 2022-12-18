import { useState, useEffect } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { useAuth } from "../../context/AuthProvider";
import "./History.css";

export default function History() {
	const { token } = useAuth();
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		async function getAccountTransactions() {
			const response = await axios.get(
				`http://127.0.0.1:5001/api/account/transactions?token=${token}`
			);
			const accountTranscations = response.data.transactions;

			setTransactions(accountTranscations);
		}

		getAccountTransactions();
	}, []);

	function formatDate(date) {
		const newDate = new Date(date);

		return newDate.toLocaleString("en-US", {
			hour12: "true",
			dateStyle: "medium",
		});
	}

	const holdingElements =
		transactions.length > 0 ? (
			transactions.map((holding) => {
				const total = (Number(holding.price) * Number(holding.quantity))
					.toFixed(3)
					.slice(0, -1);
				return (
					<tr key={holding.id}>
						<td>{formatDate(holding.date)}</td>
						<td>{holding.symbol}</td>
						<td>{holding.quantity < 0 ? "Sell" : "Buy"}</td>
						<td>
							{holding.quantity < 0
								? -holding.quantity
								: holding.quantity}
						</td>
						<td>${holding.price}</td>
						<td>${total}</td>
					</tr>
				);
			})
		) : (
			<tr>
				<td style={{ textAlign: "center" }} colSpan={6}>
					All your transactions will be recorded here.
				</td>
			</tr>
		);

	return (
		<>
			<h3>History</h3>
			<Table striped hover>
				<thead>
					<tr>
						<th>Date</th>
						<th>Symbol</th>
						<th>Type</th>
						<th>Quantity</th>
						<th>Share Price</th>
						<th>Total Price</th>
					</tr>
				</thead>
				<tbody>{holdingElements}</tbody>
			</Table>
		</>
	);
}
