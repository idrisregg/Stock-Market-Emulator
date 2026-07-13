import database from './model.ts';

function varyPrice() {
    return Math.floor(Math.random() * (780 - 98 + 1)) + 98;
}

const exists = database
    .prepare("SELECT id FROM Trade WHERE id = ?")
    .get(1);


if (!exists) {
    const value = varyPrice();

    database.prepare(
        "INSERT INTO Trade (id, price) VALUES (?, ?)"
    ).run(1, value);
}

//randomly update the price on every refresh to simulate a changing Demand Price
function updateRandomValue() {
    const value = varyPrice();

    database.prepare(
        "UPDATE Trade SET price = ? WHERE id = ?"
    ).run(value, 1);
}

updateRandomValue();

const price = database.prepare("SELECT price FROM Trade WHERE id = ?").get(1)?.price;


export { price };