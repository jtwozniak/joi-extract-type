/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.number().required().default(2);
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;
v = 0;
v = undefined;

// @ts-expect-error
v = null;
// @ts-expect-error
v = '2';

// @ts-expect-error
const schema2 = Joi.number().required().default('2');
