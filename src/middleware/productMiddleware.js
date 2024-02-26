import yup from 'yup';

export async function validateInputProduct(ctx, next) {
  try {
    const postData = ctx.request.body;
    let schema = yup.object().shape({
      // id: yup.number().positive().integer().required(),
      // name: yup.string().required(),
      // price: yup.string().required(),
      // description: yup.string().required(),
      // product: yup.string().required(),
      // color: yup.string().required(),
      // createdAt: yup.date().required(),
      // image: yup.string().required(),

      // id: yup.number().positive().integer().required(),
      text: yup.string().required(),
      // isCompleted: yup.boolean().required()
    });

    await schema.validate(postData);
    next();
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errors: err.errors,
      errorName: err.name
    }
  }
}