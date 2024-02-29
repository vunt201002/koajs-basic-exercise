import { pick } from "../../helpers/helperFunc.js";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldPath } from "firebase-admin/firestore";
import serviceAccount from "../../../serviceAccount.json"  assert {type: 'json'};

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
const todoRef = db.collection('todo');

export async function getAll({ limit, sort }) {
  let t = db.collection("todo");

  if(sort && (sort.toLowerCase() === "asc" || sort.toLowerCase() === "desc")) {
    t = todoRef.orderBy("createdAt", sort.toLowerCase());
  }

  if (!isNaN(parseInt(limit))) {
    t = sortTodoRef.limit(parseInt(limit));
  }

  const snapshot = await t.get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function getOne({ id, fields }) {
  const snapshot = await todoRef.doc(id).get();
  let todo;
  if (!snapshot.exists) {
    console.log('No matching documents.');
    return;
  } else {
    todo = snapshot.data();
  }
  
  if (fields) {
    const selectedFields = fields.split(',');

    const filteredProduct = pick(todo, selectedFields)

    todo = filteredProduct;
  }

  return todo;
}

export async function add(text) {
  const todo = {
    text,
    isCompleted: false,
    createdAt: Timestamp.fromDate(new Date())
  }

  const res = await todoRef.add(todo);
  console.log(res); 
}

export async function complete(id) {
  const res = await todoRef.doc(id).update({ isCompleted: true });
  console.log(res);
}

export async function remove(id) {
  const res = await todoRef.doc(id).delete();
  console.log(res);
}

export async function removes(ids) {
  const snapshot = await todoRef.where(FieldPath.documentId(), "in", ids).get();

  let deleteTodo = [];

  deleteTodo = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return Promise.all(
    deleteTodo.map(async d => {
      return remove(d.id);
    })
  );
}

export async function updates(ids) {
  const snapshot = await todoRef.where(FieldPath.documentId(), "in", ids).get();

  const updatedTodo = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return Promise.all(
    updatedTodo.map(async p => {
      return complete(p.id);
    })
  );
}
