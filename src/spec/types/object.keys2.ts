/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.object()
  .keys({
    test: Joi.number(),
    test2: Joi.number().required(),

    dimensions: Joi.object({
      height: Joi.number().integer(),
      width: Joi.number().integer(),
    }).required(),
  })
  .required();

type Type = Joi.pullType<typeof schema>;

let v: Type = { test2: 2, dimensions: { height: 2, width: 3 } };
