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
	const disableTradeButton = () => {
		if (cashBalance < total && action === "buy") return true;
		if (quantity > shareHolding && action === "sell") return true;
		if (isSubmitting) return true;
		return false;
	};

	return (
		<Stack direction="horizontal" gap={3}>
			<Button className="ms-auto" variant="secondary" onClick={handleClose}>
				Cancel
			</Button>
			<Button
				variant="success"
				onClick={handleSubmit}
				disabled={disableTradeButton()}
			>
				Trade
			</Button>
		</Stack>
	);
}

export default TradeModalButtons;
