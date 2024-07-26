import sys
import os
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QWidget, QPushButton
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtCore import QUrl, QObject, pyqtSlot
from PyQt5.QtWebChannel import QWebChannel
import json

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set the window title
        self.setWindowTitle("HTML, CSS, and JavaScript in PyQt")

        # Create a QWebEngineView
        self.browser = QWebEngineView()

        # Get the file path of the HTML file
        html_file_path = os.path.abspath(
            os.path.join(os.path.dirname(__file__), "index.html")
        )
        print(html_file_path)

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
        
        # Add a button to send data to JavaScript
        button = QPushButton("Send Data to JavaScript")
        button.clicked.connect(self.send_data_to_js)
        layout.addWidget(button)

        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(0)

        # Create a central widget and set the layout
        central_widget = QWidget()
        central_widget.setLayout(layout)
        self.setCentralWidget(central_widget)
        # self.showFullScreen()
        self.showMaximized()

    @pyqtSlot()
    def send_data_to_js(self):
        data = [
            { "name": "Product1", "price": 100, "id": "001", "brand": "BrandA" },
            { "name": "Product2", "price": 200, "id": "002", "brand": "BrandB" },
            { "name": "Product3", "price": 150, "id": "003", "brand": "BrandC" }
        ]
        json_data = json.dumps(data)
        self.browser.page().runJavaScript(f'handleDataFromPython({json_data})')

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
