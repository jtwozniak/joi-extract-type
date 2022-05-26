/** @format */

import * as Joi from 'joi';
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

  interface AnySchemaHelper<ValueType extends any, Optional = true> {
    allow<T extends PrimitiveNonUndefined[]>(
      ...values: T
    ): AnySchemaHelper<ValueType | T[number], Optional>;

    allow<T extends PrimitiveNonUndefined>(
      values: T[]
    ): AnySchemaHelper<ValueType | typeof values[number], Optional>; // typeof values - removes tuple

    default<T extends ValueType>(value: T, description?: string): AnySchemaHelper<ValueType, true>;

    default<T extends () => ValueType>(
      value: T,
      description?: string
    ): AnySchemaHelper<ValueType, true>;

    // alias of required
    exist(): AnySchemaHelper<ValueType, false>;
    optional(): AnySchemaHelper<ValueType, true>;
    required(): AnySchemaHelper<ValueType, false>;

    /**
     * Converts the type into an alternatives type where the conditions are merged into the type definition where:
     */

    when<T extends GenericSchema, T1 = this, T2 = this>(
      key: T,
      options: ExtendedWhenSchemaOptions<T1, T2>
    ): AnySchemaHelper<pullType<T1> | pullType<T2>, false>; // remove undefined from union, if type have the it will be there

    when<Key extends string, T1, T2 = this, T3 = this>(
      key: Key,
      options: ExtendedWhenOptions<T1, T2, T3>
    ): AnySchemaHelper<pullType<T2> | pullType<T3>, false>;

    valid<T extends ValueType[]>(...values: T): AnySchemaHelper<T[number], Optional>;
    valid<T extends ValueType>(values: T[]): AnySchemaHelper<typeof values[number], Optional>;

    only<T extends ValueType[]>(...values: T): AnySchemaHelper<T[number], Optional>;
    only<T extends ValueType>(values: T[]): AnySchemaHelper<typeof values[number], Optional>;

    equal<T extends ValueType[]>(...values: T): AnySchemaHelper<T[number], Optional>;
    equal<T extends ValueType>(values: T[]): AnySchemaHelper<typeof values[number], Optional>;

    /////////

    // TODO: type me
    validate<T>(value: T, options?: ValidationOptions): ValidationResult<T>;
    validate<T, R>(value: T, callback: (err: ValidationError, value: T) => R): R;
    validate<T, R>(
      value: T,
      options: ValidationOptions,
      callback: (err: ValidationError, value: T) => R
    ): R;
    /////

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

  interface ExtendedAnySchema<T = any, Optional = true> extends AnySchemaHelper<T, Optional> {}

  interface ExtendedStringSchema extends AnySchemaHelper<string> {
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

  interface ExtendedNumberSchema<T = number, Optional = true> extends AnySchemaHelper<T, Optional> {
    min(limit: number | Reference): this;
    max(limit: number | Reference): this;
    greater(limit: number | Reference): this;
    less(limit: number | Reference): this;
    integer(): ExtendedNumberSchema<T, Optional>;
    unsafe(enabled?: boolean): this;
    precision(limit: number): this;
    multiple(base: number): this;
    positive(): this;
    negative(): this;
    port(): this;
  }

  interface ExtendedBooleanSchema extends AnySchemaHelper<boolean> {
    truthy(...values: Array<string | number | string[] | number[]>): this;
    falsy(...values: Array<string | number | string[] | number[]>): this;
    insensitive(enabled?: boolean): this;
  }

  interface ExtendedDateSchema extends AnySchemaHelper<Date> {
    min(date: Date): this;
    min(date: number): this;
    min(date: string): this;
    min(date: Reference): this;
    max(date: Date): this;
    max(date: number): this;
    max(date: string): this;
    max(date: Reference): this;
    format(format: string): this;
    format(format: string[]): this;
    iso(): this;
    timestamp(type?: 'javascript' | 'unix'): this;
  }

  interface ExtendedFunctionSchema extends AnySchemaHelper<Function> {
    arity(n: number): this;
    minArity(n: number): this;
    maxArity(n: number): this;
    ref(): this;
  }

  /**
   *  Array Schema - ValueType keeps resolved types
   */

  type ResolveToRequired<T> = T extends AnySchemaHelper<infer V> ? V : never;

  type ResolveArrayTypes<T extends GenericSchema[]> = {
    // we force the array types to be required - to prevent putting undefined - [v1, undefined]
    [K in keyof T]: ResolveToRequired<T[K]>;
  };

  interface ExtendedArraySchema<Values = any[], Optional = true>
    extends AnySchemaHelper<Values, Optional> {
    items<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
      ...values: T
    ): ExtendedArraySchema<ResolveToRequired<T[number]>[], Optional>;

    items<T extends GenericSchema[], VT = ResolveArrayTypes<T>>(
      values: T
    ): ExtendedArraySchema<VT, Optional>;

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

  // export type GetOptionalKeys<T extends ObjectSchemaArgument> = Exclude<
  //   keyof T,
  //   GetRequiredKeys<T>
  // >;

  // export type GetRequiredKeys<T extends Record<any, any>> = {
  //   [K in keyof T]: T[K] extends Exclude<T[K], undefined> ? K : never;
  // }[keyof T];

  type GetOptionalKeys<T, K = keyof T> = {
    [J in K extends keyof T
      ? T[K] extends AnySchemaHelper<any, infer O>
        ? O extends true
          ? K
          : never
        : never
      : never]: true;
  };

  // type OptionalObjectKeys<T, Keys> = {
  //   [K in keyof T as Extract<K, Keys>]?: T[K] | undefined;
  // };
  //
  // type RequiredObjectKeys<T, Keys> = {
  //   [K in keyof T as Extract<K, Keys>]-?: T[K];
  // };
  //
  // type ResolveObjectValues<T> = {
  //   [K in keyof T]: pullType<T[K]>;
  // };

  type ResolveObjectTypes<
    T extends ObjectSchemaArgument = {},
    Keys = keyof T,
    OptionalKeys = GetOptionalKeys<T>
  > =
    // RequiredKeys = Exclude<keyof T, OptionalKeys>
    {
      [K in keyof OptionalKeys]?: K extends keyof T ? pullType<T[K]> : string;
    } & {
      [K in Exclude<keyof T, keyof OptionalKeys>]: K extends keyof T ? pullType<T[K]> : K;
    };

  interface ExtendedObjectSchema<ValueType = {}, Optional = false>
    extends AnySchemaHelper<ValueType, Optional> {
    keys<T extends ObjectSchemaArgument>(
      schema: T
    ): ExtendedObjectSchema<ValueType & ResolveObjectTypes<T>, Optional>;

    append<T extends ObjectSchemaArgument>(
      schema: T
    ): ExtendedObjectSchema<ValueType & ResolveObjectTypes<T>, Optional>;

    pattern<T extends GenericSchema>(
      pattern: any,
      schema: T
    ): ExtendedObjectSchema<{ [key: string]: ResolveToRequired<T> } & ValueType, Optional>;
  }

  interface ExtendedAlternativeSchema<ValueType = undefined, Optional = false>
    extends AnySchemaHelper<ValueType, Optional> {
    try<T extends GenericSchema[], VT = ResolveToRequired<T[number]>>(
      ...values: T
    ): ExtendedAlternativeSchema<VT, Optional>;
    try<T extends GenericSchema[], VT = ResolveToRequired<T[number]>>(
      values: T
    ): ExtendedAlternativeSchema<VT, Optional>;
  }

  /**
   *  Methods
   */

  export function exist(): ExtendedAnySchema<{}, false>;
  export function required(): ExtendedAnySchema<{}, false>;
  export function not(): ExtendedAnySchema<never, false>;

  export function any(): ExtendedAnySchema;
  export function string(): ExtendedStringSchema;
  export function number(): ExtendedNumberSchema;
  export function boolean(): ExtendedBooleanSchema;
  export function date(): ExtendedDateSchema;
  export function func(): ExtendedFunctionSchema;
  export function array(): ExtendedArraySchema;

  export function valid<T extends Primitive[]>(...values: T): AnySchemaHelper<T[number], false>;
  export function valid<T extends Primitive[]>(
    values: T[]
  ): ExtendedAnySchema<typeof values[number], false>;

  export function object<T>(
    schema?: T
  ): ExtendedObjectSchema<T extends ObjectSchemaArgument ? ResolveObjectTypes<T> : {}>;

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

  export function alternatives<T extends GenericSchema[], VT = ResolveToRequired<T[number]>>(
    ...alternatives: T
  ): ExtendedAlternativeSchema<VT>;

  export function alternatives<T extends GenericSchema[], VT = ResolveToRequired<T[number]>>(
    values: T
  ): ExtendedAlternativeSchema<VT>;

  export function alt<T extends GenericSchema[], VT = ResolveToRequired<T[number]>>(
    ...alternatives: T
  ): ExtendedAlternativeSchema<VT>;

  export function alt<T extends GenericSchema[], VT = ResolveToRequired<T[number]>>(
    values: T
  ): ExtendedAlternativeSchema<VT>;

  type GenericSchema = AnySchemaHelper<any, boolean>;
  type ObjectOrArraySchema = GenericSchema | GenericSchema[];
  type ObjectSchemaArgument = {
    [k: string]: ObjectOrArraySchema;
  };

  // type UploadObject<T> = { [I in keyof T]: T[I] };

  type pullType<T> = T extends AnySchemaHelper<infer V, infer O>
    ? O extends true
      ? V | undefined
      : V
    : T;

  // TODO: add
  //  pullInType = pullType
  //  pullOutType = pullType where default types are mandatory
}
