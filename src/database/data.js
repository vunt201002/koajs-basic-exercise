import { faker } from "@faker-js/faker";
import fs from "fs";

export function createRandomProduct() {
    return {
        id: faker.number.int({ min: 1, max: 10 }),
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        product: faker.commerce.productMaterial(),
        color: faker.color.human(),
        createdAt: new Date(faker.date.recent()),
        image: faker.image.url()
    };
};

export function generateData() {
    const products = faker.helpers.multiple(createRandomProduct, {
        count: 5,
    });

    return fs.writeFileSync("./products.json", JSON.stringify({
        data: products
    }));
};
generateData();
