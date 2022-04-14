const messages = {
    ERROR_MESSAGE_EMPTY: {
        text: "Item can't be empty",
        status: "error"
    },
    ERROR_MESSAGE_ALREADY_EXISTS: {
        text: "Item already exists",
        status: "error"
    },
    ERROR_MESSAGE_SMTH_WENT_WRONG: {
        text: "Something went wrong",
        status: "error"
    },
    SUCCESS_MESSAGE_ITEM_REMOVED: {
        text: "Item removed",
        status: "success"
    },
    SUCCESS_MESSAGE_ITEM_ADDED: {
        text: "Item added",
        status: "success"
    },
    EMPTY_TODOS: {
        text: "You don't have any todos yet! Add new todo :)",
        status: "success"
    }
}

const {
    ERROR_MESSAGE_EMPTY,
    ERROR_MESSAGE_ALREADY_EXISTS,
    ERROR_MESSAGE_SMTH_WENT_WRONG,
    SUCCESS_MESSAGE_ITEM_REMOVED,
    SUCCESS_MESSAGE_ITEM_ADDED,
    EMPTY_TODOS
} = messages;

const API_URL = "https://kodiraonica-todos.herokuapp.com/api";

const button = document.getElementById("add");
const input = document.getElementsByTagName("input")[0];
let itemValues;

loadTodoItems();

button.addEventListener("click", function (e) {
    e.preventDefault();
    addTodoItem(input.value)
});

async function loadTodoItems() {
    await fetch(`${API_URL}/todos`)
        .then((response) => response.json())
        .then((json) => itemValues = json.slice(0, 4))
        .catch((err) => console.log(err))

    if (itemValues.length > 0) {
        itemValues.forEach((todoValue) => {
            const button = createRemoveButton(todoValue._id);
            createListItem(button, todoValue.title);
            removeTodoItem(button, todoValue._id);
        });
    } else {
        showMessage(EMPTY_TODOS.text, EMPTY_TODOS.status);

    }
}

async function addTodoItem(value) {
    let button;
    const isTodoEmpty = value.trim() == "";
    const todoAlreadyExists = itemValues.filter((itemValue) => {
        if (itemValue.title == value) {
            return true;
        }
    });

    if (todoAlreadyExists.length > 0) {
        showMessage(ERROR_MESSAGE_ALREADY_EXISTS.text, ERROR_MESSAGE_ALREADY_EXISTS.status);
        return;
    }

    if (isTodoEmpty) {
        showMessage(ERROR_MESSAGE_EMPTY.text, ERROR_MESSAGE_EMPTY.status);
        return;
    }
    await fetch(`${API_URL}/todo`, {
        method: 'POST',
        body: JSON.stringify({
            title: value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((json) => {
            itemValues.push(value);
            button = createRemoveButton(json._id)
            showMessage(SUCCESS_MESSAGE_ITEM_ADDED.text, SUCCESS_MESSAGE_ITEM_ADDED.status);
            removeTodoItem(button, button.getAttribute("id"));
            createListItem(button, value);
        })
        .catch((err) => console.log(err))

    resetForm();
}

function resetForm() {
    const form = document.getElementsByTagName("form")[0];
    form.reset();
}

function createListItem(button, value) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const ul = document.getElementsByTagName("ul")[0];
    ul.appendChild(li);
    span.innerHTML = value;
    li.appendChild(span);
    li.appendChild(button);
}

function createRemoveButton(value) {
    const button = document.createElement("button");
    button.innerHTML = "remove";
    button.setAttribute("class", "removeBtn")
    button.setAttribute("id", value)
    return button;
}

function removeTodoItem(button, value) {
    button.addEventListener("click", async function () {
        button.parentElement.remove();
        await fetch(`${API_URL}/delete/${value}`, {
            method: 'DELETE',
        }).then((res) => {
            if (res.status == 200) {
                const newItemValues = itemValues.filter((item) => item !== value);
                itemValues = newItemValues;
                showMessage(SUCCESS_MESSAGE_ITEM_REMOVED.text, SUCCESS_MESSAGE_ITEM_REMOVED.status)
            } else {
                showMessage(ERROR_MESSAGE_SMTH_WENT_WRONG.text, ERROR_MESSAGE_SMTH_WENT_WRONG.status)
            }
        });
    });
}

function showMessage(message, status) {
    const err = document.getElementsByClassName(status);
    if (err.length > 0) {
        err[0].innerHTML = message;
        return false;
    }
    const div = document.createElement("div");
    const body = document.getElementsByTagName("body")[0];
    div.setAttribute("class", status);
    body.append(div);
    div.innerHTML = message;

    setTimeout(() => {
        div.remove();
    }, 5000)
}