import sys
import os
import json
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

        # Create and set up QWebEngineView
        self.browser = QWebEngineView()

        # Load HTML file
        html_file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "index.html")
        )
        self.browser.setUrl(QUrl.fromLocalFile(html_file_path))

        # Set up WebChannel and Handler
        self.channel = QWebChannel()
        self.handler = Handler(self.browser)
        self.channel.registerObject("handler", self.handler)
        self.browser.page().setWebChannel(self.channel)

        # Layout setup
        layout = QVBoxLayout()
        layout.addWidget(self.browser)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        central_widget = QWidget()
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)
        self.showMaximized()

        # Connect URL change signal
        self.browser.urlChanged.connect(self.handle_url_change)



    def handle_url_change(self, url):
        if not url.isLocalFile():
            self.browser.setUrl(url)

class CustomWebEngineView(QWebEngineView):
    def contextMenuEvent(self, event: QContextMenuEvent):
        # Do nothing to suppress the context menu
        pass
class Handler(QObject):
    load_table = pyqtSignal(str)

    def __init__(self, browser):
        super().__init__()
        self.browser = browser

    @pyqtSlot(str)
    def loadTable(self, table_name):
        # Define columns based on table name
        if table_name == "Products":
            columns = "SNo,Timestamp,ShopID,Brand,ProductName,ProductID,CostPrice,SellingPrice,MRP,Discount,CurrentStock,HistoryStock,SoldStock,GST"
        elif table_name == "Customers":
            columns = "SNo,CustomerID,Timestamp,ShopID,FirstName,LastName,Email,Phone,Address,City,Country"
        elif table_name == "Employees":
            columns = "SNo,EmployeeID,ShopID,FirstName,LastName,Department,Position,Salary,Timestamp"
        elif table_name == "Transactions":
            columns = "SNo,Timestamp,ShopID,TransactionID,Quantity,Discount,Tax,TotalPrice,NetSales,Profit,CustomerID,PaymentMethod,EmployeeID,LocationID"
        elif table_name == "TransactionItems":
            columns = "SNo,TransactionID,ShopID,ProductID,Quantity,Price,Discount,Amount,Taxes,Total"

        keys = columns.split(",")
        data = operations_access.DataManagement().list_items(table_name, columns)
        data_dicts = [dict(zip(keys, item)) for item in data]
        json_data = json.dumps(data_dicts)

        # Pass data to JavaScript function
        self.browser.page().runJavaScript(f"handleDataFromPython({json_data})")


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())
