import random
import jwt
from dotenv import load_dotenv
import os
import api

load_dotenv()

def generate_account_id():
	account_number = ""
	for x in range(0, 16):
		account_number += str(random.randrange(0, 10))
	return account_number


def generate_token(email):
	return jwt.encode({"email": email}, os.getenv("JWT_SECRET"), algorithm="HS256")


def decode_token(token):
	try:
		decoded = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms="HS256")
	except:
		return None
	else:
		return decoded


def get_account_market_value(holdings):
	market_value_total = 0
	for holding in holdings:
		stock_data = api.get_stock_data(holding["symbol"])
		share_market_value = stock_data["latestPrice"]
		market_value_total = market_value_total + (share_market_value * holding["quantity"])
	return market_value_total