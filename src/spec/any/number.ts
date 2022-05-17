/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.number();
type Type = Joi.pullType<typeof schema>;

let v: Type = 1;
v = 2;
v = undefined;

// @ts-expect-error
v = null;
// @ts-expect-error
v = '2'
