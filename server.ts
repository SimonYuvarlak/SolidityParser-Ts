import express from "express"; // Using express on top of nodejs
// Configurations
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port: number = 3001;

// Function to parse the solidity code
const parseContract = (contract: string, type: string) => {
  if (type === "imports") {
    const imports = contract.match(/import\s*"[^"]*"\s*;/g);
    const importNames = imports.map((i) => {
      return i.match(/"[^"]*"/)[0].replace(/"/g, "");
    });
    return importNames;
  } else if (type === "contracts") {
    const contracts = contract.match(/contract\s+([A-z]|[0-9])+/g);
    const contractNames = contracts.map(c => c.split(" ")[1])
    return contractNames;
  }
};

// Post method
app.post("/analyze", (req: express.Request, res: express.Response) => {
  const code = req.body.code;
  try {
    res.send({
      imports: parseContract(code, "imports"),
      contracts: parseContract(code, "contracts"),
    });
  } catch (e) {
      res.send("error");
  }
});

// Initial page
app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello to my API\n please go to /analyze to get the instructions");
});

app.get("/analyze", (req: express.Request, res: express.Response) => {
  res.send(
    `Create a post method (I used postman for the process)
    Assuming you are using postman:
    under the body add a key named code and a value of your contract.
    Then you will see the result in the section at the bottom on postman
    `
  );
});

app.listen(port);
