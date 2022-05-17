/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.number().required();
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;

// @ts-expect-error
v = undefined;

