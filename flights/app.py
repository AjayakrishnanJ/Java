import requests
import mysql.connector

# Define the API URL
api_url = "https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json"

# Define your MySQL database connection details
db_config = {
    "host": "your_mysql_host",
    "user": "your_mysql_user",
    "password": "your_mysql_password",
    "database": "your_database_name",
}

# Function to fetch data from the API
def fetch_data():
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to fetch data. Status code: {response.status_code}")

# Function to insert data into MySQL
def insert_data(data):
    connection = mysql.connector.connect(**db_config)
    cursor = connection.cursor()

    # Assuming the API returns a list of dictionaries with airport data
    for airport in data:
        insert_query = """
            INSERT INTO airports (airport_code, airport_name, country)
            VALUES (%s, %s, %s)
        """
        values = (airport['code'], airport['name'], airport['country'])
        cursor.execute(insert_query, values)

    connection.commit()
    connection.close()

if __name__ == "__main__":
    try:
        data = fetch_data()
        insert_data(data)
        print("Data inserted into MySQL successfully.")
    except Exception as e:
        print(f"Error: {str(e)}")
