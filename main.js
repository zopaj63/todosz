const messages = {
    ERROR_MESSAGE_EMPTY: {
        text: "Item can't be empty",
        status: "error"
    },
    ERROR_MESSAGE_ALREDY_EXISTS: {
        text: "Item already exists",
        ststus: "error"
    },
    SUCCESS_MESSAGE_ITEMS_LOADED: {
        text: "Item loaded",
        ststus: "success"
    },
    SUCCESS_MESSAGE_ITEM_CREATED: {
        text: "Item created",
        status: "success"
    },
    SUCCESS_MESSAGE_ITEM_REMOVED: {
        text: "Item removed",
        status: "success"
    },
    EMPTY_TODOS: {
        text: "You don't have any todos yet: Add some",
        status: "success"
    }
};

const {
    ERROR_MESSAGE_EMPTY,
    ERROR_MESSAGE_ALREDY_EXISTS,
    SUCCESS_MESSAGE_ITEMS_LOADED,
    SUCCESS_MESSAGE_ITEM_CREATED,
    SUCCESS_MESSAGE_ITEM_REMOVED,
    EMPTY_TODOS
} = messages;

const button = document.getElementById("add");
const input = document.getElementsByTagName("input")[0];
const LOCAL_STORAGE_KEY = "todos";
const API_URL = "https://kodiraonica-todos.herokuapp.com/api"
let itemValues = [];
loadTodoItems();

button.addEventListener("click", function (e) {
    e.preventDefault();
    addTodoItem(input.value);
});

async function loadTodoItems() {
    await fetch(`${API_URL}/todos`)
        .then((response) => response.json())
        .then((res) => itemValues = res)
        .catch((err) => console.log(err));

    if (itemValues, length > 0) {
        itemValues.forEach((todoItem) => {
            const button = createRemoveButton(todoItem);
            createListItem(button, todoItem.title);
            removeTodoItem(button, todoItem);
            showMessage(
                SUCCESS_MESSAGE_ITEMS_LOADED.text,
                SUCCESS_MESSAGE_ITEMS_LOADED.status
            );
        });
    } else {
        showMessage(EMPTY_TODOS.text, EMPTY_TODOS.status);
    }
}

async function addTodoItem(value) {
    if (value.trim() == "") {
        showMessage(ERROR_MESSAGE_EMPTY.text, ERROR_MESSAGE_EMPTY.status);
        return;
    }

    if (!itemValues.includes(value)) {
        itemValues.push(value);
    } else {
        showMessage(ERROR_MESSAGE_ALREDY_EXISTS.text, ERROR_MESSAGE_ALREDY_EXISTS.status);
        return;
    }

    await fetch(`${API_URL}/todo`, {
        method: "POST",
        body: JSON.stringify({
            title: value
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })

        .then((response) => response.json())
        .then(() => {
            itemValues.push(value);
            const button = createRemoveButton(value);
            createListItem(button, value);
            removeTodoItem(button, value);
            showMessage(SUCCESS_MESSAGE_ITEM_CREATED.text, SUCCESS_MESSAGE_ITEM_CREATED.status);
            resetForm();
        })
        .catch((err) => console.log(err));
}

function resetForm() {
    const form = document.getElementsByTagName("form")[0];
    form.reset();
}

function createRemoveButton(value) {
    const button = document.createElement("button");
    button.innerHTML = "remove";
    button.setAttribute(
        "id",
        `removeBtn-${value.trim().replaceAll(" ", "")}`);
    return button;
}

function createListItem(button, value) {
    const ul = document.getElementsByTagName("ul")[0];
    const li = document.createElement("li");
    ul.appendChild(li);
    li.innerHTML = value;
    li.appendChild(button);
}

function removeTodoItem(button, value) {
    button.addEventListener("click", function () {
        button.parentElement.remove();
        const newItemValues = itemValues.filter((itemValue) => itemValue !== value);
        itemValues = newItemValues;
        showMessage(SUCCESS_MESSAGE_ITEM_REMOVED.text, SUCCESS_MESSAGE_ITEM_REMOVED.status);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItemValues));
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
    }, 3000);
}