#! /user/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';

let welcome: string = "*****||| WELCOME TO THE ADVENTURE GAME |||*****";
console.log(chalk.bgYellow.red.bold.italic(`${welcome}`));

// Classes for Player and Opponent
class Player {
    name: string;
    fuel: number = 100;

    constructor(name: string) {
        this.name = name;
    }

    fuelDecrease() {
        this.fuel = Math.max(this.fuel - 25, 0);
    }

    fuelIncrease() {
        this.fuel = 100;
    }
}

class Opponent {
    name: string;
    fuel: number = 100;

    constructor(name: string) {
        this.name = name;
    }

    fuelDecrease() {
        this.fuel = Math.max(this.fuel - 25, 0);
    }
}

// Player and Opponent Selection
async function setupGame() {
    const playerResponse = await inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter your name:',
    });

    const opponentResponse = await inquirer.prompt({
        name: 'select',
        type: 'list',
        message: 'Select one opponent:',
        choices: ['Alion', 'Zombie', 'Ghost'],
    });

    const player = new Player(playerResponse.name);
    const opponent = new Opponent(opponentResponse.select);

    return { player, opponent };
}

// Main Game Loop
async function gameLoop(player: Player, opponent: Opponent) {
    console.log(`${chalk.bold.green.italic(player.name)} VS ${chalk.bold.red.italic(opponent.name)}`);

    while (player.fuel > 0 && opponent.fuel > 0) {
        const action = await inquirer.prompt({
            name: 'opt',
            type: 'list',
            message: 'Select an option:',
            choices: ['Attack', 'Drink', 'Run for your life...'],
        });

        if (action.opt === 'Attack') {
            let num = Math.random();
            if (num > 0.5) {
                opponent.fuelDecrease();
                console.log(chalk.bold.red.bgBlack(`${opponent.name}'s fuel is ${opponent.fuel}`));
            } else {
                player.fuelDecrease();
                console.log(chalk.bold.red.bgBlack(`${player.name}'s fuel is ${player.fuel}`));
            }
        } else if (action.opt === 'Drink') {
            player.fuelIncrease();
            console.log(chalk.bold.green.bgBlack(`You drink a health potion. Your fuel is ${player.fuel}`));
        } else if (action.opt === 'Run for your life...') {
            console.log(chalk.bold.red.bgBlack('GAME OVER'));
            return;
        }

        if (player.fuel <= 0) {
            console.log(chalk.red.bold.italic('You lose, better luck next time.'));
        } else if (opponent.fuel <= 0) {
            console.log(chalk.green.bold.italic('YOU WIN!'));
        }
    }
}

async function main() {
    const { player, opponent } = await setupGame();
    await gameLoop(player, opponent);
}

main();