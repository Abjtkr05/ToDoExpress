const items = document.getElementById('tasks')
const enter = document.querySelector('.input');

items.addEventListener('click', removeItem);
enter.addEventListener('keyup', addItems);
items.addEventListener('change', markItems)

function removeItem(event) {
    if (event.target.classList.contains('delete')) {
        if (confirm('Are u sure?')) {
            let data = event.target.parentElement.previousElementSibling.firstElementChild.value
            let R = new XMLHttpRequest();
            R.open('POST', `http://127.0.0.1:3030/todoRemove`)
            R.setRequestHeader('content-type', "application/json")
            R.send(JSON.stringify({text: data}))
            R.addEventListener("load", () => {
                if (R.status == 200) {
                    console.log('hi')
                    let itm = event.target.parentElement.parentElement
                    let hr = event.target.parentElement.parentElement.nextElementSibling
                    itm.remove();
                    hr.remove();
                } else {
                    alert('Error Occurred Please Try Again')
                }
            })

        }
    }
}


function addItems(event) {
    if (!event.target.value) {
        enter.placeholder = "Please Enter Value"
        return;
    }
    if (event.key === "Enter") {
        let val = event.target.value
        let R = new XMLHttpRequest();
        R.open('POST', `http://127.0.0.1:3030/todoo`)
        R.setRequestHeader('content-type', "application/json")
        R.send(JSON.stringify({text: val}))
        location.reload();
    }
}

function markItems(event) {
    let itm = event.target.parentElement.previousElementSibling.firstElementChild
    if (event.target.checked) {
        itm.classList.add('strike')
    } else {
        itm.classList.remove('strike')
    }
}
