const chalk = require('chalk');
const inquirer = require('inquirer');

const fs = require('fs');

operation();

//Function operation - Application

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
      } else if (action === 'Check Balance') {
        checkBalance();
      } else if (action === 'Leave') {
        console.log(
          chalk.bgCyan.black('Thank you for using Gold Bank. Have a nice day.')
        );
        process.exit();
      }
    })
    .catch((err) => console.log(err));
}

//Create Account is split between two functions, one welcomes the user, the other one finally builds the user account

function createAccount() {
  //this one serves some welcoming messages to the user
  console.log(
    chalk.bgCyanBright.black('Congratulations. Thanks for choosing Gold Bank!')
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

//Function that configures deposit options

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

      if (checkAccount(accountName)) {
        inquirer
          .prompt([
            {
              name: 'depositAmount',
              message:
                'Type the amount of money that you want to deposit in your account',
            },
          ])
          .then((answer) => {
            const depositAmount = answer['depositAmount'];

            addAmount(accountName, depositAmount);

            operation();
          });
      }
    });
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('This account does not exist.'));
    return false;
  }

  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    // `{"balance": ${accountData.balance}}`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err);
    }
  );

  console.log(
    `Deposit of ${amount} made successfully. Your current balance is: ` +
      accountData.balance
  );
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r',
  });

  return JSON.parse(accountJSON);
}

function checkBalance() {
  inquirer
    .prompt([
      {
        name: 'accountName',
        message: 'What is your username?',
      },
    ])
    .then((answer) => {
      const accountName = answer['accountName'];

      if (!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log("Username doesn't exists");
        checkBalance();
      }

      const accountFile = getAccount(accountName);
      const accountBalance = accountFile.balance;

      console.log(chalk.bgCyanBright.black('Your current balance is: ' + chalk.bgGreen(accountBalance + ' U$D')))
      // console.log('Your current balance is: ' + accountBalance + ' U$D');
    });
}
