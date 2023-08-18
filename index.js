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
          'Deposit',
          'Check Balance',
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
      } else if (action === 'Deposit') {
        deposit();
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
        buildAccount(); //here we return to the beginning of the function
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

function deposit() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'What is your username?',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName'];

      if (!checkAccount(accountName)) {
        return deposit();
      }
    });

  // if (fs.existsSync(`accounts/${accountName}.json`)) {
  //   inquirer
  //     .prompt([
  //       {
  //         name: 'depositValue',
  //         message: 'Please choose how much money you want to deposit.',
  //       },
  //     ])
  //     .then((answer) => {
  //       const depositValue = answer['depositValue'];
  //       console.log(depositValue);
  //     });
  // }
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('This account does not exist.'))
    return false;
  }

  return true;
}
