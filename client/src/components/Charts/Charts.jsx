import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Chart } from "react-google-charts";
import { useAccount } from "../../context/AccountProvider";
import "./Charts.css";

export default function Charts() {
	const { holdings, cashBalance, dailyTotals } = useAccount();
	const [holdingsData, setHoldingsData] = useState();

	useEffect(() => {
		let data = [["Holding", "Value"]];
		data.push(["Cash", cashBalance]);
		for (let i = 0; i < holdings.length; i++) {
			const marketValue = holdings[i].marketValue * holdings[i].quantity;
			data.push([holdings[i].symbol, marketValue]);
		}
		setHoldingsData(data);
	}, [holdings, cashBalance]);

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
						data={dailyTotals}
						options={{ title: "Account Change" }}
					/>
				</Col>
			</Row>
		</div>
	);
}
