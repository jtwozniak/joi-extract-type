/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.string().allow(null, 6, 2);
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;
v = undefined;
v = null;
v = 'test';
v = '3';

// @ts-expect-error
v = 3;
