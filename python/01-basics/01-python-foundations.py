"""
TOPIC: Python Basics — The Foundation
DATE: Fill in today's date

WHAT IS IT (plain English):
  Python is a language that prioritises readability. It uses indentation
  instead of curly braces to define blocks. It is dynamically typed —
  you do not declare variable types. It is interpreted — runs line by line.

JARGON:
  - Dynamically typed: variable types are determined at runtime
  - Interpreted: code is executed directly by the Python interpreter
  - PEP 8: Python's official style guide (snake_case, 4-space indent)
  - Duck typing: if it quacks like a duck, it's a duck
                (if it has the right methods, we don't care what type it is)
  - REPL: Read-Eval-Print Loop (interactive Python shell)

INTERVIEW ONE-LINER:
  "Python is dynamically typed, interpreted, and uses significant whitespace
   for block structure. It follows the principle of readability first —
   there should be one obvious way to do something."

KEY DIFFERENCES FROM JAVASCRIPT:
  - No semicolons (Python uses newlines)
  - No curly braces (Python uses indentation — 4 spaces)
  - True/False capitalised (not true/false)
  - None instead of null
  - and/or/not instead of &&/||/!
  - print() not console.log()
  - def not function
"""

# ============================================================
# 1. VARIABLES AND TYPES
# ============================================================

name = "Aegis"              # str
age = 25                     # int
height = 1.82                # float
is_active = True             # bool (note: capital T)
nothing = None               # NoneType (equivalent to null in JS)

# Python is dynamically typed — no need to declare type
# But you CAN annotate for clarity (doesn't enforce the type)
score: int = 100
label: str = "beginner"

# Type checking
print(type(name))            # <class 'str'>
print(type(age))             # <class 'int'>
print(isinstance(age, int))  # True

# Type conversion
num_str = "42"
num = int(num_str)           # "42" → 42
back = str(num)              # 42  → "42"
as_float = float(num)        # 42  → 42.0


# ============================================================
# 2. STRINGS
# ============================================================

first = "Aegis"
last = "Developer"

# Concatenation
full = first + " " + last

# f-strings (modern, preferred — like template literals in JS)
greeting = f"Hello, {first} {last}!"
calculated = f"Age: {age * 2}"    # expressions work inside {}

# Multiline strings
paragraph = """
This is a
multiline string
in Python.
"""

# String methods
print("hello".upper())         # HELLO
print("  spaces  ".strip())    # spaces
print("hello world".split())   # ['hello', 'world']
print(",".join(["a", "b", "c"])) # a,b,c
print("hello".replace("l", "r")) # herro
print("hello world".startswith("hello"))  # True
print(len("hello"))            # 5


# ============================================================
# 3. COLLECTIONS
# ============================================================

# LIST (mutable, ordered, like JS Array)
fruits = ["apple", "banana", "mango"]
fruits.append("grape")          # add to end
fruits.insert(0, "avocado")     # insert at index
fruits.pop()                     # remove last
fruits.remove("banana")          # remove by value
print(fruits[0])                 # index access
print(fruits[-1])                # last item (Python trick)
print(fruits[1:3])               # slice [start:end] (end exclusive)

# TUPLE (immutable, ordered — like a fixed list)
coords = (10.5, 20.3)
# coords[0] = 5  # TypeError — tuples cannot be modified
x, y = coords    # tuple unpacking

# DICT (mutable, key-value pairs, like JS Object/Map)
user = {
    "name": "Aegis",
    "age": 25,
    "active": True
}
print(user["name"])              # access by key
print(user.get("email", "N/A")) # safe access with default
user["email"] = "aegis@dev.io"  # add new key
del user["active"]               # delete key

# Iterating a dict
for key, value in user.items():
    print(f"{key}: {value}")

# SET (unordered, unique values, like JS Set)
unique = {1, 2, 3, 3, 3}        # {1, 2, 3} — duplicates removed
unique.add(4)
unique.discard(1)
print(2 in unique)               # membership test


# ============================================================
# 4. CONTROL FLOW
# ============================================================

score = 85

# if/elif/else (note: elif, not else if)
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Ternary (conditional expression)
result = "Pass" if score >= 60 else "Fail"

# for loop (iterates over any iterable)
for fruit in fruits:
    print(fruit)

# for with range
for i in range(5):             # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 10, 2):     # 2, 4, 6, 8 (start, stop, step)
    print(i)

# enumerate (get index AND value — very Pythonic)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# while loop
count = 0
while count < 5:
    print(count)
    count += 1

# List comprehension (one-liner for loop that builds a list)
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]
upper_fruits = [f.upper() for f in fruits]


# ============================================================
# 5. FUNCTIONS
# ============================================================

