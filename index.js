const chalk = require("chalk");
const inquirer = require("inquirer");

const fs = require("fs");

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "Choose an option",
        choices: [
          "Create an Account",
          "Check Balance",
          "Deposit",
          "Withdraw",
          "Leave",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      console.log(action);

      if (action === "Create an Account") {
        createAccount();
      }
    })
    .catch((err) => console.log(err));
}

function createAccount() {
  console.log(
    chalk.bgGreen.black("Congratulations. Thanks for choosing our bank!")
  );
  console.log(chalk.green("Fill the following fields with your personal data"));
}
