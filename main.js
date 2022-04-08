const button = document.getElementById("add");
const input = document.getElementsByTagName("input")[0];
const form = document.getElementsByTagName("form")[0];
const itemValues = [];
button.addEventListener("click", onButtonClick)

function onButtonClick(e) {
    e.preventDefault();
    addTodoItem(input.value)
}

function isEmpty(inputValue) {
    if (inputValue.trim() == "") {
        showErrorMessage("Item can't be empty");
        return true;
    }
    return false;
}

function addTodoItem(inputValue) {
    if (isEmpty(inputValue)) {
        return;
    }

    if (!itemValues.includes(inputValue)) {
        itemValues.push(inputValue)
    } else {
        showErrorMessage("Item already exists");
        return;
    }


    const list = document.getElementsByTagName("ul")[0];
    const listItem = document.createElement("li");
    const button = document.createElement("button");
    listItem.innerHTML = inputValue;
    button.innerHTML = "remove";
    button.setAttribute("id", `removeBtn-${inputValue.trim().replaceAll(" ", "")}`);
    list.appendChild(listItem);
    listItem.appendChild(button);
    form.reset();
    removeTodoItem(button);
}

function removeTodoItem(button) {
    button.addEventListener("click", () => {
        button.parentElement.remove();
    });
}

function showErrorMessage(message) {
    const err = document.getElementsByClassName("error");
    if (err.length > 0) {
        return false;
    }

    const div = document.createElement("div");
    const body = document.getElementsByTagName("body")[0];
    div.setAttribute("class", "error")
    body.append(div);
    message = message == undefined ? "Something is wrong with the item" : message;
    div.innerHTML = `${message}! Try again.`
    setTimeout(() => {
        div.remove();
    }, 3000)
}
