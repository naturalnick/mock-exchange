import { useEffect, useState, useCallback } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Chart } from "react-google-charts";
import { useAccount } from "../../context/AccountProvider";
import { useAuth } from "../../context/AuthProvider";
import { getDailyTotals } from "../../utils/API";
import "./Charts.css";

export default function Charts() {
	const { token } = useAuth();
	const { holdings, cashBalance } = useAccount();
	const [holdingsData, setHoldingsData] = useState([]);
	const [dailyData, setDailyData] = useState([]);

	const updateHoldingsData = useCallback(() => {
		let data = [["Holding", "Value"]];
		data.push(["Cash", cashBalance]);
		for (let i = 0; i < holdings.length; i++) {
			const marketValue = holdings[i].marketValue * holdings[i].quantity;
			data.push([holdings[i].symbol, marketValue]);
		}
		setHoldingsData(data);
	}, [cashBalance, holdings]);

	const updateDailyTotals = useCallback(async () => {
		const totals = await getDailyTotals(token);
		let data = [["Date", "Value"]];

		if (totals.length < 1) {
			let today = new Date().toJSON().slice(0, 10);
			data.push([today, Number(cashBalance)]);
		} else {
			for (let i = 0; i < totals.length; i++) {
				data.push([totals[i].date, Number(totals[i].value)]);
			}
		}

		setDailyData(data);
	}, [cashBalance, token]);

	useEffect(() => {
		updateHoldingsData();
	}, [updateHoldingsData]);

	useEffect(() => {
		updateDailyTotals();
	}, [updateDailyTotals]);

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
						data={dailyData}
						options={{ title: "Past Account Values" }}
					/>
				</Col>
			</Row>
		</div>
	);
}
