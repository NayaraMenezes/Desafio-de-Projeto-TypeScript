let apiKey: string = "";
let requestToken: string;
let username: string = "";
let password: string = "";
let sessionId: number;
let listId: number;

let loginButton: HTMLInputElement = <HTMLInputElement>(
  document.getElementById("login-button")
);
let searchButton: HTMLElement = <HTMLElement>(
  document.getElementById("search-button")
);
let searchContainer: HTMLElement = <HTMLElement>(
  document.getElementById("search-container")
);
let addListButton: HTMLElement = <HTMLElement>(
  document.getElementById("add-list-button")
);
let listContainer: HTMLElement = <HTMLElement>(
  document.getElementById("list-container")
);

loginButton.addEventListener("click", async () => {
  await criarRequestToken();
  await logar();
  await criarSessao();
});

searchButton.addEventListener("click", async () => {
  let lista = document.getElementById("lista-busca");
  if (lista) {
    lista.outerHTML = "";
  }
  let element: HTMLInputElement = document.getElementById(
    "search"
  ) as HTMLInputElement;
  let query = element.value;
  let listaDeFilmes = await procurarFilme(query);
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
});

addListButton.addEventListener("click", async () => {
  let lista = document.getElementById("lista-filme");
  if (lista) {
    lista.outerHTML = "";
  }
  let nameElement: HTMLInputElement = document.getElementById(
    "search"
  ) as HTMLInputElement;
  let descriptionElement: HTMLInputElement = document.getElementById(
    "search"
  ) as HTMLInputElement;
  let name = nameElement.value;
  let description = descriptionElement.value;
  let result = await criarLista(name, description);

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

async function adicionarFilme(filme: MovieResult) {
  if (!listId) {
    alert("Cria uma lista para poder incluir itens");
    return;
  }
  let result = await HttpClient.get(
    `https://api.themoviedb.org/3/movie/${filme.id}?api_key=${apiKey}&language=en-US`,
    "GET"
  );
  console.log(result);
  if (!result) {
    alert("falha ao incluir filme");
    return;
  }
  let li = document.createElement("li");
  li.appendChild(document.createTextNode(filme.original_title));
  listContainer.getElementsByTagName("ul")[0].appendChild(li);
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

async function criarLista(
  nomeDaLista: string,
  descricao: string
): Promise<AddListResult> {
  let result: AddListResult = (await HttpClient.get(
    `https://api.themoviedb.org/3/list?api_key=${apiKey}&session_id=${sessionId}`,
    "POST",
    {
      name: nomeDaLista,
      description: descricao,
      language: "pt-br",
    }
  )) as AddListResult;

  return result;
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
  id: number;
  original_title: string;
}

interface RequestTokenResult {
  request_token: string;
}
interface SessionResult {
  session_id: number;
}
interface AddListResult {
  list_id: number;
  status_code: null;
  status_message: string;
  success: boolean;
}
