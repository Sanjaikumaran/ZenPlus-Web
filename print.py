import os
import platform
import subprocess
from datetime import datetime

# ESC/POS commands
FEED_PAPER = b"\x1B\x64\x05"  # Feed 5 lines (adjust the number as needed)
CUT_PAPER = b"\x1D\x56\x41\x00"  # Full cut command


def generate_bill(items, bill_file):
    # Create a simple bill header
    header = "============================\n"
    header += "      My Store Receipt      \n"
    header += "============================\n"
    header += f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    header += "============================\n"

    # Add items
    item_lines = ""
    total = 0
    for item in items:
        name = item["name"]
        quantity = item["quantity"]
        price = item["price"]
        item_total = quantity * price
        total += item_total
        item_lines += f"{name:20} {quantity} x ${price:.2f} = ${item_total:.2f}\n"

    # Footer with total
    footer = "============================\n"
    footer += f"Total: ${total:.2f}\n"
    footer += "============================\n"
    footer += "   Thank you for shopping!  \n"
    footer += "============================\n"

    # Write to a file
    with open(bill_file, "wb") as file:
        # Write the content
        file.write(header.encode("utf-8"))
        file.write(item_lines.encode("utf-8"))
        file.write(footer.encode("utf-8"))


def print_bill_dynamic(bill_file):
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
                hJob = win32print.StartDocPrinter(hPrinter, 1, ("Bill", None, "RAW"))
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
    # Example items
    items = [
        {"name": "Apple", "quantity": 2, "price": 0.5},
        {"name": "Banana", "quantity": 3, "price": 0.3},
        {"name": "Milk", "quantity": 1, "price": 1.5},
    ]

    bill_file = "bill.txt"

    # Generate and print the bill
    generate_bill(items, bill_file)
    print_bill_dynamic(bill_file)
