/** @format */

import * as Joi from 'joi';
import '../../index';
import { Primitive, ValueOf } from 'ts-essentials';

const schema = Joi.object({
  a: Joi.any().when('b', { is: 'z', then: Joi.number(), otherwise: Joi.date() }),
  // .when('c', { is: Joi.number().min(10), then: Joi.forbidden() }),
  b: Joi.any(),
  c: Joi.number(),
  d: Joi.any().when('a', { is: 2, then: Joi.number(), otherwise: Joi.date() }),
  e: Joi.any().when('b', { is: 'z', then: Joi.number(), otherwise: Joi.date() }),
  f: Joi.any().when('b', { is: 'y', then: Joi.number(), otherwise: Joi.date() }),
}).required();

type Type = Joi.pullType<typeof schema>;

// Object values to tuple
type ObjectKeyValuesToTuple<O extends object, T extends any[] = []> = {
  [K in keyof O]: Exclude<keyof O, K> extends never
    ? [[K, O[K]], ...T]
    : ObjectKeyValuesToTuple<Omit<O, K>, [[K, O[K]], ...T]>;
}[keyof O];

type TupleTest2 = ObjectKeyValuesToTuple<Pick<Type, 'a' | 'c'>>;

const tupleTest2: TupleTest2 = [
  [
    'a',
    {
      is: 'b',
      key: 'b',
      then: 2,
      else: new Date(),
    },
  ],
  ['c', 123],
];

///////////////

type GenericKeyMaybeWhen = [string, any];
type GenericWhen = Joi.WhenType<string, any, any, any>;

type PrimitiveNonUndefined = Exclude<Primitive, undefined>;
type ResolvePrimitive<T> = T extends PrimitiveNonUndefined ? T : never;

//////

type ResolveSimpleSingle<ResolveKey, T> = { [P in ResolveKey & string]: T };
type ResolveSimple<T, Resolved extends object[], Deep = false> = T extends [
  infer ResolveKey,
  infer T1
]
  ? Resolved extends [infer A, ...infer B]
    ? B extends object[]
      ? [A & ResolveSimpleSingle<ResolveKey, T1>, ...ResolveSimple<T, B, true>]
      : never
    : Deep extends false
    ? [ResolveSimpleSingle<ResolveKey, T1>]
    : []
  : never;

type ResolveSimpleTest1 = ResolveSimple<['a', number], []>;
const resolveSimpleTest1: ResolveSimpleTest1 = [{ a: 123 }];

type ResolveSimpleTest2 = ResolveSimple<['a', number], [{ d: string }]>;
const resolveSimpleTest2: ResolveSimpleTest2 = [{ a: 123, d: '123' }];

type ResolveSimpleTest3 = ResolveSimple<['a', number], [{ c: string }, { d: string }]>;
const resolveSimpleTest3: ResolveSimpleTest3 = [
  { a: 123, c: '123' },
  { a: 123, d: '123' },
];

//////

type CanResolveComplex<T extends GenericWhen, Resolved extends object[]> = T extends Joi.WhenType<
  infer Key,
  infer T1,
  infer T2,
  infer T3
>
  ? Resolved extends [infer A, ...infer B]
    ? Key extends keyof A
      ? true
      : false
    : false
  : false;

const t: CanResolveComplex<
  Joi.WhenType<'klucz', any, any, any>,
  [{ a: string; klucz: string }, { klucz: string }]
> = true;

//////

type ResolveComplexSingle<T extends GenericKeyMaybeWhen, A> = T extends [
  infer ResolveKey,
  Joi.WhenType<infer Key, infer T1, infer T2, infer T3>
]
  ? Key extends keyof A
    ? ResolveKey extends string
      ? [
          (
            | Omit<A, Key> & {
                [P in Key]: ResolvePrimitive<T1>;
              } & {
                [P in ResolveKey]: T2;
              }
          ),
          (
            | Omit<A, Key> & {
                [P in Key]: Exclude<A[Key], T1>;
              } & {
                [P in ResolveKey]: T3;
              }
          )
        ]
      : [never]
    : [never]
  : [never];

type ResolveComplexSingle1 = ResolveComplexSingle<
  ['a', Joi.WhenType<'b', 2, string, Date>],
  { b: number }
>;

const resolveComplexSingle1: ResolveComplexSingle1 = [
  { a: '123', b: 2 },
  { a: new Date(), b: 123 },
];

//////

type ResolveComplex<T extends GenericKeyMaybeWhen, Resolved extends object[]> = Resolved extends [
  infer A,
  ...infer B
]
  ? B extends object[]
    ? [...ResolveComplexSingle<T, A>, ...ResolveComplex<T, B>]
    : never
  : never;

// TODO: test me first
// type ResolveComplexTest1 = ResolveComplex<['a', number ], []>;
// const resolveComplexTest1: ResolveComplexTest1 = [{ a: 123 }];

// type ResolveComplexTest = ResolveComplex<{}, []>

//////

type ExpandCases<
  T,
  Resolved extends object[] = [],
  NotResolved extends GenericKeyMaybeWhen[] = [],
  NotResolvedLength extends number = 0
