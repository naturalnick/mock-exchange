from flask import Flask, request
from flask_cors import CORS
from queue import Queue, Empty
from threading import Thread
import os
from datetime import datetime, date
import pytz
from dotenv import load_dotenv
from models import Account, Holdings, Transactions, Values
from helpers import generate_account_id, generate_token, decode_token
import iex
from cryptography.fernet import Fernet
from database import db
import time

load_dotenv()

password_key = os.getenv("PASSWORD_KEY").encode("utf-8")
fernet = Fernet(password_key)

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
	return "Hello"


@app.route("/login", methods=["POST"])
def login_user():
	email = request.json["email"]
	password = request.json["password"]

	if check_email_exists(email) is False:
		return {"error": "Account does not exist for that email."}, 404

	account = get_account(email)
	decrypted_pass = fernet.decrypt(account.password.encode("utf-8")).decode()
	
	if password != decrypted_pass:
		return {"error": "Incorrect password."}, 401

	return {"token": generate_token(email)}, 200


@app.route("/register", methods=["POST"])
def register_user():
	email = request.json["email"]
	password = request.json["password"]

	if check_email_exists(email) is True:
		return {"error":"This email already has an account."}, 403

	create_account(email, password)
	return {"token": generate_token(email)}, 200


@app.route("/api/stock", methods=["GET"])
def get_stock():
	stock_symbol = request.args.get("symbol")

	data = iex.get_stock_data(stock_symbol)
	if data is None:
		return {"error": "Stock not found."}, 404
	return data, 200


@app.route("/api/account/info", methods=["GET"])
def account_info():
	token = decode_token(request.args.get("token"))
	if token is None: return {"error": "invalid token"}, 401

	account = get_account(token["email"])

	return {"account_number": account.id, "balance": account.balance, "watch_list": account.watch_list}, 200


@app.route("/api/account/watchlist", methods=["POST"])
def account_watchlist():
	data = request.json
	token = decode_token(data["token"])

	if token is None: return {"Error": "invalid token"}, 401

	update_watchlist(token["email"], data["symbol"], type=data["action"])

	return "Successfully added.", 200


@app.route("/api/account/holdings", methods=["GET"])
def account_holdings():
	token = request.args.get("token")
	email = decode_token(token)["email"]

	if decode_token(token) is None: return {"Error": "invalid token"}, 401

	account = get_account(email)
	holdings = get_account_holdings(account.id)

	return {"holdings": holdings}, 200


@app.route("/api/account/values", methods=["GET"])
def account_values():
	token = request.args.get("token")
	email = decode_token(token)["email"]

	if decode_token(token) is None: return {"Error": "invalid token"}, 401

	account = get_account(email)
	values = get_account_values(account.id)

	return {"values": values}, 200


@app.route("/api/account/transactions", methods=["GET"])
def account_transactions():
	token = request.args.get("token")
	email = decode_token(token)["email"]

	if decode_token(token) is None: return {"Error": "invalid token"}, 401

	account = get_account(email)
	transactions = get_account_transactions(account.id)

	return {"transactions": transactions}, 200


@app.route("/api/trade", methods=["POST"])
def trade():
	transaction = request.json

	token = transaction.pop("token")
	email = decode_token(token)["email"]
	if email is None: return {"Error": "invalid token"}, 401

	account = get_account(email)
	transaction.update({"account_number": account.id})

	transaction_amount = float(transaction["quantity"]) * float(transaction["cost_per_share"])

	modify_holdings(**transaction)
	adjust_balance(account.id, account.balance, transaction_amount)
	log_transaction(**transaction)
	return "Ok", 200


def update_watchlist(email, symbol, type="add"):
	account = db.session.query(Account).filter(Account.email == email).first()

	watch_list = account.watch_list.split(" ")
	if (type != "add"):
		watch_list.remove(symbol)
	else:
		watch_list.append(symbol)
	watch_list.sort()
	db.session.query(Account).filter(Account.email == email).update({"watch_list": " ".join(watch_list)})
	db.session.commit()


def adjust_balance(account_number, balance, amount):
	db.session.query(Account).filter(Account.id == account_number).update({"balance": balance - amount})
	db.session.commit()
	

