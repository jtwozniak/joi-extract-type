/** @format */

import * as Joi from 'joi';
import '../../index';
import { Primitive, ValueOf } from 'ts-essentials';

const schema = Joi.object({
  // a: Joi.any().when('b', { is: 'z', then: Joi.number(), otherwise: Joi.date() }),
  // .when('c', { is: Joi.number().min(10), then: Joi.forbidden() }),
  b: Joi.string(),
  c: Joi.number().required(),
  // d: Joi.any().when('a', { is: 2, then: Joi.number(), otherwise: Joi.date() }),
  // e: Joi.any().when('b', { is: 'z', then: Joi.number(), otherwise: Joi.date() }),
  // f: Joi.any().when('b', { is: 'y', then: Joi.number(), otherwise: Joi.date() }),
  // g: Joi.any().when('b', { is: 'y', then: Joi.number(), otherwise: Joi.date() }),
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

type GenericWhen = Joi.WhenType<string, any, any, any>;
type GenericKeyWhen = [string, GenericWhen];
type GenericKeyMaybeWhen = [string, any];

type PrimitiveNonUndefined = Exclude<Primitive, undefined>;
type ResolvePrimitive<T> = T extends PrimitiveNonUndefined ? T : never;

//////

type ResolveSimpleSingle<ResolveKey, T> = T extends undefined
  ? { [P in ResolveKey & string]?: T }
  : { [P in ResolveKey & string]-?: Exclude<T, undefined> };

type ResolveSimple<T, Resolved, Deep = false> = T extends [infer ResolveKey, infer T1]
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

type ResolveSimpleTest2 = ResolveSimple<['a', number], [{ d: string }, { c: boolean }]>;
const resolveSimpleTest2: ResolveSimpleTest2 = [
  { a: 123, d: '123' },
  { a: 321, c: false },
];
// const resolveSimpleTest4: ResolveSimpleTest2 = [{ a: 123 }];

type ResolveSimpleTest3 = ResolveSimple<['a', number], [{ c: string }, { d: string }]>;
const resolveSimpleTest3: ResolveSimpleTest3 = [
  { a: 123, c: '123' },
  { a: 123, d: '123' },
];

type ResolveSimpleTest4 = ResolveSimple<['a', number | undefined], []>;
const resolveSimpleTest4: ResolveSimpleTest1 = [{ a: 123 }, {}];

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
          Omit<A, Key> & {
            [P in Key]: ResolvePrimitive<T1>;
          } & {
            [P in ResolveKey]: T2;
          },
          Omit<A, Key> & {
            [P in Key]: ResolvePrimitive<T1>;
          } & {
            [P in ResolveKey]: never; // Exclude<any, 2> = any cannot narrow it, so exclude type
          },
          Omit<A, Key> & {
            [P in Key]: Exclude<A[Key], T1>;
          } & {
            [P in ResolveKey]: T3;
          }
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
  // @ts-expect-error
  { a: new Date(), b: 123 },
  { a: new Date(), b: 123 },
];

//////

type TT = Exclude<number, 2>;
const t123: TT = 2; // this is not working

type TupleToUnion<T extends any[]> = Exclude<T[number], 'any'>;

// three loops, remove the same types, for performance reasons
type FilterIfInUnion<
  T extends object[],
  ResolvedUnion,
  Resolved extends object[] = []
> = T extends [infer A, ...infer B]
  ? B extends object[]
    ? A extends object
      ? A extends ResolvedUnion
        ? FilterIfInUnion<B, ResolvedUnion, Resolved>
        : FilterIfInUnion<B, ResolvedUnion | A, [A, ...Resolved]>
      : never
    : never
  : Resolved;

type SimpleUnion = { a: number } | { b: string } | { c: Date };

type UnionSimplify1 = FilterIfInUnion<[{ a: Date }], SimpleUnion>;
const unionSimplify1: UnionSimplify1 = [{ a: new Date() }];

type UnionSimplify2 = FilterIfInUnion<[{ a: number }], SimpleUnion>;
const unionSimplify2: UnionSimplify2 = [];

type UnionSimplify3 = FilterIfInUnion<[{ a: number }, { a: Date }], SimpleUnion>;
const unionSimplify3: UnionSimplify3 = [{ a: new Date() }];

//////////

type ResolveComplex<
  T extends GenericKeyWhen,
  ResolvedOld extends object[],
  ResolvedNew extends object[] = []
> = ResolvedOld extends [infer A, ...infer B]
  ? B extends object[]
    ? ResolveComplex<
        T,
        B,
        [...ResolvedNew, ...FilterIfInUnion<ResolveComplexSingle<T, A>, TupleToUnion<ResolvedNew>>]
      >
    : FilterIfInUnion<ResolveComplexSingle<T, A>, TupleToUnion<ResolvedNew>>
  : ResolvedNew;

type ResolveComplexTest1 = ResolveComplex<
  ['a', Joi.WhenType<'b', 2, number, Date>],
  [{ b: any; c: number }]
>;

type Union = TupleToUnion<ResolveComplexTest1>;

const resolveComplexTest1: Union = { a: 123, b: 2, c: 2 };
const resolveComplexTest22: Union = { a: new Date(), b: 123, c: 2 };
// @ts-expect-error
const resolveComplexTest3: Union = { a: 123, b: 2, c: 2, twojstary: 2 };
// @ts-expect-error
const resolveComplexTest4: Union = 123;
// @ts-expect-error
const resolveComplexTest5: Union = {};

////////////
// simplify case!!
type ResolveComplexTest2 = ResolveComplex<
  ['a', Joi.WhenType<'b', 2, number, Date>],
  [{ b: any }, { b: any }] // extra copy should be reduced
>;

const resolveComplexTest2: ResolveComplexTest2 = [
  { a: 123, b: 2 },
  // @ts-expect-error
  { a: new Date(), b: 2 },
  { a: new Date(), b: 2 },
];

//////

type ExpandCases<
  T,
  Resolved extends object[] = [],
  NotResolved extends GenericKeyMaybeWhen[] = [],
  NotResolvedLength extends number = 0
> = T extends GenericKeyMaybeWhen[]
  ? T extends [infer KV, ...infer TTable]
    ? KV extends [infer Key, infer A]
      ? A extends GenericWhen // if comples
        ? never
        : /*
        CanResolveComplex<A, Resolved> extends true
          ? KV extends GenericKeyWhen
            ? ExpandCases<TTable, ResolveComplex<KV, Resolved>, NotResolved, NotResolvedLength>
            : never
          : // Resolved
          KV extends GenericKeyMaybeWhen
          ? ExpandCases<TTable, Resolved, [...NotResolved, KV], NotResolvedLength>
          : never

         */
          ExpandCases<TTable, ResolveSimple<KV, Resolved>, NotResolved, NotResolvedLength>
      : never
    : // : never
      Resolved // emptied list
  : never;

type ResolveWhen<T extends object> = ExpandCases<ObjectKeyValuesToTuple<T>>;
// type ResolveWhenTuple<T extend s> = TupleToUnion<T>

type ResolvedObject = ResolveWhen<Type>;

let finalTest: ResolvedObject = [
  {
    d: 123,
  },
];
