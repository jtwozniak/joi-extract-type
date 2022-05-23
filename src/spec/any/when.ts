// /** @format */
//
// import * as Joi from 'joi';
// import '../../index';
// import { Primitive, ValueOf } from 'ts-essentials';
//
// const schema = Joi.object({
//   a: Joi.any().when('b', { is: Joi.valid('z'), then: Joi.number(), otherwise: Joi.date() }),
//   // .when('c', { is: Joi.number().min(10), then: Joi.forbidden() }),
//   b: Joi.string(),
//   c: Joi.number().required(),
//   // d: Joi.any().when('a', { is: 2, then: Joi.number(), otherwise: Joi.date() }),
//   // e: Joi.any().when('b', { is: 'z', then: Joi.number(), otherwise: Joi.date() }),
//   // f: Joi.any().when('b', { is: 'y', then: Joi.number(), otherwise: Joi.date() }),
//   // g: Joi.any().when('b', { is: 'y', then: Joi.number(), otherwise: Joi.date() }),
// }).required();
//
// type Type = Joi.pullType<typeof schema>;
//
// // Object values to tuple
// type ObjectKeyValuesToTuple<O extends object, T extends any[] = []> = {
//   [K in keyof O]: Exclude<keyof O, K> extends never
//     ? [[K, O[K]], ...T]
//     : ObjectKeyValuesToTuple<Omit<O, K>, [[K, O[K]], ...T]>;
// }[keyof O];
//
// type TupleTest2 = ObjectKeyValuesToTuple<Pick<Type, 'a' | 'c'>>;
//
// const tupleTest2: TupleTest2 = [
//   [
//     'a',
//     {
//       is: 'z',
//       key: 'b',
//       then: 2,
//       else: new Date(),
//     },
//   ],
//   ['c', 123],
// ];
//
// ///////////////
//
// type GenericWhen = Joi.WhenType<string, any, any, any>;
// type GenericKeyWhen = [string, GenericWhen];
// type GenericKeyMaybeWhen = [string, any];
//
// type PrimitiveNonUndefined = Exclude<Primitive, undefined>;
// type ResolvePrimitive<T> = T extends PrimitiveNonUndefined ? T : never;
//
// //////
// type GetMandatoryKeys<T> = {
//   [P in keyof T]: T[P] extends Exclude<T[P], undefined> ? P : never;
// }[keyof T];
// type MandatoryProps<T> = Pick<T, GetMandatoryKeys<T>>;
// type ResolveOptional<T> = Partial<T> & MandatoryProps<T>;
//
// // type ResolveSimpleSingle<ResolveKey, T> = ResolveOptional<{
// //   [P in ResolveKey & string]: T;
// // }>;
// type ResolveSimpleSingle<ResolveKey, T> = {
//   [P in ResolveKey & string]: T;
// };
//
// type ResolveSimple<T, Resolved, Deep = false> = T extends [infer ResolveKey, infer T1]
//   ? Resolved extends [infer A, ...infer B]
//     ? B extends object[]
//       ? [A & ResolveSimpleSingle<ResolveKey, T1>, ...ResolveSimple<T, B, true>]
//       : never
//     : Deep extends false
//     ? [ResolveSimpleSingle<ResolveKey, T1>]
//     : []
//   : never;
//
// type ResolveSimpleTest1 = ResolveSimple<['a', number | undefined], []>;
// const resolveSimpleTest1: ResolveSimpleTest1 = [{ a: 123 }];
// const resolveSimpleTest11: ResolveSimpleTest1 = [{ a: undefined }];
//
// type ResolveSimpleTest2 = ResolveSimple<['a', number | undefined], [{ d: string }, { c: boolean }]>;
// const resolveSimpleTest21: ResolveSimpleTest2 = [
//   { a: undefined, d: '123' },
//   { a: undefined, c: false },
// ];
// const resolveSimpleTest22: ResolveSimpleTest2 = [
//   { a: 123, d: '123' },
//   // @ts-expect-error
//   { a: 321, d: '123' },
// ];
// // @ts-expect-error
// const resolveSimpleTest23: ResolveSimpleTest2 = [{ a: 123, d: '123' }, { a: 321, c: false }, {}];
// // const resolveSimpleTest4: ResolveSimpleTest2 = [{ a: 123 }];
//
// type ResolveSimpleTest3 = ResolveSimple<
//   ['a', number],
//   [{ c: string; d: 2 }, { c: string; d: string }]
// >;
// const resolveSimpleTest31: ResolveSimpleTest3 = [
//   // @ts-expect-error
//   { a: 123, c: '123', d: '123' },
//   { a: 123, c: '123', d: '123' },
// ];
// const resolveSimpleTest32: ResolveSimpleTest3 = [
//   { a: 123, c: '123', d: 2 },
//   // @ts-expect-error
//   { a: 123, c: '123', d: 2 },
// ];
//
// type ResolveSimpleTest4 = ResolveSimple<['a', number | undefined], []>;
// const resolveSimpleTest4: ResolveSimpleTest1 = [{ a: undefined }];
// const resolveSimpleTest5: ResolveSimpleTest1 = [{ a: 123 }];
//
// //////
//
// type CanResolveComplex<T extends GenericWhen, Resolved extends object[]> = T extends Joi.WhenType<
//   infer Key,
//   infer T1,
//   infer T2,
//   infer T3
// >
//   ? Resolved extends [infer A, ...infer B]
//     ? Key extends keyof A
//       ? true
//       : false
//     : false
//   : false;
//
// const t: CanResolveComplex<
//   Joi.WhenType<'klucz', any, any, any>,
//   [{ a: string; klucz: string }, { klucz: string }]
// > = true;
//
// //////
//
// type ResolveComplexSingle<T extends GenericKeyMaybeWhen, A> = T extends [
//   infer ResolveKey,
//   Joi.WhenType<infer Key, infer T1, infer T2, infer T3>
// ]
//   ? Key extends keyof A
//     ? ResolveKey extends string
//       ? [
//           Omit<A, Key> & {
//             [P in Key]: ResolvePrimitive<T1>;
//           } & {
//             [P in ResolveKey]: T2;
//           },
//           Omit<A, Key> & {
//             /***
//  // TS is not handling inverse cases, if 'is' type is a primitive
//  // we will produce incorrect union
//  // Exclude<any, '2'> = any
//  // Exclude<number, '2'> = number ...
//           { a: number, b: 2 } | { a: Date, b: any }
//           { a: new Date(), b: 2} // will be accepted as it will mach second case
//           { a: number, b: string } // will be forbidden
//  // so it is half broken types that cannot be used with extract
// */
//             [P in Key]: Exclude<A[Key], T1>;
//           } & {
//             [P in ResolveKey]: T3;
//           }
//         ]
//       : [never]
//     : [never]
//   : [never];
//
// type ResolveComplexSingle1 = ResolveComplexSingle<
//   ['a', Joi.WhenType<'b', 2, string, Date>],
//   { b: number }
// >;
//
// const resolveComplexSingle1: ResolveComplexSingle1 = [
//   { a: '123', b: 2 },
//   { a: new Date(), b: 123 },
// ];
//
// // type ResolveComplexSingle2 = ResolveComplexSingle<
// //   ['a', Joi.WhenType<'b', 2, string, Date>],
// //   { b: any }
// //   >;
// //
// // const resolveComplexSingle2: ResolveComplexSingle2 = [
// //   { a: '123', b: 2 },
// //   // @ts-expect-error
// //   { a: new Date(), b: 2 },  // exclude case with never
// //   { a: new Date(), b: 123 },
// // ];
//
// //////
//
// type TT = Exclude<number, 2>;
// const t123: TT = 2; // this is not working
//
// type TupleToUnion<T extends any[]> = Exclude<T[number], 'any'>;
//
// // three loops, remove the same types, for performance reasons
// type FilterIfInUnion<
//   T extends object[],
//   ResolvedUnion,
//   Resolved extends object[] = []
// > = T extends [infer A, ...infer B]
//   ? B extends object[]
//     ? A extends object
//       ? A extends ResolvedUnion
//         ? FilterIfInUnion<B, ResolvedUnion, Resolved>
//         : FilterIfInUnion<B, ResolvedUnion | A, [...Resolved, A]>
//       : never
//     : never
//   : Resolved;
//
// type SimpleUnion = { a: number } | { b: string } | { c: Date };
//
// type UnionSimplify1 = FilterIfInUnion<[{ a: Date }], SimpleUnion>;
// const unionSimplify1: UnionSimplify1 = [{ a: new Date() }];
//
// type UnionSimplify2 = FilterIfInUnion<[{ a: number }], SimpleUnion>;
// const unionSimplify2: UnionSimplify2 = [];
//
// type UnionSimplify3 = FilterIfInUnion<[{ a: number }, { a: Date }], SimpleUnion>;
// const unionSimplify3: UnionSimplify3 = [{ a: new Date() }];
//
// //////////
//
// type ResolveComplex<
//   T extends GenericKeyWhen,
//   ResolvedOld extends object[],
//   ResolvedNew extends object[] = []
// > = ResolvedOld extends [infer A, ...infer B]
//   ? B extends object[]
//     ? ResolveComplex<
//         T,
//         B,
//         // przywroc na tych saam
//         [...ResolvedNew, ...FilterIfInUnion<ResolveComplexSingle<T, A>, TupleToUnion<ResolvedNew>>]
//         // [...ResolvedNew, ResolveComplexSingle<T, A>]
//       >
//     : FilterIfInUnion<ResolveComplexSingle<T, A>, TupleToUnion<ResolvedNew>>
//   : ResolvedNew;
//
// type ResolveComplexTest1 = ResolveComplex<
//   ['a', Joi.WhenType<'b', 2, number, Date>],
//   [{ b: any; c: number }]
// >;
//
// type Union = TupleToUnion<ResolveComplexTest1>;
//
// const rct1: ResolveComplexTest1 = [
//   {
//     a: 123,
//     b: 2,
//     c: 123,
//   },
//   {
//     a: new Date(),
//     b: 123,
//     c: 123,
//   },
// ];
//
// const resolveComplexTest1: Union = { a: 123, b: 2, c: 2 };
// const resolveComplexTest23: Union = { a: new Date(), b: 2, c: 2 }; // should fail, half broken
// const resolveComplexTest25: Union = { a: new Date(), b: 123, c: 2 };
// // @ts-expect-error
// const resolveComplexTest24: Union = { a: new Date(), b: 123, c: 's' }; // half working
// // @ts-expect-error
// const resolveComplexTest3: Union = { a: 123, b: 2, c: 2, twojstary: 2 };
// // @ts-expect-error
// const resolveComplexTest4: Union = 123;
// // @ts-expect-error
// const resolveComplexTest5: Union = {};
//
// ////////////
// // simplify case!!
// type ResolveComplexTest2 = ResolveComplex<
//   ['a', Joi.WhenType<'b', 2, number, Date>],
//   [{ b: any, c: number }, { b: any, c: number }] // extra copy should be reduced
// >;
//
// const resolveComplexTest2: ResolveComplexTest2 = [
//   { a: 123, b: 2, c: 123 },
//   { a: new Date(), b: 223, c: 123 },
// ];
//
// //////
//
// type ExpandCases<
//   T,
//   Resolved extends object[] = [],
//   NotResolved extends GenericKeyMaybeWhen[] = [],
//   NotResolvedLength extends number = 0
// > = T extends GenericKeyMaybeWhen[]
//   ? T extends [infer KV, ...infer TTable]
//     ? KV extends [infer Key, infer A] // A might be undefined in simple case, need to collet it from KV
//       ? A extends GenericWhen // if complex
//         ? CanResolveComplex<A, Resolved> extends true
//           ? KV extends GenericKeyWhen
//             ? ExpandCases<TTable, ResolveComplex<KV, Resolved>, NotResolved, NotResolvedLength>
//             : never
//           : // Resolved
//           KV extends GenericKeyMaybeWhen
//           ? ExpandCases<TTable, Resolved, [...NotResolved, KV], NotResolvedLength>
//           : never
//         : ExpandCases<TTable, ResolveSimple<KV, Resolved>, NotResolved, NotResolvedLength>
//       : never
//     : // : never
//       Resolved // emptied list
//   : never;
//
// type ResolveWhen<T extends object> = ExpandCases<ObjectKeyValuesToTuple<T>>;
// // type ResolveWhen<T extends object> = TupleToUnion<ExpandCases<ObjectKeyValuesToTuple<T>>>;
// // type ResolveWhenTuple<T> = TupleToUnion<T>;
//
// // type ResolvedObject = ResolveWhenTuple<ResolveWhen<Type>>;
// type ResolvedObject = ResolveWhen<Type>;
//
// // lets do it!!!
// let finalTest: ResolvedObject = [
//   {
//     c: 123,
//     b: 'z',
//     a: 123,
//   },
//   {
//     c: 123,
//     b: 'zasdf',
//     a: new Date(),
//   },
// ];
