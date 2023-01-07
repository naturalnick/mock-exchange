import { useState, useEffect } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import InputGroup from "react-bootstrap/InputGroup";
import Alert from "react-bootstrap/Alert";
import Select from "react-select";
import { useAccount } from "../../context/AccountProvider";
import { useAuth } from "../../context/AuthProvider";
import "./TradeModal.css";

const schema = yup.object().shape({
	action: yup.string().required("Action is required."),
	quantity: yup
		.number()
		.positive("Quantity cannot be negative.")
		.integer("Quantity must be a whole number.")
		.required("Quantity is required."),
});

export default function TradeModal({
	handleClose,
	showTradeModal,
	symbol,
	price,
}) {
	const { cashBalance, holdings, updateAccountInfo, updateAccountHoldings } =
		useAccount();
	const { token } = useAuth();
	const [total, setTotal] = useState(0);
	const [shareHolding, setShareHolding] = useState();

	useEffect(() => {
		let shareQuantity = 0;
		for (let i = 0; i < holdings.length; i++) {
			if (holdings[i].symbol === symbol) {
				shareQuantity = holdings[i].quantity;
			}
		}
		setShareHolding(shareQuantity);
	}, [holdings, symbol]);

	const options = [
		{ value: "buy", label: "Buy" },
		{ value: "sell", label: "Sell" },
	];

	function getNewTotal(quantity) {
		return (Number(price) * Number(quantity)).toFixed(3).slice(0, -1);
	}

	async function handleTransaction(formData) {
		if (cashBalance > total) {
			const response = await axios.post("http://127.0.0.1:5001/api/trade", {
				token: token,
				symbol: symbol,
				quantity:
					formData.action === "sell"
						? Number(formData.quantity) * -1
						: formData.quantity,
				cost_per_share: price,
			});
			if (response.status === 200) {
				handleClose();
				updateAccountInfo();
				updateAccountHoldings();
			} else {
				console.log("error");
			}
		}
	}

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
		<Modal show={showTradeModal} onHide={handleClose} className="trade-modal">
			<Modal.Header closeButton>
				<Modal.Title>Trade: {symbol}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Formik
					validationSchema={schema}
					onSubmit={handleTransaction}
					initialValues={{
						action: "",
						quantity: 0,
					}}
				>
					{({
						handleSubmit,
						handleChange,
						values,
						touched,
						errors,
						isSubmitting,
						setValues,
					}) => (
						<Form noValidate onSubmit={handleSubmit}>
							<span className="trade-price">${price}</span> / share
							<Stack
								direction="horizontal"
								gap={3}
								className="stack-form"
							>
								<Form.Group className="mb-3" controlId="action">
									<Form.Label>Action</Form.Label>
									<Select
										options={options}
										name="action"
										selectOption={values.action}
										onChange={(e) => handleChange("action")(e.value)}
										placeholder="Select..."
										required
									/>
								</Form.Group>
								<Form.Group className="mb-3" controlId="quantity">
									<Form.Label>Quantity</Form.Label>
									<InputGroup>
										<Form.Control
											required
											type="number"
											name="quantity"
											placeholder="Number of shares"
											value={values.quantity}
											onChange={(e) => {
												handleChange(e);
												setTotal(getNewTotal(e.target.value));
											}}
											isInvalid={touched.quantity && errors.quantity}
										/>
										{shareHolding > 0 && (
											<Button
												variant="outline-secondary"
												onClick={() => {
													setValues({
														...values,
														quantity: shareHolding,
													});
												}}
											>
												Sell All
											</Button>
										)}
									</InputGroup>
								</Form.Group>
							</Stack>
							<div className="feedback">
								{errors.quantity}
								{errors.quantity && errors.quantity && <br />}
								{errors.action}
							</div>
							Total: <span className="trade-price">${total}</span>
							{displayBalanceError(values.action)}
							{displaySharesError(values.action, values.quantity)}
							<div className="trade-extra">
								<div>Available funds: ${cashBalance.toFixed(2)}</div>
								<div>Shares currently owned: {shareHolding}</div>
							</div>
							<hr />
							<Stack direction="horizontal" gap={3}>
								<Button
									className="ms-auto"
									variant="secondary"
									onClick={handleClose}
								>
									Cancel
								</Button>
								<Button
									variant="success"
									type="submit"
									disabled={
										(cashBalance < total &&
											values.action === "buy") ||
										(values.quantity > shareHolding &&
											values.action === "sell") ||
										isSubmitting
									}
								>
									Trade
								</Button>
							</Stack>
						</Form>
					)}
				</Formik>
			</Modal.Body>
		</Modal>
	);
}
