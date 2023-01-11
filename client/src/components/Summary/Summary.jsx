import { useCallback, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Placeholder from "react-bootstrap/Placeholder";
import { useAccount } from "../../context/AccountProvider";
import "./Summary.css";
import Charts from "../Charts/Charts";
import {
	formatDecoratedPrice,
	formatPercentage,
	formatPrice,
} from "../../utils/Utils";

export default function Summary() {
	const { cashBalance, holdings, isAccountLoading } = useAccount();

	const [marketValue, setMarketValue] = useState();
	const [baseCost, setBaseCost] = useState();

	const gainsLosses = Number(marketValue) - Number(baseCost);
	const gainLossPercent =
		gainsLosses !== 0 ? Number(marketValue) / Number(baseCost) / 100 : 0;
	const accountValue = Number(marketValue) + Number(cashBalance);

	const getTotalMarketValue = useCallback(() => {
		let newMarketValue = 0;
		for (let i = 0; i < holdings.length; i++) {
			newMarketValue =
				newMarketValue + holdings[i].marketValue * holdings[i].quantity;
		}
		return newMarketValue;
	}, [holdings]);

	const getTotalCost = useCallback(() => {
		let newBaseCost = 0;
		for (let i = 0; i < holdings.length; i++) {
			newBaseCost =
				newBaseCost + holdings[i].base_cost * holdings[i].quantity;
		}
		return newBaseCost;
	}, [holdings]);

	useEffect(() => {
		const newMarketValue = getTotalMarketValue();
		const newBaseCost = getTotalCost();

		setMarketValue(newMarketValue);
		setBaseCost(newBaseCost);
	}, [holdings, cashBalance, getTotalCost, getTotalMarketValue]);

	return (
		<>
			<h3>Account Summary</h3>
			<Charts />
			<Table responsive="sm">
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
							{isAccountLoading ? (
								<Placeholder xs={6} animation="glow" />
							) : (
								formatPrice(accountValue)
							)}
						</th>
						<td>
							{isAccountLoading ? (
								<Placeholder xs={6} animation="glow" />
							) : (
								formatPrice(cashBalance)
							)}
						</td>
						<td>
							{isAccountLoading ? (
								<Placeholder xs={6} animation="glow" />
							) : (
								formatPrice(marketValue)
							)}
						</td>
						<td>
							{isAccountLoading ? (
								<Placeholder xs={6} animation="glow" />
							) : (
								formatPrice(baseCost)
							)}
						</td>
						<td>
							{isAccountLoading ? (
								<Placeholder bg="dark" xs={6} animation="glow" />
							) : (
								<>
									{formatDecoratedPrice(gainsLosses)}{" "}
									{formatPercentage(
										gainsLosses < 0
											? -gainLossPercent
											: gainLossPercent
									)}
								</>
							)}
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
}
