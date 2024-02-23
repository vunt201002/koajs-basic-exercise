import {
    getAll,
    getOne,
    add,
    update,
    remove,
    updates,
    removes
} from "../database/repositories/product.js";

export async function getProducts(ctx) {
    try {
        const { limit, sort } = ctx.query;
        const products = getAll({ limit, sort });

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

        const product = getOne({ id, fields });

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
        // const product = ctx.request.body;
        // product.createdAt = new Date();

        const { text } = ctx.request.body;
        add(text);

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

export async function updateProducts(ctx) {
    try {
        const products = ctx.request.body;

        updates(products);

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

export async function removeProducts(ctx) {
    try {
        const { ids } = ctx.request.body;
        removes(ids);

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
