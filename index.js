require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

//exo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function shortenUrl(url) {
  // Calculer la somme des caractères ASCII de l'URL
  const sum = url.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Convertir la somme en une chaîne et la tronquer pour obtenir une courte représentation
  const shortId = sum.toString().slice(0, 3);

  return shortId;
}

let urlArray = [];
let item = {};

function expandUrl(shortUrl) {
  urlArray.forEach((element) => {
    if (element.short_url === shortUrl) {
      item.longUrl = element.original_url;
    }
  });
  return item.longUrl;
}

function isValidURL(url) {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return urlRegex.test(url);
}

app.post("/api/shorturl", function (req, res) {
  const url = req.body.url;
  if (!isValidURL(url)) {
    res.json({ error: "invalid url" });
  } else {
    const shortUrl = shortenUrl(url);
    const result = { original_url: url, short_url: shortUrl };
    urlArray.push(result);
    res.json(result);
  }
});

app.get("/api/shorturl/:shortUrl", (req, res) => {
  const shortUrl = req.params.shortUrl;
  const longUrl = expandUrl(shortUrl);
  res.redirect(longUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
