import { formatDate } from "../../utils/Utils";
import "./History.css";

export default function HistoryRow({ id, date, symbol, quantity, price }) {
	const total = (Number(price) * Number(quantity)).toFixed(3).slice(0, -1);
	return (
		<tr>
			<td>{formatDate(date)}</td>
			<td>{symbol}</td>
			<td>{quantity < 0 ? "Sell" : "Buy"}</td>
			<td>{quantity < 0 ? -quantity : quantity}</td>
			<td>${price}</td>
			<td>${total}</td>
		</tr>
	);
}
