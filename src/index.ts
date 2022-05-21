/** @format */

import * as Joi from 'joi';
import { AlternativesSchema, Schema, WhenSchemaOptions } from 'joi';
import { Primitive } from 'ts-essentials';

// useful for union type casting
type PrimitiveNonUndefined = Exclude<Primitive, undefined>;

declare module 'joi' {
  /**
   * When helpers
   */

  type WhenType<Key extends string, T1, T2, T3> = {
    key: Key;
    is: T1;
    then: T2;
    else: T3;
  };

  /**
   * To rewrite
   */

  type ExtendedWhenOptions<IsT, ThenT, OtherwiseT> = {
    is: IsT;
    then?: ThenT;
    otherwise?: OtherwiseT;
  };

  type ExtendedWhenSchemaOptions<ThenT, OtherwiseT> = {
    then?: ThenT;
    otherwise?: OtherwiseT;
  };

  /**
   * Generic Schema helper
   */

  type ExtendedAnyKeys = 'allow' | 'default' | 'exist' | 'optional' | 'required' | 'valid' | 'when';
  type OmitExtendedAnyKeys<T> = Omit<T, ExtendedAnyKeys>;

  interface AnySchemaHelper<ValueType extends any> {
    allow<T extends PrimitiveNonUndefined[]>(...values: T): AnySchemaHelper<ValueType | T[number]>;

    allow<T extends PrimitiveNonUndefined>(
      values: T[]
    ): AnySchemaHelper<ValueType | typeof values[number]>; // typeof values - removes tuple

    default<T extends ValueType>(
      value: T,
      description?: string
    ): AnySchemaHelper<ValueType | undefined>;

    // alias of required
    exist(): AnySchemaHelper<
      ValueType extends undefined ? Exclude<ValueType, undefined> : ValueType
    >;
    optional(): AnySchemaHelper<ValueType | undefined>;
    required(): AnySchemaHelper<Exclude<ValueType, undefined>>;

    /**
     * Converts the type into an alternatives type where the conditions are merged into the type definition where:
     */
    // when(ref: string, options: WhenOptions): AlternativesSchema;
    // when(ref: Schema, options: WhenSchemaOptions): AlternativesSchema;

    // TODO: most likely wrong implementation, docs are not clear about how it suppose to work
    when<T extends GenericSchema, ThenT, OtherwiseT>(
      key: T,
      options: ExtendedWhenSchemaOptions<ThenT, OtherwiseT>
    ): T extends AnySchemaHelper<infer V1>
      ? ValueType extends V1
        ? ThenT extends AnySchemaHelper<infer V2>
          ? V2 extends any // trick so if we don't have new type just transfer old one, could be done with extra param
            ? AnySchemaHelper<ValueType> // always transfer new required op, can be done with extra param
            : AnySchemaHelper<V2>
          : never
        : OtherwiseT extends AnySchemaHelper<infer V2>
        ? AnySchemaHelper<V2>
        : never
      : never;

    // TODO: hard to type
    // I don't need it so skip it, as well docs are not clear about how ti works, most likely
    // it should be only object related
    when<Key extends string, T1, T2, T3>(
      key: Key,
      options: ExtendedWhenOptions<T1, T2, T3>
    ): AnySchemaHelper<WhenType<Key, pullType<T1>, pullType<T2>, pullType<T3>>>;

    valid<T extends ValueType[]>(
      ...values: T
    ): AnySchemaHelper<ValueType extends undefined ? T[number] | undefined : T[number]>;

    valid<T extends ValueType>(
      values: T[]
    ): ValueType extends undefined ? typeof values[number] | undefined : typeof values[number];
  }

  /**
   *  Primitive Schemas
   */

  interface ExtendedAnySchema<T = any> extends AnySchemaHelper<T>, OmitExtendedAnyKeys<AnySchema> {}

  interface ExtendedStringSchema
    extends AnySchemaHelper<string | undefined>,
      OmitExtendedAnyKeys<StringSchema> {}

  interface ExtendedNumberSchema
    extends AnySchemaHelper<number | undefined>,
      OmitExtendedAnyKeys<NumberSchema> {}

  interface ExtendedBooleanSchema
    extends AnySchemaHelper<boolean | undefined>,
      OmitExtendedAnyKeys<BooleanSchema> {}

