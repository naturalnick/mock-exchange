import { useState } from "react";
import axios from "axios";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
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

	function displayBalanceError() {
		return <Alert variant="danger">You do not have enough funds.</Alert>;
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
								</Form.Group>
							</Stack>
							<div className="feedback">
								{errors.quantity}
								<br />
								{errors.action}
							</div>
							Total: <span className="trade-price">${total}</span>
							{cashBalance < total && displayBalanceError()}
							<div className="trade-extra">
								<div>Available funds: ${cashBalance}</div>
								<div>
									Shares currently owned: {getCurrentHoldings()}
								</div>
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
									disabled={cashBalance < total || isSubmitting}
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