def modify_holdings(account_number, symbol, quantity, cost_per_share):
	result = db.session.query(Holdings).filter(Holdings.account_number == account_number, Holdings.symbol == symbol).all()
	if len(result) > 0:
		holding = result[0]
		new_quantity = holding.shares + float(quantity)

		if int(quantity) > 0:
			new_price = (holding.base_cost + cost_per_share) / 2
		else:
			new_price = holding.base_cost

		db.session.query(Holdings).filter(Holdings.account_number == account_number, Holdings.symbol == symbol).update({"shares": new_quantity, "base_cost": new_price})
	
	else:
		new_holding = Holdings(account_number=account_number, symbol=symbol, shares=quantity, base_cost=cost_per_share)
		db.session.add(new_holding)		

	db.session.commit()


def log_transaction(account_number, symbol, quantity, cost_per_share):
	date = datetime.now().astimezone(pytz.utc)
	newTransaction = Transactions(account_number=account_number, date=date, symbol=symbol, shares=quantity, price=cost_per_share)
	db.session.add(newTransaction)
	db.session.commit()


def create_account(email, password):
	while(True):
		account_id = generate_account_id()
		if check_account_number_exists(account_id) == False: break

	encrypted_pass = fernet.encrypt(password.encode()).decode()

	starting_balance = 100000

	newAccount = Account(id=account_id, email=email, password=encrypted_pass, balance=starting_balance, watch_list='[]')
	db.session.add(newAccount)

	new_total = Values(account_number=account_id, date=str(date.today()), value=starting_balance)
	db.session.add(new_total)

	db.session.commit()


def check_email_exists(email):
	account = db.session.query(Account).filter(Account.email == email).first()
	return False if account is None else True


def get_account(email):
	return db.session.query(Account).filter(Account.email == email).first()


def check_account_number_exists(id):
	return False if db.session.get(Account, id) is None else True


def check_daily_total_logged(date):
	with app.app_context():
		query = db.session.query(Values).filter(Values.date == date).first()
		return False if query is None else True


def get_account_holdings(account_number):
	entries = db.session.query(Holdings).filter(Holdings.account_number == account_number).all()
	holdings = []
	for entry in entries:
		holdings.append({"id": entry.id, "symbol": entry.symbol, "quantity": entry.shares, "base_cost":entry.base_cost})
	return holdings


def get_account_values(account_number):
	entries = db.session.query(Values).filter(Values.account_number == account_number).order_by(Values.date).all()
	values = []
	for entry in entries:
		print(entry)
		values.append({"date": entry.date, "value": entry.value})
	return values
	

def get_account_transactions(account_number):
	entries = db.session.query(Transactions).filter(Transactions.account_number == account_number).all()
	transactions = []
	for entry in entries:
		transactions.append({"id": entry.id, "date": entry.date, "symbol": entry.symbol, "quantity": entry.shares, "price":entry.price})
	return transactions


def set_account_totals(date):
	with app.app_context():
		accounts = db.session.query(Account).all()

		for account in accounts:
			holdings = get_account_holdings(account.id)

			market_value_total = get_account_market_value(holdings)
			account_value = round(account.balance + market_value_total, 2)

			new_total = Values(account_number=account.id, date=date, value=account_value)
			db.session.add(new_total)

		db.session.commit()


def get_account_market_value(holdings):
	market_value_total = 0
	for holding in holdings:
		stock_data = iex.get_stock_data(holding["symbol"])
		share_market_value = stock_data["latestPrice"]
		market_value_total = market_value_total + (share_market_value * holding["quantity"])
	return market_value_total


def daily_totals():
	while(True):
		today = str(date.today())
		current_hour = int(datetime.now().astimezone(pytz.utc).strftime("%H"))
		us_market_closing_hour_utc = 21 # 4PM EST
		sleeping_seconds = 3600

		if current_hour < us_market_closing_hour_utc:
			sleeping_seconds = (us_market_closing_hour_utc - current_hour) * 3600
			print(f"Server status check. Date: {today}, Hour: {current_hour}/24 (UTC). Market is still open, waiting {sleeping_seconds/3600} hours to check again")

		elif check_daily_total_logged(today) is False:
			print(f"Server status check. Date: {today}, Hour: {current_hour}/24 (UTC). Market is now closed, assigning account totals, next check in {sleeping_seconds/3600} hours.")
			set_account_totals(today)

		else:
			sleeping_seconds = 7200
			print(f"Server status check. Date: {today}, Hour: {current_hour}/24 (UTC). Totals have already been assigned today. Next check in {sleeping_seconds/3600} hours. ")
			
		time.sleep(sleeping_seconds)


Thread(target=daily_totals, daemon=True).start()

if __name__ == "__main__":
	app.run(debug=True,port=5001)