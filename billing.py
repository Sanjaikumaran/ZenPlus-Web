import sys
import os
import json
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl, QObject, pyqtSlot
from PyQt5.QtWebChannel import QWebChannel
import operations_access  # Ensure this module exists and has the required methods


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set the window title
        self.setWindowTitle("HTML, CSS, and JavaScript in PyQt")

        # Create a QWebEngineView
        self.browser = QWebEngineView()

        # Get the file path of the HTML file
        html_file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "table.html")
        )
        print(f"Loading HTML file from: {html_file_path}")

        # Load the HTML file
        self.browser.setUrl(QUrl.fromLocalFile(html_file_path))

        # Create a QWebChannel and register the handler object
        self.channel = QWebChannel()
        self.handler = Handler()
        self.channel.registerObject("handler", self.handler)
        self.browser.page().setWebChannel(self.channel)

        # Create a layout and add the QWebEngineView to it
        layout = QVBoxLayout()
        layout.addWidget(self.browser)

        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # Create a central widget and set the layout
        central_widget = QWidget()
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)
        self.showMaximized()

        # Connect to the loadFinished signal to call send_data_to_js when the page is loaded
        self.browser.loadFinished.connect(self.send_data_to_js)

    @pyqtSlot()
    def send_data_to_js(self):
        # Data handling logic
        columns = "SNo,Timestamp,ShopID,Brand,ProductName,ProductID,CostPrice,SellingPrice,MRP,Discount,CurrentStock,HistoryStock,SoldStock,GST"
        keys = columns.split(",")
        data = operations_access.DataManagement().list_items("Products", columns)
        data_dicts = [dict(zip(keys, item)) for item in data]
        #print(data_dicts)
        json_data = json.dumps(data_dicts)
        self.browser.page().runJavaScript(f"handleDataFromPython({json_data})")
        # print("Data sent to JavaScript")

    def handle_url_change(self, url):
        # Handle URL changes if needed
        print(f"Navigated to: {url.toString()}")


class Handler(QObject):
    @pyqtSlot(result=str)
    def getData(self):
        return "Data from Python"


# Create an instance of QApplication
app = QApplication(sys.argv)

# Create an instance of MainWindow
window = MainWindow()
window.show()

# Run the application
sys.exit(app.exec_())
