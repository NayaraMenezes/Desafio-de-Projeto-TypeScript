"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let apiKey = "";
let requestToken;
let username = "";
let password = "";
let sessionId;
let listId;
let loginButton = (document.getElementById("login-button"));
let searchButton = (document.getElementById("search-button"));
let searchContainer = (document.getElementById("search-container"));
let addListButton = (document.getElementById("add-list-button"));
let listContainer = (document.getElementById("list-container"));
loginButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
}));
searchButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista-busca");
    if (lista) {
        lista.outerHTML = "";
    }
    let element = document.getElementById("search");
    let query = element.value;
    let listaDeFilmes = yield procurarFilme(query);
    let ul = document.createElement("ul");
    ul.id = "lista-busca";
    for (const item of listaDeFilmes) {
        let li = document.createElement("li");
        let addButton = document.createElement("button");
        addButton.onclick = () => {
            adicionarFilme(item);
        };
        addButton.appendChild(document.createTextNode("+"));
        li.appendChild(document.createTextNode(item.original_title + " "));
        li.appendChild(addButton);
        ul.appendChild(li);
    }
    console.log(listaDeFilmes);
    searchContainer.appendChild(ul);
}));
addListButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista-filme");
    if (lista) {
        lista.outerHTML = "";
    }
    let nameElement = document.getElementById("search");
    let descriptionElement = document.getElementById("search");
    let name = nameElement.value;
    let description = descriptionElement.value;
    let result = yield criarLista(name, description);
    if (!result.success) {
        alert(result.status_message);
        return;
    }
    alert("deu bom !");
    listId = result.list_id;
    let ul = document.createElement("ul");
    ul.id = "lista-filme";
    let tituloLista = document.createElement("H3");
    tituloLista.appendChild(document.createTextNode("lista: " + name));
    listContainer.appendChild(tituloLista);
    listContainer.appendChild(ul);
}));
function preencherSenha() {
    password = document.getElementById("senha").value;
    validateLoginButton();
}
function preencherLogin() {
    username = document.getElementById("login").value;
    validateLoginButton();
}
function preencherApi() {
    apiKey = document.getElementById("api-key").value;
    validateLoginButton();
}
function validateLoginButton() {
    if (password && username && apiKey) {
        loginButton.disabled = false;
    }
    else {
        loginButton.disabled = true;
    }
}
class HttpClient {
    static get(url, method, body = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let request = new XMLHttpRequest();
                request.open(method, url, true);
                request.onload = () => {
                    if (request.status >= 200 && request.status < 300) {
                        resolve(JSON.parse(request.responseText));
                    }
                    else {
                        reject({
                            status: request.status,
                            statusText: request.statusText,
                        });
                    }
                };
                request.onerror = () => {
                    reject({
                        status: request.status,
                        statusText: request.statusText,
                    });
                };
                if (body) {
                    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    body = JSON.stringify(body);
                }
                request.send(body);
            });
        });
    }
}
function procurarFilme(query) {
    return __awaiter(this, void 0, void 0, function* () {
        query = encodeURI(query);
        console.log(query);
        let result = (yield HttpClient.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`, "GET"));
        return result.results;
    });
}
function adicionarFilme(filme) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!listId) {
            alert("Cria uma lista para poder incluir itens");
            return;
        }
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/movie/${filme.id}?api_key=${apiKey}&language=en-US`, "GET");
        console.log(result);
        if (!result) {
            alert("falha ao incluir filme");
            return;
        }
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(filme.original_title));
        listContainer.getElementsByTagName("ul")[0].appendChild(li);
    });
}
function criarRequestToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = (yield HttpClient.get(`https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`, "GET"));
        requestToken = result.request_token;
    });
}
function logar() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HttpClient.get(`https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`, "POST", {
            username: `${username}`,
            password: `${password}`,
            request_token: `${requestToken}`,
        });
    });
}
function criarSessao() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = (yield HttpClient.get(`https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`, "GET"));
        sessionId = result.session_id;
    });
}
function criarLista(nomeDaLista, descricao) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = (yield HttpClient.get(`https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`, "POST", {
            name: nomeDaLista,
            description: descricao,
            language: "pt-br",
        }));
        return result;
    });
}
function adicionarFilmeNaLista(filmeId, listaId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`, "POST", {
            media_id: filmeId,
        });
        console.log(result);
    });
}
function pegarLista() {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`, "GET");
        console.log(result);
    });
}
