/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.string();
type Type = Joi.pullType<typeof schema>;

let v: Type = 'string';
v = undefined;

// @ts-expect-error
v = 2;