# Basic function
def greet(name):
    return f"Hello, {name}!"

# Default parameters
def greet_with_title(name, title="Developer"):
    return f"Hello, {title} {name}!"

# *args — variable positional arguments
def add_all(*numbers):
    return sum(numbers)

add_all(1, 2, 3)        # 6
add_all(1, 2, 3, 4, 5)  # 15

# **kwargs — variable keyword arguments
def build_profile(**info):
    for key, value in info.items():
        print(f"{key}: {value}")

build_profile(name="Aegis", role="Developer", level="Junior")

# Type hints (PEP 484 — good practice)
def calculate_bmi(weight: float, height: float) -> float:
    return weight / (height ** 2)

# Lambda (anonymous function — like JS arrow functions)
square = lambda x: x ** 2
add = lambda a, b: a + b
print(square(5))   # 25
print(add(3, 4))   # 7

# Useful with built-ins
numbers = [3, 1, 4, 1, 5, 9, 2, 6]
sorted_nums = sorted(numbers)                         # [1, 1, 2, 3, 4, 5, 6, 9]
sorted_desc = sorted(numbers, reverse=True)           # [9, 6, 5, 4, 3, 2, 1, 1]
sorted_by_last = sorted(["bob", "alice", "charlie"],
                         key=lambda x: x[-1])         # sort by last character


# ============================================================
# JS → PYTHON TRANSLATION GUIDE
# ============================================================
"""
JavaScript                    Python
----------------------------  ----------------------------
console.log("hello")          print("hello")
const x = 5                   x = 5
let y = 10                    y = 10
true / false                  True / False
null                          None
undefined                     (no equivalent — check `is None`)
typeof x                      type(x)
x.length                      len(x)
x.push(val)                   x.append(val)
x.map(fn)                     [fn(item) for item in x]   OR map(fn, x)
x.filter(fn)                  [item for item in x if fn(item)]
x.includes(val)               val in x
x.indexOf(val)                x.index(val)
Object.keys(obj)              obj.keys()
Object.values(obj)            obj.values()
{...obj, key: val}            {**obj, "key": val}
[...arr, val]                 [*arr, val]   OR arr + [val]
"""


# ============================================================
# EXERCISES — Complete these before moving on
# ============================================================

# Exercise 1: Create a function that takes a list of numbers
# and returns a new list with only even numbers, squared.
# Input: [1, 2, 3, 4, 5, 6]
# Output: [4, 16, 36]
# Use a list comprehension.
def even_squares(numbers):
    pass  # YOUR CODE HERE


# Exercise 2: Create a function that takes a sentence (string)
# and returns a dictionary counting how many times each word appears.
# Input: "the cat sat on the mat"
# Output: {"the": 2, "cat": 1, "sat": 1, "on": 1, "mat": 1}
def word_count(sentence):
    pass  # YOUR CODE HERE


# Exercise 3: Rewrite this JS code in Python:
# const users = [{name: "Alice", age: 30}, {name: "Bob", age: 25}]
# const names = users.filter(u => u.age >= 28).map(u => u.name)
users = [{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]
# YOUR CODE HERE (one line using list comprehension):


# ============================================================
# MOCK INTERVIEW QUESTIONS
# ============================================================

"""
Q1: "What is the difference between a list and a tuple in Python?"

SAMPLE ANSWER:
"Both are ordered sequences in Python. The key difference is mutability.
Lists are mutable — you can add, remove, or change elements after creation.
Tuples are immutable — once created, their contents cannot change. Tuples
are slightly more memory efficient and can be used as dictionary keys
because they are hashable. I use tuples for data that should not change —
like coordinates, RGB values, or database records. Lists are for collections
I need to modify over time."

---

Q2: "What is a list comprehension and why would you use it?"

SAMPLE ANSWER:
"A list comprehension is a concise way to create a list by applying
an expression to each item in an iterable, optionally filtering with a
condition. For example, `[x**2 for x in range(10) if x % 2 == 0]`
produces the squares of even numbers from 0 to 9. It is preferred over
a for loop with append because it is more readable, more Pythonic, and
often faster due to internal optimisations. However, I avoid them when
the logic is complex — in that case, a regular loop is clearer."

---

Q3: "What does `**kwargs` do in a Python function?"

SAMPLE ANSWER:
"The **kwargs syntax allows a function to accept any number of keyword
arguments. Inside the function, kwargs is a dictionary containing all
the keyword arguments that were passed. This is useful when you want a
flexible function signature — for example, a function that builds an
object from an unknown set of attributes, or a wrapper that passes
arguments through to another function. The name kwargs is a convention —
the double asterisk is the actual syntax."
"""
