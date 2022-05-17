/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.boolean();
type Type = Joi.pullType<typeof schema>;

let v: Type = true;
v = undefined;

// @ts-expect-error
v = null;
