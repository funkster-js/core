export type Option<T> = T | void
export type Transform<In, Out> = (source: In) => Promise<Option<Out>>
export type Pipe<Context> = Transform<Context, Context>

export const unapplicable = Promise.resolve()

export function never<Context> (ctx?: Context) {
  return unapplicable
}

export function always<Context> (ctx: Context) {
  return Promise.resolve(ctx)
}

export async function bind<Context> (
  r: Promise<Option<Context>>,
  f: Pipe<Context>
) {
  try {
    const res = await r
    if (!res) return unapplicable

    return f(res)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function map<Context> (
  r: Promise<Option<Context>>,
  f: (ctx: Context) => Option<Context>
) {
  return bind(r, (ctx: Context) => {
    const res = f(ctx)
    return Promise.resolve(res)
  })
}

export function compose<Context> (
  first: Pipe<Context>,
  second: Pipe<Context>
): Pipe<Context> {
  return (ctx: Context) => bind(first(ctx), second)
}

async function chooseFrom<Context> (a: Context, parts: Array<Pipe<Context>>) {
  for (const part of parts) {
    const res = await part(a)

    if (res) return res
  }
}

export function choose<Context> (parts: Array<Pipe<Context>>): Pipe<Context> {
  if (parts.length === 0) return never

  return (ctx: Context) => chooseFrom(ctx, parts)
}

export function chain<Context> (parts: Array<Pipe<Context>>) {
  if (parts.length === 0) return never

  return parts.reduce(compose)
}
