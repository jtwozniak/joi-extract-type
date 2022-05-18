/** @format */

import * as Joi from 'joi';
import '../../index';

const schema = Joi.object({
  a: Joi.any().valid('x').when('b', { is: 'z', then: Joi.number(), otherwise: Joi.date() }),
  // .when('c', { is: Joi.number().min(10), then: Joi.forbidden() }),
  b: Joi.any(),
  c: Joi.number(),

  d: Joi.any().valid('x').when('a', { is: Joi.number(), then: Joi.number(), otherwise: Joi.date() }),
}).required();

type Type = Joi.pullType<typeof schema>;

type ResolveUnion<T extends object> = {
  [K in keyof T]: [K, T[K]];
}[keyof T]; // TODO: ['a', WhenType] | ['b', any] | ['c', number]

type ResolveUndefinedUnion<T extends object> = Extract<ResolveUnion<T>, [string, any]>; // remove undefined

let ruu: ResolveUndefinedUnion<Type> = ['b', 123];

// @ts-expect-error
ruu = undefined;

ruu = ['c', 123];
ruu = ['a', { key: 'b', is: 'z', then: 123, else: new Date() }];
ruu = ['d', { key: 'a', is: 123, then: 123, else: new Date() }];


// we have to have loop
// simple: 'b' | 'c'
// whenKeys: 'a' | 'b'
// not affected: simple - when = 'c'

// affected simple = simple and wheKeys = 'b'
// not affected: 'c'
// affected: 'a' | 'b'
// toResolve:
// unresolvable to loop
// extract [key, is] - these will be our cases

// not affected = 'c'
// affected = 'b'
// to resolve = 'a'
// type ExtractCases






//
// type SimpleKeys<T extends [string, any]> = Exclude<T, [string, Joi.WhenType<any, any, any, any>]>;
//
// type ResolveType<T, U = ResolveUnion<T>, SK = SimpleKeys<U>> = U;
//
// type SchemaValueType = ResolveType<Type>;

// type Test111 =
//   | {
//       a: any;
//       b: 1;
//     }
//   | {
//       a: 'a';
//       b: 2;
//     }
//   | {
//       a: 'a';
//       b: 3;
//     };
//
// let tett: Test111 = {
//   a: 'b',
//   b: 3,
// };

// }type Resolved = Resolve<Type>
//
// let v: Resolved =

// v = undefined;
