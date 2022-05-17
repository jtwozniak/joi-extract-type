/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.number().valid(2, 3, 4, 8);
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;
v = 3;
v = 4;
v = 8;
v = undefined;

// @ts-expect-error
v = 10;

// @ts-expect-error
v = '10';
