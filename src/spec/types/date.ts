/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.date();
type Type = Joi.pullType<typeof schema>;

let v: Type = new Date();
v = undefined;

// @ts-expect-error
v = null;