  interface ExtendedDateSchema
    extends AnySchemaHelper<Date | undefined>,
      OmitExtendedAnyKeys<DateSchema> {}

  interface ExtendedFunctionSchema
    extends AnySchemaHelper<Function | undefined>,
      OmitExtendedAnyKeys<FunctionSchema> {}

  /**
   *  Array Schema - ValueType keeps resolved types
   */

  type ResolveToRequired<T> = T extends AnySchemaHelper<infer V | undefined> ? V : never;

  type TupleToUnion<T extends GenericSchema[]> = T[number];
  type ResolveArrayTypes<T extends GenericSchema[]> = {
    // we force the array types to be required - to prevent putting undefined - [v1, undefined]
    [K in keyof T]: ResolveToRequired<T[K]>;
  };

  interface ExtendedArraySchema<ValueType = any[] | undefined>
    extends AnySchemaHelper<ValueType>,
      Omit<OmitExtendedAnyKeys<ArraySchema>, 'items'> {
    items<T extends GenericSchema[], VT = ResolveArrayTypes<TupleToUnion<T>[]>>(
      ...values: T
    ): ExtendedArraySchema<
      ValueType extends undefined
        ? ResolveToRequired<T[number]>[] | undefined
        : ResolveToRequired<T[number]>[]
    >;

    items<T extends GenericSchema[], VT = ResolveArrayTypes<TupleToUnion<T>[]>>(
      values: T
    ): ExtendedArraySchema<ValueType extends undefined ? VT | undefined : VT>;

    // TODO: add ordered - simply not resolve tuple
  }

  /**
   * Object: Object Schema
   */

  // TS bug prevented me of using common parametrized type. I had to split it into two
  // GetOptionalKeys andGetRequiredKeys types - with 'extends false' instead of 'extends OptionalCase'
  export type GetOptionalKeys<T extends ObjectSchemaArgument> = Exclude<
    keyof T,
    GetRequiredKeys<T>
  >;

  export type GetRequiredKeys<T extends ObjectSchemaArgument> = {
    [K in keyof T]: T[K] extends AnySchemaHelper<infer V>
      ? V extends undefined
        ? never
        : K
      : never;
  }[keyof T];

  type OptionalObjectKeys<T, Keys> = {
    [K in keyof T as Extract<K, Keys>]?: T[K];
  };

  type RequiredObjectKeys<T, Keys> = {
    [K in keyof T as Extract<K, Keys>]-?: T[K];
  };

  type ResolveObjectValues<T> = {
    [K in keyof T]: ResolveToRequired<T[K]>;
  };

  type ResolveObjectTypes<
    T extends ObjectSchemaArgument,
    R = ResolveObjectValues<T>,
    OptionalKeys = GetOptionalKeys<T>,
    RequiredKeys = GetRequiredKeys<T>
  > = OptionalObjectKeys<R, OptionalKeys> & RequiredObjectKeys<R, RequiredKeys>;

  interface ExtendedObjectSchema<ValueType = {} | undefined>
    extends AnySchemaHelper<ValueType>,
      Omit<OmitExtendedAnyKeys<ObjectSchema>, 'keys' | 'append' | 'pattern'> {
    keys<T extends ObjectSchemaArgument>(
      schema: T
    ): this extends ExtendedObjectSchema<infer V>
      ? ExtendedObjectSchema<V & ResolveObjectTypes<T>>
      : never;

    append<T extends ObjectSchemaArgument>(
      schema: T
    ): this extends ExtendedObjectSchema<infer V>
      ? ExtendedObjectSchema<V & ResolveObjectTypes<T>>
      : never;

    pattern<T extends GenericSchema>(
      pattern: any,
      schema: T
    ): this extends ExtendedObjectSchema<infer V>
      ? ExtendedObjectSchema<{ [key: string]: ResolveToRequired<T> } & V>
      : never;
  }

  /**
   * Alternatives: extraction decorated schema
   */
  // interface ExtendedAlternativeSchema<V, O>
  //   extends AnySchemaHelper<V, O>,
  //     Omit<OmitExtendedAnyKeys<AlternativesSchema>, 'keys' | 'append' | 'pattern'> {}

