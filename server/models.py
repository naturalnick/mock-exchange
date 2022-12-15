from database import db

class Account(db.Model):
	id = db.Column(db.Integer, primary_key=True)
	email = db.Column(db.String(50), unique=True, nullable=False)
	password = db.Column(db.String(50), nullable=False)
	balance = db.Column(db.Integer, nullable=False)

class Holdings(db.Model):
	id = db.Column(db.Integer, db.Identity(start=11, cycle=True), primary_key=True)
	account_number = db.Column(db.Integer, nullable=False)
	symbol = db.Column(db.String(50), nullable=False)
	shares = db.Column(db.Float, nullable=False)
	base_cost = db.Column(db.Float, nullable=False)

class Transactions(db.Model):
	id = db.Column(db.Integer, db.Identity(start=11, cycle=True), primary_key=True)
	account_number = db.Column(db.Integer, nullable=False)
	date = db.Column(db.String, nullable=False)
	symbol = db.Column(db.String(50), nullable=False)
	shares = db.Column(db.Float, nullable=False)
	price = db.Column(db.Float, nullable=False)