> = T extends GenericKeyMaybeWhen[]
  ? T extends [infer KV, ...infer B]
    ? KV extends GenericKeyMaybeWhen
      ? KV extends { k: infer Key; v: infer A }
        ? A extends Joi.WhenType<string, infer T1, infer T2, infer T3>
          ? CanResolveComplex<A, Resolved> extends true
            ? B extends GenericKeyMaybeWhen[]
              ? ExpandCases<B, ResolveComplex<KV, Resolved>, NotResolved>
              : never
            : B extends GenericKeyMaybeWhen[]
            ? ExpandCases<B, Resolved, [...NotResolved, KV]>
            : never
          : ExpandCases<B, ResolveSimple<KV, Resolved>, NotResolved>
        : NotResolved['length'] extends NotResolvedLength // fail stop - after iteration no new dependency was solved
        ? never
        : never
      : never
    : ExpandCases<NotResolved, Resolved, [], NotResolved['length']>
  : never;

// type ResolveWhen<T extends object> = ExpandCases<ObjectKeyValuesToTuple<T>>;
//
// type ResolvedObject = ResolveWhen<Type>;

// let final: ResolvedObject = []

//////////////////////// Old

// type MoveHeadToTail<T extends any[]> = T extends [infer A, ...infer B] ? [...B, A] : never;
//
// type TupleTest = [number, string, Date];
// type MoveTuple = MoveHeadToTail<TupleTest>;

// const t: MoveTuple = ['2', new Date(), 2];

// // @ts-expect-error
// const t: MoveTuple = [2, '2', new Date()];
// // @ts-expect-error
// const t: MoveTuple = ['2', new Date(), 2, '2'];

//
// type TupleToUnionBase<T> =
//   T extends []
//     ? never
//     : (T extends [infer First, ...infer Rest]
//       ? First //| TupleToUnionBase<Rest>
//       : never);
//
// const t: TupleToUnionBase<ResolvedObject> = {
//   k: 'b',
//   v: 123
// }

// ResolveComplex<B, ResolveComplex<A, Resolved>>:
//  ExpandCases<B, > :
// : ResolveSimple<A, Resolved>

// type ResolveUnion<T extends object> = ValueOf<{
//   [K in keyof T]: { k: K; v: T[K] };
// }>; // TODO: ['a', WhenType] | ['b', any] | ['c', number] | [d, WhenType] | [e, WhenType] | [f, WhenType]
//
// type ResolveUndefinedUnion<T extends object> = Extract<ResolveUnion<T>, { k: string; v: any }>; // remove undefined
//
// let ruu: ResolveUndefinedUnion<Type> = ['b', 123];
//
// // @ts-expect-error
// ruu = undefined;
//
// ruu = { k: 'c', v: 123 };
// ruu = { k: 'a', v: { key: 'b', is: 'z', then: 123, else: new Date() } };
// ruu = { k: 'd', v: { key: 'a', is: 123, then: 123, else: new Date() } };
//
// type BuildObject<T extends { k: string; v: any }, OB = {}> = {
//   [K in T['k']]: Extract<T, { k: K }>['v'] extends Joi.WhenType<
//     infer K,
//     infer T1,
//     infer T2,
//     infer T3
//   >
//     ? never
//     : Extract<T, { k: K }>['v'];
// };
//
// let o: BuildObject<ResolveUndefinedUnion<Type>> = {
//
// };

// type ResolveUnion<T extends object> = {
//   [K in keyof T]: [K, T[K]];
// }[keyof T]; // TODO: ['a', WhenType] | ['b', any] | ['c', number] | [d, WhenType] | [e, WhenType] | [f, WhenType]

// TODO if Moved type is in the list of moveTypes fail
// TODO Reset list each time element is added to object
// TODO iterate once per line, don't be afraid of the same types
// TODO 'a' extends 'a' = a, Exclude<'a', 'a'> = never ? - check it, 'a' extends Exclude<any, 'a'> = never, Exclude<Exclude<any, 'a'>, 'a'> = this

// Old tests copy just in case

// pre

// WhenKey - a | d | e | f
// WhenIsKey - a | b
// NotAffected = All - WhenKey = b | c

// PRE function

// WhenKey = a | d
// WhenIsKey = a | b
// NotAffected = All - WhenKey = b | c
// Not Affected Object = T

// output T

// First iteration
// WhenKey = a | d
// WhenIsKey = a | b
// NotAffected = All - WhenKey = b | c
// Not Affected Object = T

// CanSolve = WhenIsKey - WhenKey = b
// TypesToSolve = [b, [[z, [a, then]] | y]]

// Start types
// type T = {
//   b: any
//   c: any
// }

//permutation on TypesToSolve
type T = { b: any; c: any };

// Can ApplyKey = WhenIsKey - WhenKey = b

// we have to have loop
// DontChange: all Keys except WhenKey, WhenIsKey
// UnionDriver: 'a' | 'b'
// UnionReceiver: simple - when = 'c'

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
