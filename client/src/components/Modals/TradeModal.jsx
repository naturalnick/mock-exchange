import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import { useAccount } from "../../context/AccountProvider";
import { tradeStock } from "../../utils/API";
import { formatPrice } from "../../utils/Utils";
import "./Modal.css";
import ReceiptModal from "./ReceiptModal";
import TradeActionSelect from "./TradeActionSelect";
import TradeQuantityInput from "./TradeQuantityInput";
import TradeModalErrors from "./TradeModalErrors";
import TradeModalButtons from "./TradeModalButtons";

const schema = yup.object().shape({
	action: yup.string().required("Action is required."),
	quantity: yup
		.number("Quantity must be a number.")
		.integer("Quantity must be a whole number.")
		.positive("Quantity must be a positive number.")
		.required("Quantity is required."),
});

export default function TradeModal({ handleClose, showModal, symbol, price }) {
	const { cashBalance, holdings, updateAccountInfo, updateAccountHoldings } =
		useAccount();
	const [shareHolding, setShareHolding] = useState();

	const [receipt, setReceipt] = useState({});
	const [showReceiptModal, setShowReceiptModal] = useState(false);
	const handleReceiptClose = () => setShowReceiptModal(false);
	const handleReceiptShow = () => setShowReceiptModal(true);

	const {
		handleSubmit,
		handleChange,
		values,
		touched,
		errors,
		isSubmitting,
		setValues,
	} = useFormik({
		validationSchema: schema,
		onSubmit: handleTransaction,
		initialValues: {
			action: "",
			quantity: 0,
		},
	});

	useEffect(() => {
		let shareQuantity = 0;
		for (let i = 0; i < holdings.length; i++) {
			if (holdings[i].symbol === symbol) {
				shareQuantity = holdings[i].quantity;
			}
		}
		setShareHolding(shareQuantity);
	}, [holdings, symbol]);

	const total = values.quantity * price;

	async function handleTransaction(formData) {
		if (cashBalance > total) {
			const quantity =
				formData.action === "sell"
					? Number(formData.quantity) * -1
					: formData.quantity;
			const response = await tradeStock({
				symbol: symbol,
				price: price,
				quantity: quantity,
			});
			if ("error" in response) {
				setReceipt({ error: "Transaction failed, please try again soon." });
			}
			if ("error" in response === false) {
				setReceipt({ symbol: symbol, price: price, quantity: quantity });
				updateAccountInfo();
				updateAccountHoldings();
			}
			handleClose();
			handleReceiptShow();
		}
	}

	return (
		<>
			<Modal show={showModal} onHide={handleClose} className="trade-modal">
				<Modal.Header closeButton>
					<Modal.Title>Trade: {symbol}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form noValidate onSubmit={handleSubmit}>
						<span className="trade-price">{formatPrice(price)}</span> /
						share
						<Stack direction="horizontal" gap={3} className="stack-form">
							<TradeActionSelect
								action={values.action}
								handleChange={handleChange}
								handleClose={handleClose}
							/>
							<TradeQuantityInput
								quantity={values.quantity}
								handleChange={handleChange}
								price={price}
								touched={touched}
								errors={errors}
								shareHolding={shareHolding}
								setValues={setValues}
							/>
						</Stack>
						<div>
							Total:{" "}
							<span className="trade-price">{formatPrice(total)}</span>
						</div>
						<TradeModalErrors
							quantity={values.quantity}
							action={values.action}
							cashBalance={cashBalance}
							total={total}
							shareHolding={shareHolding}
							errors={errors}
						/>
						<hr />
						<TradeModalButtons
							handleClose={handleClose}
							cashBalance={cashBalance}
							total={total}
							quantity={values.quantity}
							action={values.action}
							shareHolding={shareHolding}
							isSubmitting={isSubmitting}
							handleSubmit={handleSubmit}
						/>
					</Form>
				</Modal.Body>
			</Modal>
			<ReceiptModal
				handleClose={handleReceiptClose}
				showModal={showReceiptModal}
				receipt={receipt}
			/>
		</>
	);
}
