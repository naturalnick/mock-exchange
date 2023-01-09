import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";

function TradeModalButtons({
	handleClose,
	cashBalance,
	total,
	quantity,
	action,
	shareHolding,
	isSubmitting,
	handleSubmit,
}) {
	return (
		<Stack direction="horizontal" gap={3}>
			<Button className="ms-auto" variant="secondary" onClick={handleClose}>
				Cancel
			</Button>
			<Button
				variant="success"
				onClick={handleSubmit}
				disabled={
					(cashBalance < total && action === "buy") ||
					(quantity > shareHolding && action === "sell") ||
					isSubmitting
				}
			>
				Trade
			</Button>
		</Stack>
	);
}

export default TradeModalButtons;
