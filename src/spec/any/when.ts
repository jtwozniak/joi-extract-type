// /** @format */
//
// import * as Joi from 'joi';
// import '../../index';
//
// const schema = Joi.object({
//   a: Joi.any().valid('x').when('b', { is: 'z', then: Joi.number(), otherwise: Joi.date() }),
//   // .when('c', { is: Joi.number().min(10), then: Joi.forbidden() }),
//   b: Joi.any(),
//   c: Joi.number(),
// });
//
// type Type = Joi.pullType<typeof schema>;
//
// type ResolveUnion<T> = {
//   [K in keyof T]: [K, T[K]];
// }[keyof T]; // TODO: ['a', WhenType] | ['b', any] | ['c', number]
//
// let v: ResolveUnion<Type> = ['b', 'test'];
// v = ['c', 123];
// v = ['a', { key: 'b', is: 'z', then: 123, else: new Date() }];
//
// type SimpleKeys<T extends [string, any]> = Exclude<T, [string, Joi.WhenType<any, any, any, any>]>;
//
// type ResolveType<T, U = ResolveUnion<T>, SK = SimpleKeys<U>> = U;
//
// type SchemaValueType = ResolveType<Type>;
//
// // type Test111 =
// //   | {
// //       a: any;
// //       b: 1;
// //     }
// //   | {
// //       a: 'a';
// //       b: 2;
// //     }
// //   | {
// //       a: 'a';
// //       b: 3;
// //     };
// //
// // let tett: Test111 = {
// //   a: 'b',
// //   b: 3,
// // };
//
// // }type Resolved = Resolve<Type>
// //
// // let v: Resolved =
//
// // v = undefined;
