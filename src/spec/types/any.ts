/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.any();
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;
v = undefined;
v = 'string';
v = new Date();
v = null;
