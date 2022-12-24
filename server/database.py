from cryptography.fernet import Fernet
from models import db, Account, Holdings, Transactions, DailyTotals, StockReference
from helpers import generate_account_id, get_account_market_value
import iex
from datetime import datetime, date
import time
import pytz
import os

password_key = os.getenv("PASSWORD_KEY").encode("utf-8")
fernet = Fernet(password_key)

def update_watchlist(email, symbol):
	account = db.session.query(Account).filter(Account.email == email).first()

	watch_list = account.watch_list.split(" ")
	if symbol in watch_list:
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

	new_total = DailyTotals(account_number=account_id, date=str(date.today()), value=starting_balance)
	db.session.add(new_total)

	db.session.commit()


def check_credentials(email, password):
	account = get_account(email)
	decrypted_pass = fernet.decrypt(account.password.encode("utf-8")).decode()
	return True if password == decrypted_pass else False


def check_email_exists(email):
	account = db.session.query(Account).filter(Account.email == email).first()
	return False if account is None else True


def get_account(email):
	return db.session.query(Account).filter(Account.email == email).first()


def check_account_number_exists(id):
	return False if db.session.get(Account, id) is None else True


def check_daily_total_logged(date):
	query = db.session.query(DailyTotals).filter(DailyTotals.date == date).first()
	return False if query is None else True


def get_account_holdings(account_number):
	entries = db.session.query(Holdings).filter(Holdings.account_number == account_number).all()
	holdings = []
	for entry in entries:
		holdings.append({"id": entry.id, "symbol": entry.symbol, "quantity": entry.shares, "base_cost":entry.base_cost})
	return holdings


def get_account_daily_totals(account_number):
	entries = db.session.query(DailyTotals).filter(DailyTotals.account_number == account_number).order_by(DailyTotals.date).all()
	totals = []
	for entry in entries:
		totals.append({"date": entry.date, "value": entry.value})
	return totals
	

def get_account_transactions(account_number):
	entries = db.session.query(Transactions).filter(Transactions.account_number == account_number).all()
	transactions = []
	for entry in entries:
		transactions.append({"id": entry.id, "date": entry.date, "symbol": entry.symbol, "quantity": entry.shares, "price":entry.price})
	return transactions


def set_account_totals(date):
	accounts = db.session.query(Account).all()

	for account in accounts:
		holdings = get_account_holdings(account.id)

		market_value_total = get_account_market_value(holdings)
		account_value = round(account.balance + market_value_total, 2)

		new_total = DailyTotals(account_number=account.id, date=date, value=account_value)
		db.session.add(new_total)

	db.session.commit()


def get_stock_list():
	update_stock_list()
	stock_list = []
	for entry in db.session.query(StockReference).all():
		stock = entry.__dict__
		del stock["_sa_instance_state"]
		stock_list.append(stock)
	return stock_list


def update_stock_list():
	entry = db.session.query(StockReference).first()
	if entry is None: # only run once to save the list
		stock_list = iex.get_stock_list()
		for stock in stock_list:
			newRef = StockReference(symbol=stock["symbol"], company_name=stock["company_name"])
			db.session.add(newRef)
		db.session.commit()


def daily_totals():
	while(True):
		today = str(date.today())
		current_hour = int(datetime.now().astimezone(pytz.utc).strftime("%H"))
		us_market_closing_hour_utc = 21 # 4PM EST
		sleeping_seconds = 3600

		if current_hour < us_market_closing_hour_utc:
			sleeping_seconds = (us_market_closing_hour_utc - current_hour) * 3600
			message = f"Waiting {sleeping_seconds/3600} hours to check again."
		elif check_daily_total_logged(today) is False:
			message = f"Assigning account totals, next check in {sleeping_seconds/3600} hours."
			set_account_totals(today)
		else:
			message = f"Totals have already been assigned today. Next check in {sleeping_seconds/3600} hours."

		print(f"Server status check. Date: {today}, Hour: {current_hour}/24 (UTC). {message}")
		time.sleep(sleeping_seconds)