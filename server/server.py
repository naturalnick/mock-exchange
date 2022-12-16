from flask import Flask, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import db
from models import Account, Holdings, Transactions
from helpers import generate_account_id, generate_token, decode_token
import iex

load_dotenv()

def create_app():
	app = Flask(__name__)
	app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DB_ACCESS")
	CORS(app)
	db.init_app(app)
	return app

app = create_app()

with app.app_context():
	from models import Account
	db.create_all()


@app.route("/")
def index():
	print(get_account_holdings(66245866))
	return "Hello"


@app.route("/login", methods=["POST"])
def login_user():
	email = request.json["email"]
	password = request.json["password"]

	if check_email_exists(email) is False:
		return "Account does not exist for that email.", 404

	account = get_account(email)
	if password != account.password:
		return "Incorrect password.", 401

	return {"token": generate_token(email)}, 200


@app.route("/register", methods=["GET", "POST"])
def register_user():
	if request.method == "POST":
		email = request.json["email"]
		password = request.json["password"]

		if check_email_exists(email) is True:
			return "This email already has an account.", 403

		create_account(email, password)
	return {"token": generate_token(email)}, 200


@app.route("/api/stock", methods=["GET"])
def get_stock():
	stock_symbol = request.args.get("symbol")
	data = iex.get_stock_data(stock_symbol)
	return data, 200


@app.route("/api/account/info", methods=["GET"])
def account_info():
	token = decode_token(request.args.get("token"))
	if token is None: return {"Error": "invalid token"}, 401

	account = get_account(token["email"])
	return {"account_number": account.id, "balance": account.balance}, 200


@app.route("/api/account/holdings", methods=["GET"])
def account_holdings():
	token = request.args.get("token")
	email = decode_token(token)["email"]

	if decode_token(token) is None: return {"Error": "invalid token"}, 401

	account = get_account(email)
	holdings = get_account_holdings(account.id)

	return {"holdings": holdings}, 200


@app.route("/api/account/transactions", methods=["GET"])
def account_transactions():
	token = request.args.get("token")
	email = decode_token(token)["email"]

	if decode_token(token) is None: return {"Error": "invalid token"}, 401

	account = get_account(email)
	transactions = get_account_transactions(account.id)

	return {"transactions": transactions}, 200


@app.route("/api/trade", methods=["GET"])
def trade():
	token = request.args.get("token")
	email = decode_token(token)["email"]
	action = request.args.get("action")
	quantity = request.args.get("quantity")

	if decode_token(token) is None: return {"Error": "invalid token"}, 401

	account = get_account(email)


def create_account(email, password):
	while(True):
		account_id = generate_account_id()
		if check_account_number_exists(account_id) == False: break
	#encrypt password
	newAccount = Account(id=account_id, email=email, password=password, balance=1000)
	db.session.add(newAccount)
	db.session.commit()


def check_email_exists(email):
	account = db.session.query(Account).filter(Account.email == email).first()
	return False if account is None else True


def get_account(email):
	return db.session.query(Account).filter(Account.email == email).first()


def check_account_number_exists(id):
	return False if db.session.get(Account, id) is None else True


def get_account_holdings(account_number):
	return db.session.query(Holdings).filter(Holdings.account_number == account_number).all()


def get_account_transactions(account_number):
	return db.session.query(Transactions).filter(Transactions.account_number == account_number).all()


if __name__ == "__main__":
	app.run(debug=True,port=5001)