/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.array().items(Joi.number().required(), Joi.string().required());
type Type = Joi.pullType<typeof schema>;

let v: Type = [];
v = [1, '2'];
v = undefined;

// @ts-expect-error
v = [1, '2', new Date()];
// @ts-expect-error
v = null;



const schema2 = Joi.array().items(Joi.number().required());
type Type2 = Joi.pullType<typeof schema2>;

let v2: Type2 = [];
v2 = [1];
// @ts-expect-error
v2 = [1, '2'];
v2 = undefined;

// @ts-expect-error
v2 = [1, '2', new Date()];
// @ts-expect-error
v2 = null;
