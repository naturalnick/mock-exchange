import { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Placeholder from "react-bootstrap/Placeholder";
import { useAccount } from "../../context/AccountProvider";
import "./Summary.css";
import Charts from "../Charts/Charts";

export default function Summary() {
	const { cashBalance, holdings, isAccountLoading } = useAccount();

	const [accountValue, setAccountValue] = useState();
	const [marketValue, setMarketValue] = useState();
	const [baseCost, setBaseCost] = useState();
	const [gainsLosses, setGainsLosses] = useState();

	const getMarketValue = useCallback(() => {
		let newMarketValue = 0;
		for (let i = 0; i < holdings.length; i++) {
			newMarketValue =
				newMarketValue + holdings[i].marketValue * holdings[i].quantity;
		}
		return newMarketValue;
	}, [holdings]);

	const getBaseCost = useCallback(() => {
		let newBaseCost = 0;
		for (let i = 0; i < holdings.length; i++) {
			newBaseCost =
				newBaseCost + holdings[i].base_cost * holdings[i].quantity;
		}
		return newBaseCost;
	}, [holdings]);

	useEffect(() => {
		let newMarketValue = getMarketValue();
		let newBaseCost = getBaseCost();

		newMarketValue = Number(newMarketValue.toFixed(2));
		newBaseCost = Number(newBaseCost.toFixed(2));
		const newGainsLosses = (newBaseCost - newMarketValue).toFixed(2); //string
		const newAccountValue = (newMarketValue + cashBalance).toFixed(2); //string

		setAccountValue(newAccountValue);
		setMarketValue(newMarketValue);
		setBaseCost(newBaseCost);
		setGainsLosses(newGainsLosses);
	}, [holdings, cashBalance, getBaseCost, getMarketValue]);

	return (
		<>
			<h3>Account Summary</h3>
			<Charts />
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
						<th>
							${isAccountLoading ? <Placeholder xs={4} /> : accountValue}
						</th>
						<td>
							$
							{isAccountLoading ? (
								<Placeholder xs={4} />
							) : (
								Number(cashBalance.toFixed(2))
							)}
						</td>
						<td>
							${isAccountLoading ? <Placeholder xs={4} /> : marketValue}
						</td>
						<td>
							${isAccountLoading ? <Placeholder xs={4} /> : baseCost}
						</td>
						<td
							style={
								gainsLosses < 0 ? { color: "red" } : { color: "green" }
							}
						>
							{gainsLosses > 0 && "+"}
							{isAccountLoading ? <Placeholder xs={4} /> : gainsLosses}
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
}
