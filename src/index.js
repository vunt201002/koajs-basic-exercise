import Koa from "koa";
import { koaBody } from "koa-body";
import render from 'koa-ejs';
import cors from '@koa/cors';
import koaBodyParser from "koa-bodyparser";

import router from "./routes/product.js";

const app = new Koa();

app.use(cors());
app.use(koaBody());
app.use(koaBodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

render(app, {
  root: "./src/view",
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
})

app.listen(5000);