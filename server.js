const express = require("express"); //Using express on top of nodejs

//Configurations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const parser = require("@solidity-parser/parser");
const port = process.env.PORT || 3001;

//Function to parse the solidity code
const parseContract = (contract, type) => {
  console.log(contract);
  if (type === "imports") {
    let imports = [];
    contract.children.forEach((child) => {
      if (child.type === "ImportDirective") {
        imports.push(child.path);
      }
    });
    return imports;
  } else if (type === "contracts") {
    let contracts = [];
    contract.children.forEach((child) => {
      if (child.type === "ContractDefinition") {
        contracts.push(child.name);
      }
    });
    return contracts;
  } else {
    return "wrong type parameter";
  }
};

//Post method
app.post("/analyze", function (req, res) {
  const code = req.body.code;
  console.log(code);
  try {
    const parsedCode = parser.parse(code);
    res.send({
      imports: parseContract(parsedCode, "imports"),
      contracts: parseContract(parsedCode, "contracts"),
    });
  } catch (e) {
    if (e instanceof parser.ParserError) {
      console.error(e.errors);
    }
  }
});

//Initial page
app.get("/", function (req, res) {
  res.send("Hello to my API\n please go to /analyze to get the instructions");
});

app.get("/analyze", function (req, res) {
  res.send(
    `Create a post method (I used postman for the process)
    Assuming you are using postman:
    under the body add a key named code and a value of your contract.
    Then you will see the result in the section at the bottom on postman
    `
  );
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
