const fs = require("fs");
const http = require("http");
const url = require("url");

const hostName = "127.0.0.1";
const port = 3000;

// SERVER
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }
  return output;
};

const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempProduct = fs.readFileSync(
  "./templates/template-product.html",
  "utf-8"
);

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  //ask
  const { query, pathname } = url.parse(req.url, true);
  // const pathname = req.url;

  switch (pathname) {
    // Overview page
    case "/":
    case "/overview":
      res.writeHead(200, {
        "Content-type": "text/html",
      });
      const cardHTML = dataObj
        .map((el) => replaceTemplate(tempCard, el))
        .join("");
      const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHTML);
      // console.log(cardHTML);
      res.end(output);
      break;

    // Product page
    case "/product":
      {
        res.writeHead(404, { "Content-type": "text/html" });
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
      }
      break;
    // API
    case "/api":
      res.writeHead(200, {
        "Content-type": "application/json",
      });
      console.log(data);
      res.end(data);
      break;
    // Not found
    default:
      res.writeHead(404, {
        "Content-type": "text/html",
        "my-own-header": "hello-world",
      });
      res.end("<h1>Page not found!</h1>");
  }
});

server.listen(port, hostName, () => {
  console.log(`Server running at http://${hostName}:${port}`);
});
