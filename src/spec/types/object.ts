// /** @format */
//
// import * as Joi from 'joi';
// import '../../index';
//
// const schema = Joi.object({
//   test: Joi.number(),
//   test2: Joi.number().required(),
//   test3: Joi.string().required(),
// });
//
// type Type = Joi.pullType<typeof schema>;
//
// let v: Type = { test2: 2, test3: 't' };
// v = { test: 1, test2: 2, test3: 'est' };
// v = undefined;
//
//
// // @ts-expect-error
// v = { test: 2 };
// // @ts-expect-error
// v = { test: 1, test2: 2, test3: 'test' };
// // @ts-expect-error
// v = null;
