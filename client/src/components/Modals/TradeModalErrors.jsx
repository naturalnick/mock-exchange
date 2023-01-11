import Alert from "react-bootstrap/Alert";
import { formatPrice } from "../../utils/Utils";

export default function TradeModalErrors({
	quantity,
	action,
	cashBalance,
	total,
	shareHolding,
	errors,
}) {
	function displayBalanceError(selectedAction) {
		if (cashBalance < total && selectedAction === "buy")
			return <Alert variant="danger">You do not have enough funds.</Alert>;
	}

	function displaySharesError(selectedAction, selectedQuantity) {
		if (selectedQuantity > shareHolding && selectedAction === "sell")
			return (
				<Alert variant="danger">
					You do not have that many shares to sell.
				</Alert>
			);
	}
	return (
		<>
			<div className="feedback">
				{errors.quantity}
				{errors.quantity && errors.quantity && <br />}
				{errors.action}
			</div>
			{displayBalanceError(action)}
			{displaySharesError(action, quantity)}
			<div className="trade-extra">
				<div>Available funds: {formatPrice(cashBalance)}</div>
				<div>Shares currently owned: {shareHolding}</div>
			</div>
		</>
	);
}