  // export interface BoxAlternativesSchema<N extends BoxSchema> extends AlternativesSchema {
  //   __schemaTypeLiteral: 'BoxAlternativesSchema';
  //
  //
  //   try<T extends mappedSchema[]>(
  //     ...values: T
  //   ): this extends BoxAlternativesSchema<infer O>
  //     ? O extends Box<infer oT, infer oR>
  //       ? BoxAlternativesSchema<BoxType<O, oT | extractType<T>>>
  //       : BoxAlternativesSchema<Box<extractType<T>, false>>
  //     : BoxAlternativesSchema<Box<extractType<T>, false>>;
  //
  //   try<T extends mappedSchema[]>(
  //     values: T
  //   ): this extends BoxAlternativesSchema<infer O>
  //     ? O extends Box<infer oT, infer oR>
  //       ? BoxAlternativesSchema<BoxType<O, oT | extractType<T>>>
  //       : BoxAlternativesSchema<Box<extractType<T>, false>>
  //     : BoxAlternativesSchema<Box<extractType<T>, false>>;
  //
  //   try(...types: SchemaLike[]): this;
  //   try(types: SchemaLike[]): this;
  //
  //   when<
  //     R,
  //     T1 extends mappedSchema,
  //     T2 extends mappedSchema,
  //     T extends { then: T1; otherwise: T2 }
  //   >(
  //     ref: R,
  //     defs: T
  //   ): this extends BoxAlternativesSchema<infer O>
  //     ? O extends Box<infer oT, infer oR>
  //       ? BoxAlternativesSchema<
  //           BoxType<O, oT | extractType<T['then']> | extractType<T['otherwise']>>
  //         >
  //       : BoxAlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>
  //     : BoxAlternativesSchema<Box<extractType<T['then']> | extractType<T['otherwise']>, false>>;
  //
  //   when(ref: string | Reference, options: WhenOptions): this;
  //   when(ref: Schema, options: WhenSchemaOptions): this;
  // }

  /**
   *  Methods
   */

  export function exist(): ExtendedAnySchema<{}>;
  export function required(): ExtendedAnySchema<{}>;
  export function not(): ExtendedAnySchema<never>;

  export function any(): ExtendedAnySchema;
  export function string(): ExtendedStringSchema;
  export function number(): ExtendedNumberSchema;
  export function boolean(): ExtendedBooleanSchema;
  export function date(): ExtendedDateSchema;
  export function func(): ExtendedFunctionSchema;
  export function array(): ExtendedArraySchema;

  export function valid<T extends Primitive[]>(...values: T): ExtendedAnySchema<T[number]>;
  export function valid<T extends Primitive[]>(values: T[]): ExtendedAnySchema<typeof values[number]>;

  export function object<T extends ObjectSchemaArgument>(
    schema?: T
  ): ExtendedObjectSchema<ResolveObjectTypes<T> | undefined>;

  /**
   * Allow extend() to use Joi types by default
   */
  // export function extend(
  //   extension: Extension | Extension[],
  //   ...extensions: Array<Extension | Extension[]>
  // ): typeof Joi;

  /**
   * Validation: extraction decorated methods
   */
  // export function validate<T, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S
  // ): ValidationResult<extendsGuard<T, extractType<S>>>;
  // export function validate<T, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   options: ValidationOptions
  // ): ValidationResult<extendsGuard<T, extractType<S>>>;
  // export function validate<T, R, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   options: ValidationOptions,
  //   callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
  // ): R;
  // export function validate<T, R, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   callback: (err: ValidationError, value: extendsGuard<T, extractType<S>>) => R
  // ): R;

  // export function alternatives<T extends mappedSchema[]>(
  //   ...alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  // export function alternatives<T extends mappedSchema[]>(
  //   alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  //
  // export function alt<T extends mappedSchema[]>(
  //   ...alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;
  // export function alt<T extends mappedSchema[]>(
  //   alts: T
  // ): BoxAlternativesSchema<Box<extractType<typeof alts[number]>, false>>;

  // type MaybeType<V, Optional> = Optional extends false ? V : V | undefined;

  type GenericSchema = AnySchemaHelper<any>;
  type ObjectOrArraySchema = GenericSchema; // | GenericSchema[];
  type ObjectSchemaArgument = Record<string, ObjectOrArraySchema>;

  type pullType<T> = T extends AnySchemaHelper<infer V | undefined>
    ? T extends AnySchemaHelper<infer V>
      ? V
      : V | undefined
    : T;

  // TODO: add
  //  pullInType = pullType
  //  pullOutType = pullType where default types are mandatory
}
