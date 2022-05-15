/** @format */

import * as Joi from 'joi';
import { AlternativesSchema, Schema, WhenSchemaOptions } from 'joi';

declare module 'joi' {
  /**
   * Generic Schema helper
   */

  type ExtendedAnyKeys = 'allow' | 'default' | 'exist' | 'optional' | 'required' | 'valid' | 'when';
  type OmitExtendedAnyKeys<T> = Omit<T, ExtendedAnyKeys>;

  type ExtendedWhenOptions<IsT, ThenT, OtherwiseT> = {
    is: IsT;
    then?: ThenT;
    otherwise?: OtherwiseT;
  };

  type ExtendedWhenShemaOptions<ThenT, OtherwiseT> = {
    then?: ThenT;
    otherwise?: OtherwiseT;
  };

  interface AnySchemaHelper<ValueType, Optional = true, Parent = never> {
    allow<T>(
      ...values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<V | T, O> : never;
    allow<T>(
      values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<V | T, O> : never;

    default<T extends ValueType>(value: T, description?: string): AnySchemaHelper<ValueType>;
    // alias of required
    exist(): AnySchemaHelper<ValueType, false>;
    optional(): AnySchemaHelper<ValueType>;
    required(): AnySchemaHelper<ValueType, false>;

    /**
     * Converts the type into an alternatives type where the conditions are merged into the type definition where:
     */
    // when(ref: string, options: WhenOptions): AlternativesSchema;
    // when(ref: Schema, options: WhenSchemaOptions): AlternativesSchema;

    // TODO: most likely wrong implementation, docs are not clear about how it suppose to work
    when<T extends GenericSchema, ThenT, OtherwiseT>(
      key: T,
      options: ExtendedWhenShemaOptions<ThenT, OtherwiseT>
    ): T extends AnySchemaHelper<infer V1, infer O1>
      ? ValueType extends V1
        ? ThenT extends AnySchemaHelper<infer V2, infer O2>
          ? V2 extends any // trick so if we don't have new type just transfer old one, could be done with extra param
            ? AnySchemaHelper<ValueType, O2> // always transfer new required op, can be done with extra param
            : AnySchemaHelper<V2, O2>
          : never
        : OtherwiseT extends AnySchemaHelper<infer V2, infer O2>
        ? AnySchemaHelper<V2, O2>
        : never
      : never;

    // TODO: hard to type
    // I don't need it so skip it, as well docs are not clear about how ti works, most likely
    // it should be only object related
    when(ref: any, options: any): this;

    valid<T extends ValueType>(
      ...values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<T, O> : never;
    valid<T extends ValueType>(
      values: T[]
    ): this extends AnySchemaHelper<infer V, infer O> ? AnySchemaHelper<T, O> : never;
  }

  /**
   *  Primitive Schemas
   */

  interface ExtendedAnySchema<T = any, O = true>
    extends AnySchemaHelper<T, O>,
      OmitExtendedAnyKeys<AnySchema> {}

  interface ExtendedStringSchema<O = true>
    extends AnySchemaHelper<string, O>,
      OmitExtendedAnyKeys<StringSchema> {}

  interface ExtendedNumberSchema<O = true>
    extends AnySchemaHelper<number, O>,
      OmitExtendedAnyKeys<NumberSchema> {}

  interface ExtendedBooleanSchema<O = true>
    extends AnySchemaHelper<boolean, O>,
      OmitExtendedAnyKeys<BooleanSchema> {}

  interface ExtendedDateSchema<O = true>
    extends AnySchemaHelper<Date, O>,
      OmitExtendedAnyKeys<DateSchema> {}

  interface ExtendedFunctionSchema<O = true>
    extends AnySchemaHelper<Function, O>,
      OmitExtendedAnyKeys<FunctionSchema> {}

  /**
   *  Array Schema - ValueType keeps resolved types
   */

  type ResolveToRequired<T> = T extends AnySchemaHelper<infer V, infer O>
    ? MaybeType<V, false>
    : never;

  type TupleToUnion<T extends GenericSchema[]> = T[number];
  type ResolveArrayTypes<T extends GenericSchema[]> = {
    // we force the array types to be required - to prevent putting undefined - [v1, undefined]
    [K in keyof T]: ResolveToRequired<T[K]>;
  };

  interface ExtendedArraySchema<ValueType = any[], Optional = true>
    extends AnySchemaHelper<ValueType, Optional>,
      Omit<OmitExtendedAnyKeys<ArraySchema>, 'items'> {
    items<T extends GenericSchema[]>(
      ...values: T
    ): this extends ExtendedArraySchema<infer V, infer O>
      ? ExtendedArraySchema<ResolveArrayTypes<TupleToUnion<T>[]>, O>
      : never;

    items<T extends GenericSchema[]>(
      values: T
    ): this extends ExtendedArraySchema<infer V, infer O>
      ? ExtendedArraySchema<ResolveArrayTypes<TupleToUnion<T>[]>, O>
      : never;

    // TODO: add ordered - simply not resolve tuple
  }

  /**
   * Object: Object Schema
   */

  // TS bug prevented me of using common parametrized type. I had to split it into two
  // GetOptionalKeys andGetRequiredKeys types - with 'extends false' instead of 'extends OptionalCase'
  export type GetOptionalKeys<T extends ObjectSchemaArgument> = {
    [K in keyof T]: T[K] extends AnySchemaHelper<infer V, infer O>
      ? // TS bug: false can be changed to true and it behave as nothing happen
        // reordered the '? : ' values instead
        O extends false
        ? never
        : K
      : never;
  }[keyof T];

  export type GetRequiredKeys<T extends ObjectSchemaArgument> = {
    [K in keyof T]: T[K] extends AnySchemaHelper<infer V, infer O>
      ? O extends false
        ? K
        : never
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

  interface ExtendedObjectSchema<ValueType = {}, Optional = true>
    extends AnySchemaHelper<ValueType, Optional>,
      Omit<OmitExtendedAnyKeys<ObjectSchema>, 'keys' | 'append' | 'pattern'> {
    keys<T extends ObjectSchemaArgument>(
      schema: T
    ): this extends ExtendedObjectSchema<infer V, infer O>
      ? ExtendedObjectSchema<V & ResolveObjectTypes<T>, O>
      : never;

    append<T extends ObjectSchemaArgument>(
      schema: T
    ): this extends ExtendedObjectSchema<infer V, infer O>
      ? ExtendedObjectSchema<V & ResolveObjectTypes<T>, O>
      : never;

    pattern<T extends GenericSchema>(
      pattern: any,
      schema: T
    ): this extends ExtendedObjectSchema<infer V, infer O>
      ? ExtendedObjectSchema<{ [key: string]: ResolveToRequired<T> } & V, O>
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

  export function exist(): ExtendedAnySchema<any, false>;
  export function required(): ExtendedAnySchema<any, false>;
  export function not<T>(): ExtendedAnySchema<Exclude<any, T>, false>;

  export function any(): ExtendedAnySchema;
  export function string(): ExtendedStringSchema;
  export function number(): ExtendedNumberSchema;
  export function boolean(): ExtendedBooleanSchema;
  export function date(): ExtendedDateSchema;
  export function func(): ExtendedFunctionSchema;
  export function array(): ExtendedArraySchema;

  export function object<T extends ObjectSchemaArgument>(
    schema?: T
  ): ExtendedObjectSchema<ResolveObjectTypes<T>>;

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

  type MaybeType<V, Optional> = Optional extends false ? V : V | undefined;

  type GenericSchema = AnySchemaHelper<any, boolean>;
  type ObjectOrArraySchema = GenericSchema; // | GenericSchema[];
  type ObjectSchemaArgument = Record<string, ObjectOrArraySchema>;

  type pullType<T> = T extends AnySchemaHelper<infer V, infer O> ? MaybeType<V, O> : T;

  // TODO: add
  //  pullInType = pullType
  //  pullOutType = pullType where default types are mandatory
}
