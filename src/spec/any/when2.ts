// /** @format */
//
// import * as Joi from 'joi';
// import '../../index';
// import { CommonPartType } from '../copareTypes';
//
// const schema = Joi.object({
//   type: Joi.string().valid('A', 'B', 'C').required(), // required if type == 'A'
//   foo: Joi.valid('X', 'Y', 'Z'), // required if type === 'A' and foo !== 'Z'
//   bar: Joi.string()
// }).when(Joi.object({ type: Joi.valid('A'), foo: Joi.not('Z') }), {
//   then: Joi.object({ bar: Joi.required() }),
// });
//
// type DesiredType = number;
// type ExtractedType = Joi.pullType<typeof schema>;
// type Type = CommonPartType<DesiredType, ExtractedType>;
//
// let v: ExtractedType = {
//   bar: 2,
// };
// let v: ExtractedType = {
//   bar: 2,
// };
//
// // v = undefined;
