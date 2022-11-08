const items = document.getElementById('tasks')
const enter = document.querySelector('.input');
const logout = document.getElementById('username');
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
        R.open('POST', `/todoo`)
        R.setRequestHeader('content-type', "application/json")
        R.send(JSON.stringify({text: val}))
        R.addEventListener('load', () => {
            if (R.status == 200) {
                addToList(R.responseText)
            } else {
                alert('Error Occoured')
            }
        })
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

function addToList(val) {
    let div = document.createElement('div');
    div.className = 'task';
    let div2 = document.createElement('div')
    div2.className = 'content'
    let input = document.createElement("input");
    input.type = "text";
    input.className = "text";
    input.setAttribute('value', val)
    input.setAttribute('readonly', true)
    div2.appendChild(input)
    div.appendChild(div2);
    let div3 = document.createElement('div')
    div3.className = 'actions'
    let input1 = document.createElement("input");
    input1.className = 'checkbox'
    input1.setAttribute('type', 'checkbox')
    let button = document.createElement("button");
    button.className = 'delete'
    let x = document.createTextNode('X');
    button.appendChild(x)
    div3.appendChild(input1)
    div3.appendChild(button)
    div.appendChild(div3)
    items.appendChild(div)
    let hr = document.createElement('hr')
    items.appendChild(hr)
    enter.value = ''
    enter.placeholder = "I need to..."
}

let R = new XMLHttpRequest();
R.open('GET', '/todoo');
R.send();
R.addEventListener('load', () => {
    if (R.status === 200) {
        arr = JSON.parse(R.response);
        console.log(arr)
        logout.innerText = `Hi, ${arr[0].createdBy} `
        arr.forEach(todo => {
            if(todo.text !== '')
            addToList(todo.text)
        })
    }
})


