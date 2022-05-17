// /** @format */
//
// import * as Joi from 'joi';
// import '../../index';
// import { CommonPartType } from '../copareTypes';
//
// const schema = Joi.object({
//   a: Joi.any()
//     .valid('x')
//     .when('b', { is: Joi.exist(), then: Joi.valid('y'), otherwise: Joi.valid('z') }),
//   // .when('c', { is: Joi.number().min(10), then: Joi.forbidden() }),
//   b: Joi.any(),
//   // c: Joi.number(),
// });
//
// type DesiredType =
//   | {
//       a: 'x' | 'y';
//       b: {};
//     }
//   | {
//       a: 'a' | 'z';
//       b: never;
//     };
// type ExtractedType = Joi.pullType<typeof schema>;
// type Type = CommonPartType<DesiredType, ExtractedType>;
//
// let v: ExtractedType = 2;
//
// // v = undefined;
