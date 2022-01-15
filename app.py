from flask import Flask, render_template, redirect, jsonify
from flask_cors import CORS
from flask_pymongo import pymongo
# from pymongo import MongoClient
# import scrape_mars
import pandas as pd
import json 

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
# connect to mongo db and collection
db = client.restaurants_db

independents = db.independents

# setup mongo connection
conn = "mongodb://localhost:27017"
client = pymongo.MongoClient(conn)
db = client.restaurants_db
collection = db.independents




def mongoimport():
    data = pd.read_csv('./data/restaurant_data.csv')
    data_to_load = json.loads(data.to_json(orient='records'))
    collection.remove()
    collection.insert(data_to_load)
    print("ENDING DB INSERT")
    return collection.count()  
    
    

CORS(app)

# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Call function to import CSV into MongoDB
    mongoimport()
    return render_template("/index.html")


@app.route("/others")
def others():
    """List all available api routes."""
    return (
        f"Available Routes:<br/>"
        f"<br>\/ Return JSON list ALL restaurant data \/<br/>"
        f"/api/v1.0/alldata<br/>"
        f"<br>\/ Return JSON list of TOP TEN restaurant data \/<br/>"
        f"/api/v1.0/topten<br/>"
        f"<br>\/ Return JSON list of DISTINCT CITIES \/<br/>"
        f"/api/v1.0/distinctcities<br/>"        
        f"<br>\/ Return JSON list of SALES AND CITIES \/<br/>"
        f"/api/v1.0/salesandcities<br/>"
        f"<br>\/ Return JSON list of SALES AND STATES \/<br/>"
        f"/api/v1.0/salesandstates<br/>"
        f"<br>\/ Return JSON list of COUNT BY CITIES \/<br/>"
        f"/api/v1.0/countbycities<br/>"
        f"<br>\/ Return JSON list of COUNT BY STATES \/<br/>"
        f"/api/v1.0/countbystates<br/>"
        f"<br>\/ Return JSON list of AVG CHECK AND MEALS SERVED BY STATES \/<br/>"
        f"/api/v1.0/checkmealsbystates<br/>"        
    )
    
# @app.route("/index.html")
# def index_render():
#         return render_template("index.html")

# \/ THESE ARE ROUTES FOR RENDERING VISUALIZATIONS ONTO NEW TABS
@app.route("/cluster")
def cluster_chart():
        return render_template("cluster.html")

@app.route("/data")
def data_dump():
        return render_template("data.html")

@app.route("/bubble.html")
def bubble_chart():
        return render_template("bubble.html")

# @app.route("/plotlybar.html")
# def plotlybar_chart():
#         return render_template("plotlybar.html")

@app.route("/api/v1.0/alldata")
# https://docs.mongodb.com/manual/reference/sql-comparison/
def alldata():

    results = collection.find()
    response = []
    for result in results:
        result['_id'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)

    print("ALLDATA ROUTE")



@app.route("/api/v1.0/topten")
# https://docs.mongodb.com/manual/reference/sql-comparison/
def topten():

    results = collection.find({'Rank': {"$lte": 10}})
    response = []
    for result in results:
        result['_id'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)

    print("TOPTEN ROUTE")


@app.route("/api/v1.0/distinctcities")
# https://docs.mongodb.com/manual/reference/sql-comparison/
# https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/
# https://docs.mongodb.com/manual/reference/operator/aggregation/sum/

# \/ SAVING ORIGINAL CODE - THIS WORKS \/
# def distinctcities():
#     results = collection.aggregate([{ '$group': {'_id': '$City'}}])
    
#     response = []
#     for result in results:
#         result['city'] = str(result['_id'])
#         del result['_id']
#         response.append(result)
#     return jsonify(response)


#     print("DISTINCTCITIES ROUTE")


def distinctcities():
    results = collection.aggregate([{ '$group': {'_id': '$City', 'Lat': {'$first':'$Lat'},'Lng': {'$first':'$Lng'}}}])
    
    response = []
    for result in results:
        result['City'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)


    print("DISTINCTCITIES ROUTE") 



@app.route("/api/v1.0/salesandcities")
# https://docs.mongodb.com/manual/reference/sql-comparison/
# https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/
# https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
def salesandcities():
    results = collection.aggregate([{ '$group': {'_id': '$City', 'Tot_Sales': {'$sum' : '$Sales'}, 'Lat': {'$first':'$Lat'},'Lng': {'$first':'$Lng'}}}])
    
    response = []
    for result in results:
        result['City'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)


    print("SALESANDCITIES ROUTE")



@app.route("/api/v1.0/salesandstates")
# https://docs.mongodb.com/manual/reference/sql-comparison/
# https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/
# https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
def salesandstates():

    results = collection.aggregate([{ '$group': {'_id': '$State', 'Tot_Sales': {'$sum' : '$Sales'}, 'Lat': {'$first':'$Lat'},'Lng': {'$first':'$Lng'}}}])
    
    response = []
    for result in results:
        result['State'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)    

    print("SALESANDSTATES ROUTE")


@app.route("/api/v1.0/countbycities")
# https://docs.mongodb.com/manual/reference/sql-comparison/
# https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/
# https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
def countbycities():
    results = collection.aggregate([{ '$group': {'_id': '$City', 'Count': {'$sum' : 1}, 'Lat': {'$first':'$Lat'},'Lng': {'$first':'$Lng'}}}])
    
    response = []
    for result in results:
        result['City'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)


    print("COUNTBYCITIES ROUTE")



@app.route("/api/v1.0/countbystates")
# https://docs.mongodb.com/manual/reference/sql-comparison/
# https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/
# https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
def countbystates():

    results = collection.aggregate([{ '$group': {'_id': '$State', 'count': {'$sum' : 1}, 'Lat': {'$first':'$Lat'},'Lng': {'$first':'$Lng'}}}])
    
    response = []
    for result in results:
        result['State'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)    

    print("COUNTBYSTATES ROUTE")




@app.route("/api/v1.0/checkmealsbystates")
# https://docs.mongodb.com/manual/reference/sql-comparison/
# https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/
# https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
def checkmealsbystates():

    results = collection.aggregate([{ '$group': {'_id': '$State', 'Avg': {'$avg' : '$Average_Check'}, 'Tot_Sales': {'$sum' : '$Sales'},'Tot_Meals': {'$sum' : '$Meals_Served'}}}])
    
    response = []
    for result in results:
        result['State'] = str(result['_id'])
        del result['_id']
        response.append(result)
    return jsonify(response)    

    print("COUNTBYSTATES ROUTE")    


if __name__ == "__main__":
    app.run(debug=True)
