/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.object({
  a: Joi.string().valid('A', 'B', 'C').required(), // required if type == 'A'
  foo: Joi.valid('X', 'Y', 'Z'), // required if type === 'A' and foo !== 'Z'
  bar: Joi.string().when('type', { is: 'A', then: Joi.number(), otherwise: Joi.date() }),
});

type Type = Joi.pullType<typeof schema>;

let v: Type = {
  a: 'A',
  foo: 'Z',
  bar: 2,
};

v = {
  a: 'A',
  foo: 'Z',
  bar: new Date(),
};
