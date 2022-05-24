/** @format */

import * as Joi from 'joi';
// import { Primitive } from 'ts-essentials';
export declare type Primitive = string | number | boolean | bigint | symbol | undefined | null;

// useful for union type casting
type PrimitiveNonUndefined = Exclude<Primitive, undefined>;

declare module 'joi' {
  /**
   * When helpers
   */
  //
  // type WhenType<Key extends string, T1, T2, T3> = {
  //   key: Key;
  //   is: T1;
  //   then: T2;
  //   else: T3;
  // };

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

  type ExtendedAnyKeys =
    | 'allow'
    | 'default'
    | 'description'
    | 'exist'
    | 'max'
    | 'min'
    | 'optional'
    | 'required'
    | 'valid'
    | 'when';
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

    default<T extends () => ValueType>(
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
    ): AnySchemaHelper<pullType<T2> | pullType<T3>>;

    valid<T extends ValueType[]>(
      ...values: T
    ): AnySchemaHelper<ValueType extends undefined ? T[number] | undefined : T[number]>;

    valid<T extends ValueType>(
      values: T[]
    ): AnySchemaHelper<
      ValueType extends undefined ? typeof values[number] | undefined : typeof values[number]
      >;

    only<T extends ValueType[]>(
      ...values: T
    ): AnySchemaHelper<ValueType extends undefined ? T[number] | undefined : T[number]>;

    only<T extends ValueType>(
      values: T[]
    ): AnySchemaHelper<
      ValueType extends undefined ? typeof values[number] | undefined : typeof values[number]
      >;

    equal<T extends ValueType[]>(
      ...values: T
    ): AnySchemaHelper<ValueType extends undefined ? T[number] | undefined : T[number]>;

    equal<T extends ValueType>(
      values: T[]
    ): AnySchemaHelper<
      ValueType extends undefined ? typeof values[number] | undefined : typeof values[number]
      >;

    /////////

    validate<T>(value: T, options?: ValidationOptions): ValidationResult<T>;
    validate<T, R>(value: T, callback: (err: ValidationError, value: T) => R): R;
    validate<T, R>(value: T, options: ValidationOptions, callback: (err: ValidationError, value: T) => R): R;

