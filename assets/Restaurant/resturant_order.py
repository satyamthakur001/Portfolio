print("\n===== Welcome to Smart Restaurant Chatbot =====")
print("Type 'menu' to see menu")
print("Type 'order' to order food")
print("Type 'exit' to quit and see bill\n")

menu = {
    "dishes": {
        "1": ("Pizza", 199),
        "2": ("Burger", 99),
        "3": ("Pasta", 149),
        "4": ("Sandwich", 79),
        "5": ("French Fries", 59),
        "0": ("Exit Dishes Menu", 0)
    },
    "drinks": {
        "6": ("Cold Coffee", 89),
        "7": ("Lemonade", 49),
        "8": ("Soft Drink", 39),
        "9": ("Milkshake", 99),
        "0": ("Exit Drinks Menu", 0)
    }
}

order_list = []

def show_dishes():
    print("\n--- DISHES MENU ---")
    for key, value in menu["dishes"].items():
        if key != "0":
            print(f"{key}. {value[0]} - ₹{value[1]}")
    print("0. Exit Dishes Menu")


def show_drinks():
    print("\n--- DRINKS MENU ---")
    for key, value in menu["drinks"].items():
        if key != "0":
            print(f"{key}. {value[0]} - ₹{value[1]}")
    print("0. Exit Drinks Menu")


def take_order():
    while True:
        print("\nChoose Category:")
        print("1. Dishes")
        print("2. Drinks")
        print("0. Exit Order Menu")

        cat = input("Enter choice: ")

        if cat == "1":
            while True:
                show_dishes()
                choice = input("Select item number: ")

                if choice == "0":
                    break

                if choice in menu["dishes"]:
                    item = menu["dishes"][choice]
                    order_list.append(item)
                    print(f"{item[0]} added to order")
                else:
                    print("Invalid choice")

        elif cat == "2":
            while True:
                show_drinks()
                choice = input("Select item number: ")

                if choice == "0":
                    break

                if choice in menu["drinks"]:
                    item = menu["drinks"][choice]
                    order_list.append(item)
                    print(f"{item[0]} added to order")
                else:
                    print("Invalid choice")

        elif cat == "0":
            break
        else:
            print("Invalid category choice")


def show_bill():
    print("\n===== FINAL BILL =====")
    if not order_list:
        print("No items ordered")
        print("Total Amount: ₹0")
        return

    total = 0
    for item in order_list:
        print(f"{item[0]} - ₹{item[1]}")
        total += item[1]

    print("----------------------")
    print(f"Total Amount to Pay: ₹{total}")
    print("Thank you for visiting our restaurant! 😊")


while True:
    user_input = input("\nYou: ").lower()

    if user_input == "menu":
        print("\nType 'order' to start ordering")

    elif user_input == "order":
        take_order()

    elif user_input == "exit":
        show_bill()
        print("Chatbot: Session Closed. Goodbye! 👋")
        break

    else:
        print("Chatbot: Type 'menu', 'order' or 'exit'")
