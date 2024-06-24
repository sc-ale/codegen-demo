
// receive messages and forward to the display method
window.addEventListener('message', async function(ev) {
    let data = ev.data
    if(data.type != "chat") {
        return
    }
    console.log(data);
    fetch("/api/my/mastrogpt/display", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
    .then(r => r.text())
    .then(t => {
        console.log(t)
        if(t !=  "") {
            let content =  document.getElementById("_display_container_");
            content.innerHTML = t; // Vulnerable to XSS attacks
        }
    })
    .catch(e => {
        content.innerHTML="<h1>Error!</h1><p>Check logs for details.</p>"
        console.log(e)
    })
})


window.addEventListener('click', function(event) {
    if (event.target.matches("#sv-srvlss-fun-btn")) {
        event.preventDefault();
        nameFunction = document.getElementById("nameFun2sv").value;
        if (nameFunction == "") {
            document.getElementById("_display_container_").appendChild(document.createTextNode("Please provide a name for the function"));
            return
        }
        
        let infoFunction = getCode()
        infoFunction = {name: nameFunction, ...infoFunction}

        fetch("/api/my/mastrogpt/saveFunction", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(infoFunction)
        })
        .then(r => {
            if (r.ok) {
                if (!document.getElementById("invoke-srvless-fun")) {
                    createInvokeButton(nameFunction);
                    createInputParameters();
                    createResultTextArea();
                }
            }
        })
        .catch(e => {
            content.innerHTML="<h1>Error!</h1><p>Check logs for details.</p>"
            console.log(e)
        })
    }
});

// get the code for the function to save
function getCode() {
    let language = "python:310";
    let code = sessionStorage.getItem("code");
    let res = {kind: language, code: code};
    return res;
}

// invoke the function with the given parameters and display the result in the textarea
function invokeFunction(nameFunction, params) {
    let invocation = {nameFunction: nameFunction, params: params};
    fetch("/api/my/mastrogpt/testServerlessFunction", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(invocation)
    })
    .then( r  => r.json())
    .then(r => {
        let result = JSON.stringify(r);
        document.getElementById("functionResult").value = result;
    })
}

// create the button to use when invoking the function
function createInvokeButton(nameFunction) {
    let button2test = document.createElement("button");
    button2test.innerHTML = "Invoke function";
    button2test.setAttribute("style", "margin-left: 2rem;")
    button2test.setAttribute("id", "invoke-srvless-fun")
    button2test.addEventListener("click", function() {
        invokeFunction(nameFunction, parseParamters())
    })
    document.getElementById("sv-srvlss-fun-btns").appendChild(button2test);
}

// create the input field for the parameters
function createInputParameters() {
    let inputParmeters = document.createElement("input");
    inputParmeters.setAttribute("type", "text");
    inputParmeters.setAttribute("id", "paramsInput");
    inputParmeters.setAttribute("placeholder", "Enter parameters as NAME=VALUE, separated by commas");
    inputParmeters.setAttribute("style", "margin-top: 2rem; width: 100%;");
    document.getElementById("sv-srvlss-fun-btns").appendChild(inputParmeters);
}

// create the textarea to display the result of the function
function createResultTextArea() {
    let textArea = document.createElement("textarea");
    textArea.placeholder = "Function result";
    textArea.id = "functionResult";
    textArea.setAttribute("readonly", true);
    textArea.setAttribute("style", "width: 100%; height: 8rem; margin-top: 1rem;");
    document.getElementById("sv-srvlss-fun-btns").appendChild(textArea);
}

// parse the parameters from the input field
function parseParamters() {
    const inputText = document.getElementById("paramsInput").value;
    const pairs = inputText.split(',');
    const paramsDict = {};

    pairs.forEach(pair => {
        const [name, value] = pair.split('=').map(part => part.trim());
        paramsDict[name] = value;
    });

    return paramsDict;
}