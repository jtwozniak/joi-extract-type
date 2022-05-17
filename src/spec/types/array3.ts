/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.array().items(
  Joi.array().items(Joi.number(), Joi.string()).required(),
  Joi.string().required()
);

type Type = Joi.pullType<typeof schema>;

let v: Type = [];
v = ['2'];
v = ['2', ['test', 2]];
v = undefined;

// Array will remove undefined form union type even if we done set required() for array items
// @ts-expect-error
v = ['2', ['test', 2, undefined]];
// @ts-expect-error
v = ['2', ['test', 2, new Date()]];
// @ts-expect-error
v = null;
