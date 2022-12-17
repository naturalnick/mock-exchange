import { useEffect } from "react";
import { useState } from "react";
import Table from "react-bootstrap/Table";
import { useAccount } from "../../context/AccountProvider";
import "./Summary.css";

export default function Summary() {
	const { cashBalance, holdings } = useAccount();
	const [accountValue, setAccountValue] = useState();
	const [marketValue, setMarketValue] = useState();
	const [baseCost, setBaseCost] = useState();
	const [gainsLosses, setGainsLosses] = useState();

	useEffect(() => {
		let newMarketValue = 0;
		let newBaseCost = 0;

		for (let i = 0; i < holdings.length; i++) {
			newMarketValue =
				newMarketValue + holdings[i].marketValue * holdings[i].quantity;

			newBaseCost =
				newBaseCost + holdings[i].base_cost * holdings[i].quantity;
		}

		setAccountValue(newMarketValue + cashBalance);
		setMarketValue(newMarketValue);
		setBaseCost(newBaseCost.toFixed(2));
		setGainsLosses((newBaseCost - newMarketValue).toFixed(2));
	}, [holdings, cashBalance]);

	return (
		<>
			<h3>Account Summary</h3>
			<Table>
				<thead>
					<tr>
						<th>Account Value</th>
						<th>Cash Balance</th>
						<th>Market Value</th>
						<th>Base Cost</th>
						<th>Gain/Loss</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>${accountValue}</th>
						<td>${cashBalance}</td>
						<td>${marketValue}</td>
						<td>${baseCost}</td>
						<td>
							{gainsLosses > 0 && "+"}
							{gainsLosses}
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
}
