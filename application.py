import requests, datetime
from flask import Flask, request, render_template, url_for

app=Flask(__name__)


@app.route("/")
def map():
    return render_template("Map.html", geocode="", date_value="", initial_page=True)

if __name__== "__main__" :
    app.run()