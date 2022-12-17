import { useState, useEffect } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import Select from "react-select";
import { useAccount } from "../../context/AccountProvider";
import { useAuth } from "../../context/AuthProvider";
import "./TradeModal.css";

export default function TradeModal({
	handleClose,
	showTradeModal,
	symbol,
	price,
}) {
	const { cashBalance, holdings, updateAccountInfo } = useAccount();
	const { token } = useAuth();

	const [action, setAction] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		//prevent rounding
		const newTotal = (Number(price) * Number(quantity))
			.toFixed(3)
			.slice(0, -1);
		setTotal(newTotal);
	}, [quantity, price]);

	const options = [
		{ value: "buy", label: "Buy" },
		{ value: "sell", label: "Sell" },
	];

	function getCurrentHoldings() {
		for (let i = 0; i < holdings.length; i++) {
			if (holdings[i].symbol === symbol) {
				return holdings[i].quantity;
			}
		}
		return 0;
	}

	async function handleSubmit() {
		const response = await axios.post("http://127.0.0.1:5001/api/trade", {
			token: token,
			symbol: symbol,
			quantity: action === "sell" ? Number(quantity) * -1 : quantity,
			cost_per_share: price,
		});
		if (response.status === 200) {
			handleClose();
			updateAccountInfo();
		} else {
			console.log("error");
		}
	}

	return (
		<Modal show={showTradeModal} onHide={handleClose} className="trade-modal">
			<Modal.Header closeButton>
				<Modal.Title>Trade: {symbol}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<span className="trade-price">${price}</span> / share
				<Stack direction="horizontal" gap={3} className="stack-form">
					<Form.Group className="mb-3" controlId="action">
						<Form.Label>Action</Form.Label>
						<Select
							options={options}
							onChange={(e) => setAction(e.value)}
							placeholder="Choose Action"
							required
						/>
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
				</Stack>
				Total: <span className="trade-price">${total}</span>
				<div className="trade-extra">
					<div>Available funds: ${cashBalance}</div>
					<div>Shares currently owned: {getCurrentHoldings()}</div>
				</div>
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
