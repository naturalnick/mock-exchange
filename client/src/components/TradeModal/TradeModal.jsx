import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Select from "react-select";
import "./TradeModal.css";
import { useState } from "react";
import { useEffect } from "react";

export default function TradeModal({
	handleClose,
	showTradeModal,
	symbol,
	askPrice,
}) {
	const [action, setAction] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		setTotal(Number(askPrice) * Number(quantity));
	}, [quantity, askPrice]);

	const options = [
		{ value: "buy", label: "Buy" },
		{ value: "sell", label: "Sell" },
	];

	function handleSubmit() {
		//process data
		handleClose();
	}

	return (
		<Modal show={showTradeModal} onHide={handleClose} className="trade-modal">
			<Modal.Header closeButton>
				<Modal.Title>Trade: {symbol}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div>Available funds: $100</div>
				<div>Shares of {symbol} owned: 2</div>
				<span className="trade-price">${askPrice}</span> / share
				<Form.Group className="mb-3" controlId="action">
					<Form.Label>Action</Form.Label>
					<Select options={options} onChange={(e) => setAction(e.value)} />
				</Form.Group>
				<Form.Group className="mb-3" controlId="quantity">
					<Form.Label>Quantity</Form.Label>
					<Form.Control
						required
						type="number"
						placeholder="Number of shares"
						value={quantity || ""}
						onChange={(e) => setQuantity(e.target.value)}
					/>
				</Form.Group>
				Total: <span className="trade-price">${total}</span>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleClose}>
					Cancel
				</Button>
				<Button variant="success" onClick={handleSubmit}>
					Trade
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
