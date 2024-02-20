import fs from 'fs';

const { data: products } = JSON.parse(fs.readFileSync("./src/database/products.json"));

export function getAll() {
    return products;
}

export function getOne(id) {
    return products.find(product => product.id === parseInt(id));
}

export function add(product) {
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

