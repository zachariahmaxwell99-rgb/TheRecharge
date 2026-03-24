from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import json
from datetime import datetime

app = Flask(__name__)
CORS(app) # Allow cross-origin from standard file:// browsers

DB_PATH = os.path.join(os.path.dirname(__file__), 'carpool.db')

def init_db():
    print("Initializing Database at:", DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS rides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            name TEXT NOT NULL,
            origin TEXT NOT NULL,
            route TEXT NOT NULL,
            seats INTEGER,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database securely on startup
init_db()

@app.route('/api/ride', methods=['POST'])
def create_ride():
    data = request.json
    ride_type = data.get('type')
    name = data.get('name')
    origin = data.get('origin')
    route = data.get('route')
    seats = int(data.get('seats', 1))
    
    if not origin or not name or not route or ride_type not in ['driver', 'passenger']:
        return jsonify({"error": "Invalid payload parameters"}), 400
        
    route_json = json.dumps(route)
        
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO rides (type, name, origin, route, seats) VALUES (?, ?, ?, ?, ?)", 
              (ride_type, name, origin, route_json, seats))
    conn.commit()
    inserted_id = c.lastrowid
    conn.close()
    print(f"Logged new {ride_type.upper()} explicit user: {name} from {origin}")
    
    return jsonify({"success": True, "id": inserted_id, "message": "Successfully bound entry!"}), 201


@app.route('/api/matches', methods=['GET'])
def get_matches():
    origin = request.args.get('origin')
    role = request.args.get('role')
    route_json = request.args.get('route', '[]')
    
    if not origin or not role:
        return jsonify({"error": "Missing parameters"}), 400
        
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    if role == 'driver':
        try:
            route_array = json.loads(route_json)
        except json.JSONDecodeError:
            route_array = []
            
        if not route_array:
            return jsonify({"success": True, "matches": []}), 200
            
        placeholders = ','.join('?' for _ in route_array)
        c.execute(f"SELECT * FROM rides WHERE type = 'passenger' AND origin IN ({placeholders}) ORDER BY timestamp DESC LIMIT 5", route_array)
    else:
        like_query = f'%"{origin}"%'
        c.execute("SELECT * FROM rides WHERE type = 'driver' AND route LIKE ? ORDER BY timestamp DESC LIMIT 5", (like_query,))
        
    rows = c.fetchall()
    conn.close()
    
    matches = [dict(row) for row in rows]
    return jsonify({"success": True, "matches": matches}), 200

if __name__ == '__main__':
    print("SUCCESS: Recharge Backend Server is Live on Port 5000...")
    app.run(debug=True, port=5000)
