from flask import Flask, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from database import db
from models import Account
from helpers import generate_account_id, generate_token
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
	return "Hello"

#### use this once we start hosting on server
# @app.route("/")
# def index():
# 	return app.send_static_file("index.html"), 200


# @app.errorhandler(404)
# def not_found(e):
# 	return app.send_static_file("index.html"), 200


@app.route("/login", methods=["GET", "POST"])
def login_user():
	if request.method == "POST":
		email = request.json["email"]
		password = request.json["password"]

		if check_email_exists(email) is False:
			return "Account does not exist for that email.", 404

		if validate_credentials(email, password) is False:
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

def create_account(email, password):
	while(True):
		account_id = generate_account_id()
		if check_account_number_exists(account_id) == False: break
	#encrypt password
	newAccount = Account(id=account_id, email=email, password=password, balance=1000)
	db.session.add(newAccount)
	db.session.commit()


def validate_credentials(email, password):
	account = Account.query.filter_by(email=email).first()
	if account is not None and account.password == password:
		return True
	else: return False


def check_email_exists(email):
	account = Account.query.filter_by(email=email).first()
	return False if account is None else True


def check_account_number_exists(id):
	return False if db.session.get(Account, id) is None else True


if __name__ == "__main__":
	app.run(debug=True,port=5001)