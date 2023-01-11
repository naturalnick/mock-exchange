from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Account(db.Model):
	id = db.Column(db.String, primary_key=True)
	email = db.Column(db.String, unique=True, nullable=False)
	password = db.Column(db.String, nullable=False)
	balance = db.Column(db.Float, nullable=False)
	watch_list = db.Column(db.String, nullable=True)

class Holdings(db.Model):
	id = db.Column(db.Integer, db.Identity(start=1, cycle=True), primary_key=True)
	account_number = db.Column(db.String, nullable=False)
	symbol = db.Column(db.String, nullable=False)
	shares = db.Column(db.Float, nullable=False)
	base_cost = db.Column(db.Float, nullable=False)

class Transactions(db.Model):
	id = db.Column(db.Integer, db.Identity(start=1, cycle=True), primary_key=True)
	account_number = db.Column(db.String, nullable=False)
	date = db.Column(db.String, nullable=False)
	symbol = db.Column(db.String, nullable=False)
	shares = db.Column(db.Float, nullable=False)
	price = db.Column(db.Float, nullable=False)

class DailyTotals(db.Model):
	id = db.Column(db.Integer, db.Identity(start=1, cycle=True), primary_key=True)
	account_number = db.Column(db.String, nullable=False)
	date = db.Column(db.String, nullable=False)
	value = db.Column(db.Float, nullable=False)