/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.object()
  .keys({
    test: Joi.number(),
    test2: Joi.number().required(),
    test3: Joi.string(),
    array: Joi.array().items(Joi.date(), Joi.func()),
  })
  .required();

type Type = Joi.pullType<typeof schema>;

let v: Type = { test2: 2, test3: 't' };
v = { test: 1, test2: 2, test3: 'est' };
v = { test: 1, test2: 2, test3: '2', array: [new Date()] };
v = { test: 1, test2: 2, test3: '2', array: [() => {}] };
v = { test: 1, test2: 2, test3: '2', array: [new Date(), () => {}] };
v = { test: 1, test2: 2, test3: '2', array: [new Date(), () => {}, new Date()] };

// @ts-expect-error
v = { test: 1, test2: 2, test3: 2, array: [new Date(), () => {}, new Date(), null] };

// @ts-expect-error
v = { test: 2 };

// @ts-expect-error
v = { test: 1, test2: 2, test3: 2 };

// @ts-expect-error
v = null;
