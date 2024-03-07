/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: SOTONYE WILLIAM-TAMUNOTONYE Student ID: 117398222 Date: 16/02/2024
*
*  Online (Cyclic) Link: https://motionless-dirndl-colt.cyclic.app
*
********************************************************************************/

const express = require("express");
const app = express();
var HTTP_PORT = process.env.PORT || 8080;
const unCountryData = require("./modules/unCountries");
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/un/countries", async (req, res, next) => {
  try {
    let countries;
    const region = req.query.region;
    if (region) {
      countries = await unCountryData.getCountriesByRegion(region);
      res.render("countries", { countries });
    } else {
      countries = await unCountryData.getAllCountries();
      res.render("countries", { countries });
    }
  } catch (error) {
    next(error);
  }
});

app.get("/un/countries/:countryCode", async (req, res, next) => {
  try {
    const countryCode = req.params.countryCode;
    let country = await unCountryData.getCountryByCode(countryCode);
    res.render("country", { country: country });
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
  });
});

unCountryData
  .Initialize()
  .then(() => {
    app.listen(HTTP_PORT, () =>
      console.log(`Server is listening on: ${HTTP_PORT}`)
    );
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
