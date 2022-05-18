/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.number().required();
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;

// @ts-expect-error
v = undefined;


const schema2 = Joi.required();
type Type2 = Joi.pullType<typeof schema2>;
let v2: Type2 = new Date();

// @ts-expect-error
v2 = undefined;
