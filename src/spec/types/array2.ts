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