    bind(): this;
    invalid(...values: any[]): this;
    invalid(values: any[]): this;
    disallow(...values: any[]): this;
    disallow(values: any[]): this;
    not(...values: any[]): this;
    not(values: any[]): this;
    forbidden(): this;
    strip(): this;
    description(desc: string): this;
    notes(notes: string | string[]): this;
    tags(notes: string | string[]): this;
    meta(meta: object): this;
    example(value: any): this;
    unit(name: string): this;
    options(options: ValidationOptions): this;
    strict(isStrict?: boolean): this;
    default(value?: any, description?: string): this;
    concat(schema: this): this;
    // when(ref: string | Reference, options: WhenOptions): AlternativesSchema;
    // when(ref: Schema, options: WhenSchemaOptions): AlternativesSchema;
    label(name: string): this;
    raw(isRaw?: boolean): this;
    empty(schema?: SchemaLike): this;
    error(err: Error | ValidationErrorFunction, options?: any): this;
    describe(): Description;
  }

  /**
   *  Primitive Schemas
   */

  interface ExtendedAnySchema<T = any> extends AnySchemaHelper<T> {}

  interface ExtendedStringSchema extends AnySchemaHelper<string | undefined> {
    insensitive(): this;
    min(limit: number, encoding?: string): this;
    min(limit: Reference, encoding?: string): this;
    max(limit: number, encoding?: string): this;
    max(limit: Reference, encoding?: string): this;
    truncate(enabled?: boolean): this;
    normalize(form?: 'NFC' | 'NFD' | 'NFKC' | 'NFKD'): this;
    base64(options?: Base64Options): this;
    creditCard(): this;
    length(limit: number, encoding?: string): this;
    length(limit: Reference, encoding?: string): this;
    regex(pattern: RegExp, options?: string | StringRegexOptions): this;
    replace(pattern: RegExp, replacement: string): this;
    replace(pattern: string, replacement: string): this;
    alphanum(): this;
    token(): this;
    email(options?: EmailOptions): this;
    ip(options?: IpOptions): this;
    uri(options?: UriOptions): this;
    dataUri(options?: DataUriOptions): this;
    guid(options?: GuidOptions): this;
    uuid(options?: GuidOptions): this;
    hex(options?: HexOptions): this;
    hostname(): this;
    isoDate(): this;
    lowercase(): this;
    uppercase(): this;
    trim(): this;
  }

  interface ExtendedNumberSchema
    extends AnySchemaHelper<number | undefined>{
    min(limit: number | Reference): this;
    max(limit: number | Reference): this;
    greater(limit: number | Reference): this;
    less(limit: number | Reference): this;
    integer(): this;
    unsafe(enabled?: boolean): this;
    precision(limit: number): this;
    multiple(base: number): this;
    positive(): this;
    negative(): this;
    port(): this;
  }

  interface ExtendedBooleanSchema
    extends AnySchemaHelper<boolean | undefined>{}

  interface ExtendedDateSchema
    extends AnySchemaHelper<Date | undefined> {}

  interface ExtendedFunctionSchema
    extends AnySchemaHelper<Function | undefined>{}

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
    extends AnySchemaHelper<ValueType> {
    items<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
      ...values: T
    ): ExtendedArraySchema<
      ValueType extends undefined
        ? ResolveToRequired<T[number]>[] | undefined
        : ResolveToRequired<T[number]>[]
      >;

    items<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
      values: T
    ): ExtendedArraySchema<ValueType extends undefined ? VT | undefined : VT>;

    has(schema: SchemaLike): this;
    sparse(enabled?: any): this;
    single(enabled?: any): this;
    ordered(...types: SchemaLike[]): this;
    ordered(types: SchemaLike[]): this;
    min(limit: number): this;
    max(limit: number): this;
    length(limit: number | Reference): this;
    unique(comparator?: string, options?: any): this;
    unique<T = any>(comparator?: (a: T, b: T) => boolean): this;
  }

  /**
   * Object: Object Schema
   */

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
    [K in keyof T as Extract<K, Keys>]?: T[K] | undefined;
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
    extends AnySchemaHelper<ValueType> {
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

  interface ExtendedAlternativeSchema<ValueType = undefined>
    extends AnySchemaHelper<ValueType> {
    try<T extends GenericSchema[]>(
      ...values: T
    ): ExtendedObjectSchema<pullType<ExtendedArraySchema<typeof values>>[number]>;
    try<T extends GenericSchema[]>(
      values: T
    ): ExtendedObjectSchema<pullType<ExtendedArraySchema<typeof values>>[number]>;
  }

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

  export function valid<T extends Primitive[]>(...values: T): AnySchemaHelper<T[number]>;
  export function valid<T extends Primitive[]>(
    values: T[]
  ): ExtendedAnySchema<typeof values[number]>;

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
  // ): ValidationResult<extendsGuard<T, pullType<S>>>;
  // export function validate<T, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   options: ValidationOptions
  // ): ValidationResult<extendsGuard<T, pullType<S>>>;
  // export function validate<T, R, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   options: ValidationOptions,
  //   callback: (err: ValidationError, value: extendsGuard<T, pullType<S>>) => R
  // ): R;
  // export function validate<T, R, S extends mappedSchemaMap>(
  //   value: T,
  //   schema: S,
  //   callback: (err: ValidationError, value: extendsGuard<T, pullType<S>>) => R
  // ): R;

  export function alternatives<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
    ...alternatives: T
  ): ExtendedAlternativeSchema<ResolveToRequired<T[number]>>;
  export function alternatives<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
    values: T
  ): VT extends any[] ? ExtendedAlternativeSchema<VT[number]> : never;

  export function alt<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
    ...alternatives: T
  ): ResolveToRequired<T[number]>;
  export function alt<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
    values: T
  ): VT extends any[] ? VT[number] : never;

  ///////////////////

  type GenericSchema = AnySchemaHelper<any>;
  type ObjectOrArraySchema = GenericSchema | GenericSchema[];
  type ObjectSchemaArgument = Record<string, ObjectOrArraySchema>;

  type pullType<T> = T extends AnySchemaHelper<infer V1 | undefined>
    ? T extends AnySchemaHelper<infer V>
      ? V
      : V1 | undefined
    : T;

  // TODO: add
  //  pullInType = pullType
  //  pullOutType = pullType where default types are mandatory
}
