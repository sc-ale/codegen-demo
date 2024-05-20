
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

        console.log(infoFunction)
        fetch("/api/my/mastrogpt/saveFunction", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(infoFunction)
        })
        .then(r => {
            if (r.ok) {
                if (!document.getElementById("invoke-srvless-fun")) {
                    let button2test = document.createElement("button");
                    button2test.innerHTML = "Invoke function";
                    button2test.setAttribute("style", "margin-left: 2rem;")
                    button2test.setAttribute("id", "invoke-srvless-fun")
                    button2test.addEventListener("click", function() {
                        invokeFunction(infoFunction.name, "")
                    })
                    document.getElementById("sv-srvlss-fun-btns").appendChild(button2test);                
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
    //let language = document.getElementById("language").textContent
    let language = "python:310"
    //let code = document.getElementById("code").textContent
    let code = sessionStorage.getItem("code");
    let res = {kind: language, code: code}
    return res
}

function invokeFunction(nameFunction, params) {
    let invocation = {nameFunction: nameFunction, params: params}
    fetch("/api/my/mastrogpt/testServerlessFunction", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(invocation)
    })
    .then(r => {
        if (r.ok) {
            console.log(r)
        }
    })
}