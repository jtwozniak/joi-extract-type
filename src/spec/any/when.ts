/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.object({
  a: Joi.any()
    .valid('x')
    .when('b', { is: Joi.string().valid('z'), then: Joi.number(), otherwise: Joi.date() }),
  // .when('c', { is: Joi.number().min(10), then: Joi.forbidden() }),
  b: Joi.any(),
  // c: Joi.number(),
});

type Type = Joi.pullType<typeof schema>;

let v: Type = {
  a: ,
  b: 'z',
};

// v = undefined;
