import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthProvider";
import Summary from "../../components/Summary/Summary";
import Holdings from "../../components/Holdings/Holdings";
import { useAccount } from "../../context/AccountProvider";

export default function Dashboard() {
	const { token } = useAuth();
	const { accountNumber, cashBalance, holdings } = useAccount();
	const [transactions, setTransactions] = useState([]);

	useEffect(() => {
		async function getAccountTransactions() {
			const response = await axios.get(
				`http://127.0.0.1:5001/api/account/transactions?token=${token}`
			);
			const accountTranscations = response.data;
			console.log(accountTranscations);
			setTransactions(accountTranscations);
		}

		getAccountTransactions();
	}, []);

	return (
		<div>
			<h2>Dashboard</h2>
			<Summary accountNumber={accountNumber} cashBalance={cashBalance} />
			<h3>Holdings</h3>
			<Holdings holdings={holdings} />
			{/* <History transactions={transactions} /> */}
		</div>
	);
}
