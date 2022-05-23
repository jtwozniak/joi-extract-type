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

const schema3 = Joi.date()
  .required()
  .default(() => new Date());

type Type3 = Joi.pullType<typeof schema3>;

let v3: Type3 = new Date();

// @ts-expect-error
v3: Type3 = 'test';
