import fs from 'fs';
import { faker } from "@faker-js/faker";

const { data: products } = JSON.parse(fs.readFileSync("./src/database/products.json"));

function pick(object, keys) {
    return keys.reduce((obj, key) => {
       if (object && object.hasOwnProperty(key)) {
          obj[key] = object[key];
       }
       return obj;
     }, {});
}

export function getAll({ limit, sort }) {
    let cProducts = products;
    // sort first
    if (sort) {
        if (sort === 'desc') {
            cProducts.sort((a, b) => new Date(b.id) - new Date(a.id));
        } else if (sort === 'asc') {
            cProducts.sort((a, b) => new Date(a.id) - new Date(b.id));
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

        const filteredProduct = pick(product, selectedFields)

        // selectedFields.map(field => {
        //     if (product.hasOwnProperty(field)) {
        //         filteredProduct[field] = product[field];
        //     }
        // });

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
    let updateProducts = products.map(p => {
        if (p.id === parseInt(id)) {
            return product;
        } else {
            return p;
        }
    });

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

export function removes(ids) {
    const deletedProducts = products.filter(product => !ids.includes(product.id));
    console.log(ids);

    return fs.writeFileSync("./src/database/products.json", JSON.stringify({
        data: deletedProducts
    }));
}

export function updates(productsToUpdate) {
    const updatedProducts = products.map(product => {
        const updatedProduct = productsToUpdate.find(p => p.id === product.id);
        if (updatedProduct) {
            return updatedProduct;
        }
        return product;
    });

    return fs.writeFileSync("./src/database/products.json", JSON.stringify({
        data: updatedProducts
    }));
}
