export default function addUser(usuarios) {

    console.log(usuarios)

    return
    let li = document.createElement("li");
    li.id = id;
    li.classList.add("user")

    let p = document.createElement("p");
    p.innerText = name;

    let connectBtn = document.createElement("button")
    connectBtn.innerText = "conectar"

    connectBtn.onclick = () => {
        alert("conectando...")
    }

    li.appendChild(p)
    li.appendChild(connectBtn);

    let usersContainer = document.getElementById("users_connected").children[1];
    usersContainer.appendChild(li)
}