"use strict";
// let apikey: string;
// let requestToken: string;
// let username: string;
// let password: string;
// let sessionId: string;
// let listId: string = "7101979";
// let loginButton = document.getElementById("login-button");
// let searchButton = document.getElementById("search-button");
// let searchContainer = document.getElementById("search-container");
// if (!loginButton) throw new Error("Botão login não encontrado");
// console.log("entrei");
// loginButton.addEventListener("click", async () => {
//   console.log("entrei");
//   await criarRequestToken();
//   await logar();
//   await criarSessao();
// });
// if (!searchButton) throw new Error("Botão de busca não encontrado");
// searchButton.addEventListener("click", async () => {
//   let lista = document.getElementById("lista");
//   if (lista) {
//     lista.outerHTML = "";
//   }
//   let element: HTMLInputElement = document.getElementById(
//     "search"
//   ) as HTMLInputElement;
//   let query = element.value;
//   let listaDeFilmes = await procurarFilme(query);
//   let ul = document.createElement("ul");
//   ul.id = "lista";
//   for (const item of listaDeFilmes.results) {
//     let li = document.createElement("li");
//     li.appendChild(document.createTextNode(item.original_title));
//     ul.appendChild(li);
//   }
//   console.log(listaDeFilmes);
//   if (!searchContainer) throw new Error("Caixa de busca não encontrado");
//   searchContainer.appendChild(ul);
// });
// function preencherSenha() {
//   password = document.getElementById("senha").value;
//   validateLoginButton();
// }
// function preencherLogin() {
//   username = document.getElementById("login").value;
//   validateLoginButton();
// }
// function preencherApi() {
//   apikey = document.getElementById("api-key").value;
//   validateLoginButton();
// }
// function validateLoginButton() {
//   if (password && username && apikey) {
//     loginButton.disabled = false;
//   } else {
//     loginButton.disabled = true;
//   }
// }
// class HttpClient {
//   static async get({ url, method, body = null }) {
//     return new Promise((resolve, reject) => {
//       let request = new XMLHttpRequest();
//       request.open(method, url, true);
//       request.onload = () => {
//         if (request.status >= 200 && request.status < 300) {
//           resolve(JSON.parse(request.responseText));
//         } else {
//           reject({
//             status: request.status,
//             statusText: request.statusText,
//           });
//         }
//       };
//       request.onerror = () => {
//         reject({
//           status: request.status,
//           statusText: request.statusText,
//         });
//       };
//       if (body) {
//         request.setRequestHeader(
//           "Content-Type",
//           "application/json;charset=UTF-8"
//         );
//         body = JSON.stringify(body);
//       }
//       request.send(body);
//     });
//   }
// }
// async function procurarFilme(query: string): Promise<MovieResult[]> {
//   query = encodeURI(query);
//   console.log(query);
//   let result: MovieResult[] = (await HttpClient.get({
//     url: `https://api.themoviedb.org/3/search/movie?apikey=${apikey}&query=${query}`,
//     method: "GET",
//   })) as MovieResult[];
//   return result;
// }
// async function adicionarFilme(filmeId) {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/movie/${filmeId}?apikey=${apikey}&language=en-US`,
//     method: "GET",
//   });
//   console.log(result);
// }
// async function criarRequestToken() {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/authentication/token/new?apikey=${apikey}`,
//     method: "GET",
//   });
//   requestToken = result.request_token;
// }
// async function logar() {
//   await HttpClient.get({
//     url: `https://api.themoviedb.org/3/authentication/token/validate_with_login?apikey=${apikey}`,
//     method: "POST",
//     body: {
//       username: `${username}`,
//       password: `${password}`,
//       request_token: `${requestToken}`,
//     },
//   });
// }
// async function criarSessao() {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/authentication/session/new?apikey=${apikey}&request_token=${requestToken}`,
//     method: "GET",
//   });
//   sessionId = result.session_id;
// }
// async function criarLista(nomeDaLista, descricao) {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list?apikey=${apikey}&session_id=${sessionId}`,
//     method: "POST",
//     body: {
//       name: nomeDaLista,
//       description: descricao,
//       language: "pt-br",
//     },
//   });
//   console.log(result);
// }
// async function adicionarFilmeNaLista(filmeId, listaId) {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list/${listaId}/add_item?apikey=${apikey}&session_id=${sessionId}`,
//     method: "POST",
//     body: {
//       media_id: filmeId,
//     },
//   });
//   console.log(result);
// }
// async function pegarLista() {
//   let result = await HttpClient.get({
//     url: `https://api.themoviedb.org/3/list/${listId}?apikey=${apikey}`,
//     method: "GET",
//   });
//   console.log(result);
// }
// interface MovieResult {
//   original_title: string;
// }
