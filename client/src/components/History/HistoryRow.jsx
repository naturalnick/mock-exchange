import { formatDate, formatPrice } from "../../utils/utils";
import "./History.css";

export default function HistoryRow({ date, symbol, quantity, price }) {
	const total = Number(price) * Number(quantity);

	return (
		<tr>
			<td>{formatDate(date)}</td>
			<td>{symbol}</td>
			<td>{quantity < 0 ? "Sell" : "Buy"}</td>
			<td>{quantity < 0 ? -quantity : quantity}</td>
			<td>{formatPrice(price)}</td>
			<td>{formatPrice(total)}</td>
		</tr>
	);
}
