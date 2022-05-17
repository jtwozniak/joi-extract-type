/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.number().required().optional();
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;
v = undefined;

// @ts-expect-error
v = null;
