import fs from 'fs';
import { faker } from "@faker-js/faker";

const { data: products } = JSON.parse(fs.readFileSync("./src/database/products.json"));

export function getAll({ limit, sort }) {
    let cProducts = products;
    // sort first
    if (sort) {
        if (sort === 'desc') {
            cProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sort === 'asc') {
            cProducts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
    }

    if (limit) {
        const limitNum = parseInt(limit);
        if (!isNaN(limitNum)) {
            cProducts = cProducts.slice(0, limitNum);
        }
    }

    return cProducts;
}

export function getOne({ id, fields }) {
    let product =  products.find(product => product.id === parseInt(id));

    if (fields) {
        const selectedFields = fields.split(',');

        const filteredProduct = {};
        selectedFields.map(field => {
            if (product.hasOwnProperty(field)) {
                filteredProduct[field] = product[field];
            }
        });

        product = filteredProduct;
    }

    return product;
}

export function add(text) {
    const product = {
        text,
        id: faker.number.int({ min: 1, max: 20 }),
        isCompleted: false
    }
    const updateProducts = [product, ...products];

    return fs.writeFileSync("./src/database/products.json", JSON.stringify({
        data: updateProducts
    }));
}

export function update(product, id) {
    let updateProducts = products.filter(product => product.id !== parseInt(id));
    updateProducts = [product, ...updateProducts];

    return fs.writeFileSync("./src/database/products.json", JSON.stringify({
        data: updateProducts
    }));
}

export function remove(id) {
    const deletedProducts = products.filter(product => product.id !== parseInt(id));

    return fs.writeFileSync("./src/database/products.json", JSON.stringify({
        data: deletedProducts
    }));
}

