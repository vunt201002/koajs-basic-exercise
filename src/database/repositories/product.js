import fs from 'fs';
import { faker } from "@faker-js/faker";
import { pick } from "../../helpers/helperFunc.js";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue, Filter } from "firebase-admin/firestore";
import serviceAccount from "../../../serviceAccount.json"  assert {type: 'json'};

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

export async function getAll({ limit, sort }) {
  let todosRef = db.collection('todo');

  if(sort && (sort.toLowerCase() === "asc" || sort.toLowerCase() === "desc")) {
    todosRef = todosRef.orderBy("createdAt", sort.toLowerCase());
  }

  if (!isNaN(parseInt(limit))) {
    todosRef = todosRef.limit(parseInt(limit));
  }

  const snapshot = await todosRef.get();
  const todos = [];

  snapshot.forEach(doc => {
    todos.push(doc.data());
  });

  return todos;
}

export async function getOne({ id, fields }) {
  const todoRef = db.collection('todo');
  const snapshot = await todoRef.where('id', '==', parseInt(id)).get();
  if (snapshot.empty) {
    console.log('No matching documents.');
    return;
  }

  let product

  snapshot.forEach(doc => {
    product = {...doc.data()};
  });
  
  if (fields) {
    const selectedFields = fields.split(',');

    const filteredProduct = pick(product, selectedFields)

    product = filteredProduct;
  }

  return product;
}

export async function add(text) {
  const product = {
    text,
    id: faker.number.int({ min: 1, max: 100 }),
    isCompleted: false,
    createdAt: Timestamp.fromDate(new Date())
  }
  
  const res = await db.collection("todo").doc(`${product.id}`).set(product);
  console.log(res); 
}

export async function update(product, id) {
  const updateTodo = await getOne({ id });
  console.log(updateTodo);
  const res = await db.collection("todo").doc(`${updateTodo.id}`).set(product);

  return;
}

export async function remove(id) {
  const deleteTodo = await getOne({ id });

  const res = await db.collection("todo").doc(`${deleteTodo.id}`).delete();

  return;
}

export async function removes(ids) {
  const todoRef = db.collection("todo");
  const snapshot = await todoRef.where("id", "in", ids).get();

  let deleteTodo = [];

  snapshot.forEach(doc => {
    deleteTodo.push(doc.data());
  });

  deleteTodo.forEach(async d => {
    await remove(d.id);
  })
}

export async function updates(productsToUpdate) {
  productsToUpdate.data.forEach(async p => {
    await update(p, p.id);
  })
}
