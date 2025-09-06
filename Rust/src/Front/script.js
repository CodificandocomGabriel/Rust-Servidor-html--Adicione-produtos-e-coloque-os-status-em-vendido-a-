let produtos;
let statusProduto;

window.addEventListener("DOMContentLoaded", async () => {
    const resProdutos = await fetch("http://127.0.0.1:1122/listarProdutos")
    produtos = await resProdutos.json();

    const resStatus = await fetch("http://127.0.0.1:1122/listarStatus")
    statusProduto = await resStatus.json();

    CriarProduto();
})

async function add() {
    let inputValue = document.querySelector(".inputAdd").value;
    await fetch("http://127.0.0.1:1122/add", {
        method: "POST",
        headers: {"Content-Type": "text/plain"},
        body: inputValue,
    })

    window.location.href = '/Rust/src/Front/index.html';
}

function CriarProduto() {
    let containerDiv = document.querySelector(".containerDivs");

    for(let i = 0; i < produtos.length; i++) {
        let div = document.createElement('div');
        div.className = "DivProdutos";

        let divCima = document.createElement('div');
        divCima.className = "DivCimaBaixo";

        let titulo = document.createElement('p');
        titulo.innerText = produtos[i]
        titulo.className = "titulo";

        let divBaixo = document.createElement('div');
        divBaixo.className = "DivCimaBaixo";

        let statusText = document.createElement("p");
        statusText.className = "Status"
        statusText.innerText = statusProduto[i];

        let btDeletar = document.createElement("button");
        btDeletar.textContent = "Deletar";
        btDeletar.className = "btDeletar";
        btDeletar.setAttribute("index", i);

        let btVender = document.createElement("button");
        btVender.textContent = "Vender";
        btVender.className = "btVender";
        btVender.setAttribute("index", i);

        containerDiv.appendChild(div);
        div.appendChild(divCima);
        divCima.appendChild(titulo);
        div.appendChild(divBaixo);
        divBaixo.appendChild(statusText);
        div.appendChild(btDeletar);
        div.appendChild(btVender);

        btDeletar.addEventListener("click", async () => {
            await fetch("http://127.0.0.1:1122/deletar", {
                method: "POST",
                headers: {"Content-Type": "text/plain"},
                body: btDeletar.getAttribute("index"),
            })

            window.location.href = '/Rust/src/Front/index.html'
        })

        btVender.addEventListener("click", async () => {
            console.log("Ola")
            await fetch("http://127.0.0.1:1122/vender", {
                method: "POST",
                headers: {"Content-Type": "text/plain"},
                body: btVender.getAttribute("index"),
            })

            window.location.href = '/Rust/src/Front/index.html'
        })
    }
}