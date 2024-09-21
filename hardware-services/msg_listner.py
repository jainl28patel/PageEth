import requests
import time
from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# MongoDB URI and API endpoint from environment variables
mongo_uri = os.getenv("MONGO_URI")
endpoint_url = os.getenv("API_ENDPOINT")
interval_seconds = int(os.getenv("QUERY_INTERVAL"))

# MongoDB setup
client = MongoClient(mongo_uri)
db = client["mydatabase"]  # Replace with your database name
collection = db["query_ids"]  # Replace with your collection name

# Define the GraphQL query
query = """
{
  messageReceiveds(first: 1, orderBy: blockNumber, orderDirection: desc) {
    id
    srcEid
    message
    blockNumber
  }
}
"""

# Define the request payload
payload = {
    "query": query,
    "operationName": "Subgraphs",
    "variables": {}
}

# Function to query the API endpoint
def query_endpoint(url):
    try:
        response = requests.post(url, json=payload, headers={"Content-Type": "application/json"})

        if response.status_code == 200:
            data = response.json()
            if len(data['data']['messageReceiveds']) > 0:
                new_id = int(data['data']['messageReceiveds'][0]['blockNumber'])

                if not id_exists_in_db(new_id):
                    # print(f"New ID found: {new_id}. Performing action...")

                    temp_list = data['data']['messageReceiveds'][0]['message'].split("_")
                    print(f"temp_list: {temp_list}")

                    # txhash
                    txhash = str(temp_list[-3])
                    # take last 66 characters of txhash
                    txhash = txhash[-66:]
                    # blockhash
                    blockhash = temp_list[-2]
                    # attestation_id
                    attestation_id = hex(int(temp_list[-1]))

                    print(f"txhash: {txhash}")
                    print(f"blockhash: {blockhash}")
                    print(f"attestation_id: {attestation_id}")

                    resp = requests.post('http://localhost:3000/verify-attestation', json={"id": attestation_id, "addr": "0xed47bd991A6767d090365DBeD6DA3d9496473cEE"})

                    if resp.status_code == 200:
                        resp = requests.get('http://localhost:3004/avail/get_msg', json={"blockHash": blockhash, "txHash": txhash})

                        if resp.status_code == 200:
                            resp = resp.json()
                            communicate_with_arduino(resp['data'])
                            store_id_in_db(new_id)
                    else:
                        print(f"Failed to verify attestation. Status code: {temp_list}")
        else:
            print(f"Failed to get data. Status code: {response.status_code}")
    
    except requests.RequestException as e:
        print(f"An error occurred: {e}")

# Function to check if the ID already exists in MongoDB
def id_exists_in_db(new_id):
    return collection.find_one({"_id": new_id}) is not None

# Function to store the new ID in MongoDB
def store_id_in_db(new_id):
    collection.insert_one({"_id": new_id})
    print(f"ID {new_id} stored in database.")

def communicate_with_arduino(message):
    print(f"Communicating with Arduino: {message}")

# Main function to repeatedly query the endpoint after a timeout
def main(url, interval):
    while True:
        query_endpoint(url)
        print(f"Waiting for {interval} seconds before the next query...")
        time.sleep(interval)

if __name__ == "__main__":
    main(endpoint_url, interval_seconds)
