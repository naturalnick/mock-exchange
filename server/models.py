from database import db

class Account(db.Model):
	account_number = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(50), unique=True, nullable=False)
	password = db.Column(db.String(50), nullable=False)
	balance = db.Column(db.Integer, nullable=False)

