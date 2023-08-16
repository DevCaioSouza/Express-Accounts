const chalk = require('chalk');
const inquirer = require('inquirer');

const fs = require('fs');

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Choose an option',
        choices: [
          'Create an Account',
          'Check Balance',
          'Deposit',
          'Withdraw',
          'Leave',
        ],
      },
    ])
    .then((answer) => {
      const action = answer['action'];

      console.log(action);

      if (action === 'Create an Account') {
        createAccount();
      } else if (action === 'Leave') {
        console.log(chalk.bgCyan.black('Teste'));
        process.exit();
      }
    })
    .catch((err) => console.log(err));
}

function createAccount() {
  //this one serves some welcoming messages to the user
  console.log(
    chalk.bgGreen.black('Congratulations. Thanks for choosing our bank!')
  );
  console.log(chalk.green('Fill the following fields with your personal data'));

  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'Define your username: ',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName'];

      console.info(accountName);

      if (!fs.existsSync('accounts')) {
        fs.mkdirSync('accounts');
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(
          chalk.bgRed.black(
            'User already exists. Please choose another username'
          )
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${accountName}.json`,
        '{"balance": 0}',
        function (err) {
          console.log(err);
        }
      );

      console.log(chalk.green('Account sucessfully created.'));
      operation();
    })
    .catch((err) => console.log(err));
}
