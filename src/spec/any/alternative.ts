/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.alternatives(Joi.number(), Joi.string());
// const schema = Joi.alternatives([Joi.number(), Joi.string()]);
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;
// @ts-expect-error
v = undefined;
// @ts-expect-error
v = null;
v = 'test';
v = '3';
v = 3;

const schema2 = Joi.alternatives([Joi.number(), Joi.string()]);
type Type2 = Joi.pullType<typeof schema2>;

let v2: Type2 = 2;
// @ts-expect-error
v2 = undefined;
// @ts-expect-error
v2 = null;
v2 = 'test';
v2 = '3';
v2 = 3;
