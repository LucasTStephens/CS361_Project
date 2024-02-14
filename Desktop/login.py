import time

# Get credentials
file = open("./login.txt", "r")
time.sleep(1)
username = file.readline().strip()
password = file.readline().strip()
file.close()

# Check credential validity
if (username == "user" and password == "password"):
    file = open("./login.txt", "w")
    file.write("Correct")
else:
    file = open("./login.txt", "w")
    file.write("Incorrect")