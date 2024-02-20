import {
    getAll,
    getOne,
    add,
    update,
    remove
} from "../database/repositories/product.js";

export async function getProducts(ctx) {
    try {
        let products = getAll();

        const { limit, sort } = ctx.query;

        if (limit) {
            const limitNum = parseInt(limit);
            if (!isNaN(limitNum)) {
                products = products.slice(0, limitNum);
            }
        }

        if (sort) {
            if (sort === 'desc') {
                products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            } else if (sort === 'asc') {
                products.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            }
        }

        ctx.body = {
            data: products
        }
    } catch (err) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            data: [],
            error: err.message
        };
    }
}

export async function getProduct(ctx) {
    try {
        const { id } = ctx.params;
        const { fields } = ctx.query;

        let product = getOne(id);

        if (fields) {
            const selectedFields = fields.split(',');

            const filteredProduct = {};
            selectedFields.forEach(field => {
                if (product.hasOwnProperty(field)) {
                    filteredProduct[field] = product[field];
                }
            });

            product = filteredProduct;
        }

        if (product) {
            return ctx.body = {
                data: product
            };
        }
        
        throw new Error("Id not found");
    } catch (err) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            data: [],
            error: err.message
        };
    }
}

export async function addProduct(ctx) {
    try {
        const product = ctx.request.body;
        product.createdAt = new Date();
        add(product);

        ctx.status = 201;
        return ctx.body = {
            success: true
        }
    } catch (err) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            data: [],
            error: err.message
        };
    }
}

export async function updateProduct(ctx) {
    try {
        const { id } = ctx.params;

        update(ctx.request.body, id);

        ctx.status = 200;
        return ctx.body = {
            success: true
        }
    } catch (err) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            data: [],
            error: err.message
        };
    }
}
export async function deleteProduct(ctx) {
    try {
        const { id } = ctx.params;
        remove(id);

        ctx.status = 200;
        return ctx.body = {
            success: true
        }
    } catch (err) {
        ctx.status = 404;
        ctx.body = {
            success: false,
            data: [],
            error: err.message
        };
    }
}

