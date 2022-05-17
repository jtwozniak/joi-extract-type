/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.array();
type Type = Joi.pullType<typeof schema>;

let v: Type = [];
v = [1, '2', null];
v = undefined;

// @ts-expect-error
v = null;
