import { Formik } from "formik";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { useAuth } from "../../context/AuthProvider";
import "./Register.css";

const registerSchema = yup.object().shape({
	email: yup
		.string()
		.email("Not a valid email.")
		.required("Email is required."),
	password: yup
		.string()
		.min(4, "Must be 4 or more characters")
		.required("Password is required."),
	matchingPassword: yup
		.string()
		.oneOf([yup.ref("password"), null], "Passwords must match.")
		.required("You must confirm your password."),
});

export default function Register({ setIsRegistering }) {
	const { handleRegister, authError, setAuthError } = useAuth();
	return (
		<Card className="login-card">
			<Card.Body>
				<Card.Title>Register</Card.Title>
				<div className="error">{authError}</div>
				<Formik
					validationSchema={registerSchema}
					onSubmit={(formData) => handleRegister(formData)}
					initialValues={{
						email: "",
						password: "",
						matchingPassword: "",
					}}
				>
					{({ handleSubmit, handleChange, values, touched, errors }) => (
						<Form noValidate onSubmit={handleSubmit}>
							<Form.Group className="mb-3" controlId="email-group">
								<Form.Label>Email</Form.Label>
								<Form.Control
									required
									type="email"
									name="email"
									placeholder="eg. name@email.com"
									value={values.email}
									onChange={handleChange}
									isInvalid={!!errors.email}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.email}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control
									required
									minLength={"4"}
									type="password"
									name="password"
									placeholder="Password"
									value={values.password}
									isValid={touched.password && !errors.password}
									isInvalid={touched.password && errors.password}
									onChange={handleChange}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.password}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									required
									type="password"
									name="matchingPassword"
									placeholder="Re-type Password"
									value={values.matchingPassword}
									isValid={
										touched.matchingPassword &&
										!errors.matchingPassword
									}
									isInvalid={
										touched.matchingPassword &&
										errors.matchingPassword
									}
									onChange={handleChange}
								/>
								<Form.Control.Feedback type="invalid">
									{errors.matchingPassword}
								</Form.Control.Feedback>
							</Form.Group>
							<div className="text-center mb-3">
								<Button variant="primary" type="submit">
									Sign Up
								</Button>
							</div>
						</Form>
					)}
				</Formik>
				<div className="type-text">
					Have an account?{" "}
					<span
						className="type-link"
						onClick={() => {
							setAuthError("");
							setIsRegistering(false);
						}}
					>
						Sign In
					</span>
				</div>
			</Card.Body>
		</Card>
	);
}
