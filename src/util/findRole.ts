import * as readline from 'node:readline/promises';


export default async function findRole() {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    const qst = await rl.question('Are you a Seller or a Buyer? ')

    const cleanInput = qst.trim().toLowerCase();

    if (cleanInput === 'buyer') {
        return "buyer"
    } else if (cleanInput === 'seller') {
        return "seller"
    }
    else {
        console.log("no such Role Exist.")
        process.exit(1)
    }
};