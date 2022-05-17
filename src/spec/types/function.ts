/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.func();
type Type = Joi.pullType<typeof schema>;

let v: Type = () => {};
v = undefined;

// @ts-expect-error
v = 1;
// @ts-expect-error
v = null;
