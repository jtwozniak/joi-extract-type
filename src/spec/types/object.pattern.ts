// /** @format */
//
// import * as Joi from 'joi';
// import '../../index';
//
// const schema = Joi.object()
//   // keys will be invalidated
//   .keys({
//     test: Joi.number(),
//     test2: Joi.number().required(),
//     test3: Joi.string().required(),
//   })
//   .pattern('any', Joi.any())
//   .required();
//
// type Obj = {
//   [k: string]: any;
//   test?: number;
//   test2: number;
//   test3: string;
// };
// type Type = Joi.pullType<typeof schema>;
//
// let v: Type = { test2: 2, test3: 't' };
// v = { z: 'z', test2: 2, test3: 'est', y: 2 };
// v = { test: 1, test2: 2, test3: 'test' };
//
// // @ts-expect-error
// v = { test: 2 };
// // @ts-expect-error
// v = null;
// // @ts-expect-error
// v = { test: '1', test2: 2, test3: 'test' };
