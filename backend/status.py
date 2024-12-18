from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import platform
import threading
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for VMs
machines = [
    {"id": 1, "ip": "8.8.8.8", "status": "unknown"},
    {"id": 2, "ip": "1.1.1.1", "status": "unknown"}
]

# Helper function to check live status using ping
def ping_target(target):
    try:
        # Adjust ping command based on the OS
        if platform.system().lower() == "windows":
            ping_command = ["ping", "-n", "1", target]  # Windows
        else:
            ping_command = ["ping", "-c", "1", target]  # Linux/macOS

        result = subprocess.run(ping_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        return "green" if result.returncode == 0 else "red"
    except Exception as e:
        print(f"Error pinging {target}: {e}")
        return "orange"

# Background thread to update machine statuses periodically
def update_statuses():
    while True:
        for machine in machines:
            machine["status"] = ping_target(machine["ip"])
        time.sleep(5)  # Update statuses every 5 seconds

# Start the status update thread
status_thread = threading.Thread(target=update_statuses, daemon=True)
status_thread.start()

# Route to get all machines and their statuses
@app.route("/machines", methods=["GET"])
def get_machines():
    return jsonify({"machines": machines})

# Route to add a new machine
@app.route("/machines", methods=["POST"])
def add_machine():
    data = request.get_json()
    ip = data.get("ip")
    if not ip:
        return jsonify({"error": "IP address is required"}), 400

    new_id = max([m["id"] for m in machines], default=0) + 1
    new_machine = {"id": new_id, "ip": ip, "status": ping_target(ip)}
    machines.append(new_machine)
    return jsonify(new_machine), 201

# Route to delete a machine by ID
@app.route("/machines/<int:machine_id>", methods=["DELETE"])
def delete_machine(machine_id):
    global machines
    machines = [m for m in machines if m["id"] != machine_id]
    return jsonify({"message": f"Machine with ID {machine_id} deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
