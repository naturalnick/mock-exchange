import {
	formatDecoratedPrice,
	formatPercentage,
	formatPrice,
} from "../../utils/Utils";
import "./Holdings.css";

export default function HoldingRow({
	symbol,
	companyName,
	quantity,
	marketValue,
	base_cost,
}) {
	const marketValueTotal = (marketValue * quantity).toFixed(2);
	const baseCostTotal = (base_cost * quantity).toFixed(2);
	const gainLoss = Number(marketValueTotal) - Number(baseCostTotal);
	const gainLossPercent =
		gainLoss !== 0
			? Number(marketValueTotal) / Number(baseCostTotal) / 100
			: 0;
	return (
		<tr>
			<td>{symbol}</td>
			<td>{companyName}</td>
			<td>{quantity}</td>
			<td>{formatPrice(marketValueTotal)}</td>
			<td>{formatPrice(baseCostTotal)}</td>
			<td>
				{formatDecoratedPrice(gainLoss)} (
				{formatPercentage(
					gainLoss < 0 ? -gainLossPercent : gainLossPercent
				)}
				)
			</td>
		</tr>
	);
}
