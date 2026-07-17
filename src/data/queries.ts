import database from './model.ts';



const exists = database
    .prepare("SELECT id FROM Trade WHERE id = ?")
    .get(1);


if (!exists) {

    database.prepare(
        "INSERT INTO Trade (id, price) VALUES (?, ?)"
    ).run(1,);
}



const price = database.prepare("SELECT price FROM Trade WHERE id = ?").get(1)?.price;


export { price };