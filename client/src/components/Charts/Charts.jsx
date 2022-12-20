import { useEffect, useState } from "react";
import axios from "axios";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Chart } from "react-google-charts";
import { useAccount } from "../../context/AccountProvider";
import { useAuth } from "../../context/AuthProvider";
import "./Charts.css";

export default function Charts() {
	const { token } = useAuth();
	const { holdings, cashBalance } = useAccount();
	const [holdingsData, setHoldingsData] = useState();
	const [pastValues, setPastValues] = useState();

	useEffect(() => {
		let data = [["Holding", "Value"]];
		data.push(["Cash", cashBalance]);
		for (let i = 0; i < holdings.length; i++) {
			const marketValue = holdings[i].marketValue * holdings[i].quantity;
			data.push([holdings[i].symbol, marketValue]);
		}
		setHoldingsData(data);
	}, [holdings, cashBalance]);

	useEffect(() => {
		const getAccountValues = async () => {
			const response = await axios.get(
				`http://127.0.0.1:5001/api/account/values?token=${token}`
			);
			const accountValues = await response.data.values;
			let data = [["Date", "Value"]];

			if (accountValues.length < 1) {
				let today = new Date().toJSON().slice(0, 10);
				data.push([today, Number(cashBalance)]);
			} else {
				for (let i = 0; i < accountValues.length; i++) {
					data.push([
						accountValues[i].date,
						Number(accountValues[i].value),
					]);
				}
			}
			setPastValues(data);
		};
		getAccountValues();
	}, [token, cashBalance]);

	return (
		<div className="account-charts">
			<Row className="g-0">
				<Col md={4}>
					<Chart
						chartType="PieChart"
						data={holdingsData}
						options={{ title: "Holdings" }}
						width={"100%"}
						height={"100%"}
					/>
				</Col>
				<Col md={8}>
					<Chart
						chartType="LineChart"
						width="100%"
						height="300px"
						data={pastValues}
						options={{ title: "Account Change" }}
					/>
				</Col>
			</Row>
		</div>
	);
}
