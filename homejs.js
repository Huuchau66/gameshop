//Game API
const URL_GAMEAPI = `https://cs-steam-api-production.up.railway.app/api/`;

let currentSearch = "";
let currentGenre = "";
let currenntTag = "";

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

//Click Home/about/cart
const about = document.querySelector(`#about`);
about.addEventListener(`click`, () => {
  renderAboutus();
});
//List game by search
const bntSearch = document.querySelector("#Search-bnt");
bntSearch.addEventListener("click", () => {
  currentSearch = document.querySelector("#Search").value;
  const query = `search=${currentSearch}`;

  renderListOfGame(query);
});
//List of genres
const ListOfGenres = async () => {
  try {
    const reponse = await fetch(`${URL_GAMEAPI}genres`);
    const data = await reponse.json();
    return data;
  } catch (error) {
    console.log(`error`, error);
  }
};
// Render to List
const renderListOfGenres = async () => {
  try {
    const data = await ListOfGenres();
    const List = document.querySelector(".category");

    data.genres.forEach((genres) => {
      const x = document.createElement("div");
      x.innerHTML = `<label for=${genres.name}>
        <button class="genge"  id =${genres.name} value="${genres.name}" >
        ${genres.name}(${genres.count})</br></label> 
      `;
      List.appendChild(x);
    });

    document.querySelectorAll(".genge").forEach((cb) => {
      cb.addEventListener("click", (e) => {
        document.querySelector("#Search").value="";
        currentGenre = e.target.value;
        const query = `&genre=${currentGenre}`;
        renderListOfGame(query);
        if (currentGenre) {
          document.querySelector(`#title`).textContent = currentGenre;
        } else {
          document.querySelector(`#title`).textContent = "All Games";
        }
      });
    });
  } catch (error) {
    console.log(`error`, error);
  }
};

renderListOfGenres(); //*
//ListOfTags
const ListOfTags = async () => {
  try {
    const reponse = await fetch(`${URL_GAMEAPI}tags`);
    const data = await reponse.json();
    return data;
  } catch (error) {
    console.log(`error`, error);
  }
};
//ListOfTags render
const ListOfTagsRender = async () => {
  try {
    const data = await ListOfTags();
    const List = document.querySelector("#selectTags");
    data.tags.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag.name;
      option.textContent = `${tag.name} (${tag.count})`;
      List.appendChild(option);
    });
  } catch (error) {
    console.log(`error`, error);
  }
};
ListOfTagsRender();

const selectbox = document.querySelector(`#selectTags`);
selectbox.addEventListener("change", (e) => {
  currenntTag = e.target.value;
  const query = `&tag=${currenntTag}`;
  document.querySelector(`#title`).textContent = currenntTag;
  renderListOfGame(query);
});
// List of games
const ListOfGame = async (query = "") => {
  try {
    const reponse = await fetch(
      `${URL_GAMEAPI}games?${query}&limit=100&offset=0`
    );
    const data = await reponse.json();
    return data;
  } catch (error) {
    console.log(`error`, error);
  }
};
const renderListOfGame = async (query = "") => {
  try {
    const data = await ListOfGame(query);
    const List = document.querySelector("#grid");
    List.innerHTML = "";
    data.games.forEach((games) => {
      const x = document.createElement("a");
      x.classList.add("card");
      x.href = "#";

      x.innerHTML = ` <div> 
      <img src=${games.headerImage} />
      <p>${games.name}</p>
      <span class="price">$${games.price}</span>
         <button class="addtocart">🛒</button>
        </div>`;

        const btn = x.querySelector(".addtocart");
btn.addEventListener("click", (e) => {
  e.preventDefault(); 
   e.stopPropagation(); 
  addToCart(games);
});
      List.appendChild(x);

      x.addEventListener("click", (e) => {
        e.preventDefault();
        renderGameDetail(games);
      });
    });
  } catch (error) {
    const List = document.querySelector("#grid");
    List.innerHTML =
      "An error has occurred, please refresh the page or contact us.";
    console.log(`error`, error);
  }
};
renderListOfGame();
// Render to List Best of all time
const ListOfBestGame = async () => {
  try {
    const reponse = await fetch(
      `${URL_GAMEAPI}games?genre=Action&limit=10&offset=0`
    );
    const data = await reponse.json();

    return data;
  } catch (error) {
    console.log(`error`, error);
  }
};

const renderListOfBestGame = async () => {
  try {
    const data = await ListOfBestGame();
    const List = document.querySelector("#best");
    List.innerHTML = "";

    data.games.forEach((games) => {
      const x = document.createElement("div");
      x.classList.add("besttrack");
      x.innerHTML = ` <div class="track"><img src=${games.headerImage} />
      <p>${games.name}</p>
      <span class="price">$${games.price} </span>
       </div>
        `;
      List.appendChild(x);

      x.addEventListener("click", (e) => {
        e.preventDefault();
        renderGameDetail(games);
      });
    });
  } catch (error) {
    console.log(`error`, error);
  }
};
renderListOfBestGame();
// Game detail by app ID
const renderGameDetail = (game) => {
  document.querySelector(`#title`).textContent = `Game Detail`;
  const info = document.querySelector(".grid");


  info.innerHTML = `
    <div class="game-detail">
      <img src="${game.headerImage}" />
      <div class="info">
      <h2>${game.name}</h2>
      <p><strong>ID:</strong> ${game.appId}</p>
      <p><strong>Price:</strong> $${game.price}</p> 
      <button class="addtocart">🛒</button>
      <p><strong>DiscountPercent:</strong> ${game.discountPercent}%</p>
      <p><strong>Genres:</strong> ${game.genres}</p>
      <p><strong>ReleaseDate:</strong> ${game.releaseDate}</p>
      <p><strong>Developer:</strong> ${game.developer}</p>
      <p>${game.shortDescription}</p>
      <button id="backBtn">⬅ Back</button>
      </div>
    </div>
  `;
  const btn = document.querySelector(".addtocart");
  btn.addEventListener("click", (e) => {
  e.preventDefault(); 
  e.stopPropagation(); 
  addToCart(game);
});

  document.querySelector("#backBtn").addEventListener("click", () => {
    renderListOfGame();
   
  });
};
// About us
const renderAboutus = () => {
  const about = document.querySelector(`.container`);
  about.innerHTML =
    "This website was developed by me personally. It is not for commercial use. For any inquiries, please contact me at xiao99zhou@gmail.com";
};
//Add to cart

const addToCart = (game) => {
  const cart = getCart();
  const exist = cart.find((item) => item.appId === game.appId);
  if (!exist) {
    cart.push(game);
    saveCart(cart);
    alert("Added to cart!");
  } else {
    alert("Already in cart!");
  }
};

//render cart
const renderCart = () => {
  const cart = getCart();
  const container = document.querySelector(".container");

 container.innerHTML = `
  <h1>Your Cart</h1>
  <div class="cartContainer"></div>
`;

const grid = document.querySelector(".cartContainer");

  if (cart.length === 0) {
    container.innerHTML += "<h1> : Your Cart is empty</h1>";
    return;
  }

  cart.forEach((game) => {
  const item = document.createElement("div");
  item.classList.add("cartItem");

  item.innerHTML = `
    <img src="${game.headerImage}" />
    <p>${game.name}</p>
    <span>$${game.price}</span>
    <button class="remove">❌</button>
  `;
   grid.appendChild(item);
  });

  // remove item
  document.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index;
      const cart = getCart();
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
    });
  });
};
//show cart
const cartBtn = document.querySelector("#cart");
cartBtn.addEventListener("click", () => {
  renderCart();
});
