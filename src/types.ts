export type Option<T> = T | void
export type Transform<In, Out> = (source: In) => Promise<Option<Out>>
export type Pipe<Context> = Transform<Context, Context>
