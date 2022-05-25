/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.number().valid(2, 3, 4, 8);
type Type = Joi.pullType<typeof schema>;

let v: Type = 2;
v = 3;
v = 4;
v = 8;
v = undefined;

// @ts-expect-error
v = 10;

// @ts-expect-error
v = '10';

const schema2 = Joi.valid(2, '3');
type Type2 = Joi.pullType<typeof schema2>;

let v2: Type2 = 2;
v2 = '3';

// @ts-expect-error
v2 = 4;
// @ts-expect-error
v2 = 8;
// @ts-expect-error
v2 = undefined;

const schema3 = Joi.number().valid([2, 3, 4, 8]);
type Type3 = Joi.pullType<typeof schema3>;

let v1: Type3 = 2;
v1 = 3;
v1 = 4;
v1 = 8;
v1 = undefined;

// @ts-expect-error
v1 = 10;

// @ts-expect-error
v1 = '10';

const valid = Joi.valid(2).default(2);

type T1 = Joi.pullType<typeof valid>;
let t1: T1 = undefined;
t1 = 2;
