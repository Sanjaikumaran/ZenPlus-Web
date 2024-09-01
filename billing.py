import sys
import os
import time
import json
import platform
import subprocess
from datetime import datetime

from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl, QObject, pyqtSlot, pyqtSignal
from PyQt5.QtWebChannel import QWebChannel
import operations_access
from PyQt5.QtGui import QContextMenuEvent


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("HTML, CSS, and JavaScript in PyQt")

        self.browser = QWebEngineView()

        html_file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "index.html")
        )
        self.browser.setUrl(QUrl.fromLocalFile(html_file_path))

        self.channel = QWebChannel()
        self.handler = Handler(self.browser)
        self.channel.registerObject("handler", self.handler)
        self.browser.page().setWebChannel(self.channel)

        layout = QVBoxLayout()
        layout.addWidget(self.browser)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        central_widget = QWidget()
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)
        self.showMaximized()

        self.browser.urlChanged.connect(self.handle_url_change)

    def handle_url_change(self, url):
        if not url.isLocalFile():
            self.browser.setUrl(url)


class CustomWebEngineView(QWebEngineView):
    def contextMenuEvent(self, event: QContextMenuEvent):

        pass


class Handler(QObject):
    load_table = pyqtSignal(str)
    add_item = pyqtSignal(str, dict)
    update_item = pyqtSignal(str, dict, dict)
    remove_item = pyqtSignal(str, dict)
    last_item = pyqtSignal(str, str)
    select_item = pyqtSignal(str, str, dict)

    def __init__(self, browser):
        super().__init__()
        self.manager = operations_access.DataManagement()
        self.browser = browser

    @pyqtSlot(str)
    def loadTable(self, table_name):
        columns = ""
        if table_name == "Products":
            columns = "SNo,ProductID,ProductName,Timestamp,Brand,CostPrice,SellingPrice,MRP,Discount,CurrentStock,HistoryStock,SoldStock,GST"
        elif table_name == "Customers":
            columns = "SNo,CustomerID,Timestamp,FirstName,LastName,Email,Phone,Address,City,Country"
        elif table_name == "Employees":
            columns = (
                "SNo,EmployeeID,FirstName,LastName,Department,Position,Salary,Timestamp"
            )
        elif table_name == "Transactions":
            columns = "SNo,TransactionID,CustomerID,EmployeeID,Timestamp,Quantity,Discount,Tax,TotalPrice,NetSales,Profit,PaymentMethod,LocationID"
        elif table_name == "TransactionItems":
            columns = (
                "SNo,TransactionID,ProductID,Quantity,Price,Discount,Amount,Taxes,Total"
            )
        else:
            return

        keys = columns.split(",")
        data = self.manager.list_items(table_name, columns)
        data_dicts = [dict(zip(keys, item)) for item in data]
        json_data = json.dumps(data_dicts)

        self.browser.page().runJavaScript(f"handleDataFromPython({json_data})")

    @pyqtSlot(str, str)
    def addItem(self, table_name, columns_values_json):
        columns_values = json.loads(columns_values_json)

        data = self.manager.list_items(table_name, "SNo")
        columns_values["SNo"] = len(data) + 1
        result = self.manager.add_item(table_name, columns_values)
        if result:

            return "true"
        else:

            return "false"

    @pyqtSlot(str, str, str)
    def updateItem(self, table_name, where_clause, columns_values_json):
        columns_values = json.loads(columns_values_json)
        condition = json.loads(where_clause)
        result = self.manager.update_item(table_name, condition, columns_values)
        if result:

            return "true"

        else:

            return "false"

    @pyqtSlot(str, str)
    def removeItem(self, table_name, where_clause):

        condition = json.loads(where_clause)
        result = self.manager.remove_item(table_name, condition)
        if table_name == "Transactions":
            result = self.manager.remove_item("TransactionItems", condition)
        if result:

            return "true"

        else:

            return "false"

    @pyqtSlot(str, str)
    def lastItem(self, table_name, column_name):

        result = self.manager.get_last_item(table_name, column_name)

        result = json.dumps(result[0])

        self.browser.page().runJavaScript(f"handleDataFromPython({result})")

        if result:

            return result

        else:

            return "false"

    @pyqtSlot(str, str, str)
    def selectItem(self, table_name, column_name, where_clause):
        try:
            column_names = json.loads(column_name)
            condition = json.loads(where_clause)
            selling_price_list = []

            for productId in condition:

                result = self.manager.get_item(
                    table_name, column_names, condition[productId]
                )

                if result and result[0]:
                    selling_price_list.append(result[0][0])
                else:
                    print(f"No data found for ProductID: {condition[productId]}")
            print(selling_price_list)
            self.browser.page().runJavaScript(f"sellingPriceList({selling_price_list})")
            return True

        except Exception as e:
            print(f"Error in selectItem: {str(e)}")
            return None

    @pyqtSlot(str, str, str)
    def findBill(self, table_names, column_name, where_clause):
        try:
            table_names = json.loads(table_names)
            column_names = (
                column_name  # Assuming column_names is already in the correct format
            )
            condition = json.loads(where_clause)

            results = []
            for table_name in table_names[:2]:

                result = self.manager.get_item(table_name, column_names, condition)

                if table_name == "Transactions" and not result:

                    return False
                # print(result)
                results.append(result)
            result = self.manager.get_item(
                table_names[-1], column_names, {"CustomerID": results[0][0][-4]}
            )
            results.append(result)
            productNames = []
            for item in results[1]:
                name = self.manager.get_item(
                    "Products", "ProductName", {"ProductID": item[3]}
                )
                productNames.append(name)
            results.append(productNames)

            result_json = json.dumps(results)

            self.browser.page().runJavaScript(f"findBillData({result_json})")
            return True

        except Exception as e:
            print(f"Error in findBill: {str(e)}")
            return False

    @pyqtSlot(str, str)
    def generateBill(self, items, bill_file):
        items = json.loads(items)
        print(items)

        # Create a simple bill header
        header = "=======================================\n"
        header += "            Zen Plus Recipt            \n"
        header += "=======================================\n"
        header += f"Date: {datetime.now().strftime('%d-%m-%Y')} Time: {datetime.now().strftime('%H:%M:%S')}\n"
        header += "=======================================\n"

        # Add items
        item_lines = ""
        total = tax = 0
        for item in items:

            item = items[item]
            name = item["ProductName"]
            quantity = item["Quantity"]
            price = item["Price"]
            tax += item["Tax"]
            item_total = item["Total"]
            total += item_total
            item_lines += f"{name:20} {quantity} x ${price:.2f} = ${item_total:.2f}\n"

        # Footer with total
        footer = "============================\n"
        footer += f"Total: ${total:.2f}   Tax: ${tax:.2f}\n"
        footer += "============================\n"
        footer += "   Thank you for shopping!  \n"
        footer += "============================\n"

        # Write to a file
        print(header, item_lines, footer)
        with open(bill_file, "wb") as file:
            # Write the content
            file.write(header.encode("utf-8"))
            file.write(item_lines.encode("utf-8"))
            file.write(footer.encode("utf-8"))

    def print_bill_dynamic(self, bill_file):
        system_name = platform.system()

        # Determine printer command and device
        if system_name == "Windows":
            # Windows: Use the default printer
            try:
                import win32print
                import win32api

                printer_name = win32print.GetDefaultPrinter()
                hPrinter = win32print.OpenPrinter(printer_name)
                try:
                    hJob = win32print.StartDocPrinter(
                        hPrinter, 1, ("Bill", None, "RAW")
                    )
                    win32print.StartPagePrinter(hPrinter)

                    with open(bill_file, "rb") as f:
                        win32print.WritePrinter(hPrinter, f.read())

                    # Send the feed and cut commands
                    win32print.WritePrinter(hPrinter, FEED_PAPER)
                    win32print.WritePrinter(hPrinter, CUT_PAPER)

                    win32print.EndPagePrinter(hPrinter)
                    win32print.EndDocPrinter(hPrinter)
                finally:
                    win32print.ClosePrinter(hPrinter)
            except ImportError:
                print("Error: pywin32 module is required on Windows.")

        elif system_name == "Darwin":
            # macOS: Use lp command
            subprocess.run(["lp", bill_file])
            # Feed paper and cut command (macOS specifics may vary)
            subprocess.run(["lp", "-o", "raw"], input=FEED_PAPER + CUT_PAPER)

        elif system_name == "Linux":
            # Linux: Use lpr command
            subprocess.run(["lpr", bill_file])
            # Feed paper and cut command
            with open("/dev/usb/lp0", "wb") as printer:
                with open(bill_file, "rb") as bill:
                    printer.write(bill.read())
                # Send feed and cut commands
                # printer.write(FEED_PAPER)
                printer.write(CUT_PAPER)
        else:
            print(f"Printing is not supported on {system_name}.")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
