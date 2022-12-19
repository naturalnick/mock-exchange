import random
import jwt
from dotenv import load_dotenv
import os

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

