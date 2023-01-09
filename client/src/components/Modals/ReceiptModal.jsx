import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { formatPrice } from "../../utils/Utils";
import "./Modal.css";

export default function ReceiptModal({ handleClose, showModal, receipt }) {
	const receiptContents = () => {
		if ("error" in receipt) {
			return <div>{receipt.error}</div>;
		} else {
			const action = receipt.quantity > 0 ? "BUY" : "SELL";
			const total =
				Number(
					receipt.quantity < 0 ? -receipt.quantity : receipt.quantity
				) * Number(receipt.price);
			return (
				<div className="receipt-text">
					<div>Stock: {receipt.symbol}</div>
					<div>Action: {action}</div>
					<div>
						Shares:{" "}
						{receipt.quantity < 0 ? -receipt.quantity : receipt.quantity}{" "}
						x {formatPrice(receipt.price)}
					</div>
					<div>Total: {formatPrice(total)}</div>
				</div>
			);
		}
	};
	return (
		<Modal
			size="sm"
			show={showModal}
			onHide={handleClose}
			className="trade-modal"
		>
			<Modal.Header closeButton>
				<Modal.Title>Trade Confirmation</Modal.Title>
			</Modal.Header>
			<Modal.Body>{receiptContents()}</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
