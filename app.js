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
let apiKey = "1b8e0146b857839afcd0bd1ea1e667ce";
let requestToken;
let username = "desafio4dio";
let password = "123456";
let sessionId;
let listId = "7101979";
let loginButton = (document.getElementById("login-button"));
let searchButton = (document.getElementById("search-button"));
let searchContainer = (document.getElementById("search-container"));
loginButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    yield criarRequestToken();
    yield logar();
    yield criarSessao();
}));
searchButton.addEventListener("click", () => __awaiter(void 0, void 0, void 0, function* () {
    let lista = document.getElementById("lista");
    if (lista) {
        lista.outerHTML = "";
    }
    let element = document.getElementById("search");
    let query = element.value;
    let listaDeFilmes = yield procurarFilme(query);
    let ul = document.createElement("ul");
    ul.id = "lista";
    for (const item of listaDeFilmes) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(item.original_title));
        ul.appendChild(li);
    }
    console.log(listaDeFilmes);
    if (!searchContainer)
        throw new Error("Caixa de busca não encontrado");
    searchContainer.appendChild(ul);
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
function adicionarFilme(filmeId) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`, "GET");
        console.log(result);
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
        let result = yield HttpClient.get(`https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`, "POST", {
            name: nomeDaLista,
            description: descricao,
            language: "pt-br",
        });
        console.log(result);
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
