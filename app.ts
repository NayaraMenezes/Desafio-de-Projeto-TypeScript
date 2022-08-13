let apiKey: string = "1b8e0146b857839afcd0bd1ea1e667ce";
let requestToken: string;
let username: string = "desafio4dio";
let password: string = "123456";
let sessionId: number;
let listId: string = "7101979";

let loginButton: HTMLInputElement = <HTMLInputElement>(
  document.getElementById("login-button")
);
let searchButton: HTMLElement = <HTMLElement>(
  document.getElementById("search-button")
);
let searchContainer: HTMLElement = <HTMLElement>(
  document.getElementById("search-container")
);

loginButton.addEventListener("click", async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
});

searchButton.addEventListener("click", async () => {
  let lista = document.getElementById("lista");
  if (lista) {
    lista.outerHTML = "";
  }
  let element: HTMLInputElement = document.getElementById(
    "search"
  ) as HTMLInputElement;
  let query = element.value;
  let listaDeFilmes = await procurarFilme(query);
  let ul = document.createElement("ul");
  ul.id = "lista";
  for (const item of listaDeFilmes) {
    let li = document.createElement("li");
    li.appendChild(document.createTextNode(item.original_title));
    ul.appendChild(li);
  }

  console.log(listaDeFilmes);

  if (!searchContainer) throw new Error("Caixa de busca não encontrado");
  searchContainer.appendChild(ul);
});

function preencherSenha() {
  password = (document.getElementById("senha") as HTMLInputElement).value;
  validateLoginButton();
}

function preencherLogin() {
  username = (document.getElementById("login") as HTMLInputElement).value;
  validateLoginButton();
}

function preencherApi() {
  apiKey = (document.getElementById("api-key") as HTMLInputElement).value;
  validateLoginButton();
}

function validateLoginButton() {
  if (password && username && apiKey) {
    loginButton.disabled = false;
  } else {
    loginButton.disabled = true;
  }
}

class HttpClient {
  static async get(url: string, method: string, body: any | null = null) {
    return new Promise((resolve, reject) => {
      let request = new XMLHttpRequest();
      request.open(method, url, true);

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText));
        } else {
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
        request.setRequestHeader(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
        body = JSON.stringify(body);
      }
      request.send(body);
    });
  }
}

async function procurarFilme(query: string): Promise<MovieResult[]> {
  query = encodeURI(query);
  console.log(query);
  let result = (await HttpClient.get(
    `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`,
    "GET"
  )) as any;
  return result.results as MovieResult[];
}

async function adicionarFilme(filmeId: string) {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=en-US`,
    "GET"
  );
  console.log(result);
}

async function criarRequestToken() {
  let result: RequestTokenResult = (await HttpClient.get(
    `https://api.themoviedb.org/3/authentication/token/new?api_key=${apiKey}`,
    "GET"
  )) as RequestTokenResult;
  requestToken = result.request_token;
}

async function logar() {
  await HttpClient.get(
    `https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${apiKey}`,
    "POST",
    {
      username: `${username}`,
      password: `${password}`,
      request_token: `${requestToken}`,
    }
  );
}

async function criarSessao() {
  let result: SessionResult = (await HttpClient.get(
    `https://api.themoviedb.org/3/authentication/session/new?api_key=${apiKey}&request_token=${requestToken}`,
    "GET"
  )) as SessionResult;
  sessionId = result.session_id;
}

async function criarLista(nomeDaLista: string, descricao: string) {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    "POST",
    {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br",
    }
  );
  console.log(result);
}

async function adicionarFilmeNaLista(filmeId: number, listaId: number) {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/list/${listaId}/add_item?api_key=${apiKey}&session_id=${sessionId}`,
    "POST",
    {
      media_id: filmeId,
    }
  );
  console.log(result);
}

async function pegarLista() {
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/list/${listId}?api_key=${apiKey}`,
    "GET"
  );
  console.log(result);
}

interface MovieResult {
  original_title: string;
}

interface RequestTokenResult {
  request_token: string;
}
interface SessionResult {
  session_id: number;
}
