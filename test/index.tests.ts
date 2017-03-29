import * as assert from 'assert'
import 'mocha'
import * as sinon from 'sinon'
import { chain, choose } from '../src'

type Context = { id: number }
const ctx = { id: 1 }

describe('When choosing from two pipes', () => {
  describe('and none results in success.', async () => {
    const first = sinon.spy((c: Context) => Promise.resolve(null))
    const second = sinon.spy((c: Context) => Promise.resolve(null))

    const pipe = choose([first, second])

    it('should process both pipes and return null.', async () => {
      const res = await pipe(ctx)

      assert.equal(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, ctx)
    })
  })

  describe('and the first one results in success.', () => {
    const first = sinon.spy((c: Context) => Promise.resolve(c))
    const second = sinon.spy((c: Context) => Promise.resolve(null))

    const pipe = choose([first, second])

    it('should only process the first pipe and return the context.', async () => {
      const res = await pipe(ctx)

      assert.deepEqual(res, ctx)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and the second one results in success.', () => {
    const first = sinon.spy((c: Context) => Promise.resolve(null))
    const second = sinon.spy((c: Context) => Promise.resolve(c))

    const pipe = choose([first, second])

    it('should process both pipes and return the context.', async () => {
      const res = await pipe(ctx)

      assert.deepEqual(res, ctx)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, ctx)
    })
  })
})

describe('When chaining two pipes', () => {
  describe('and none results in success.', async () => {
    const first = sinon.spy((c: Context) => Promise.resolve(null))
    const second = sinon.spy((c: Context) => Promise.resolve(null))

    const pipe = chain([first, second])

    it('should process only the first pipe and return null.', async () => {
      const res = await pipe(ctx)

      assert.equal(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and the first one results in success.', () => {
    const first = sinon.spy((c: Context) => Promise.resolve(c))
    const second = sinon.spy((c: Context) => Promise.resolve(null))

    const pipe = chain([first, second])

    it('should process both pipes and return null.', async () => {
      const res = await pipe(ctx)

      assert.deepEqual(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, ctx)
    })
  })

  describe('and the second one results in success.', () => {
    const first = sinon.spy((c: Context) => Promise.resolve(null))
    const second = sinon.spy((c: Context) => Promise.resolve(c))

    const pipe = chain([first, second])

    it('should process only the first pipe and return null.', async () => {
      const res = await pipe(ctx)

      assert.deepEqual(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and both result in success.', () => {
    const first = sinon.spy((c: Context) => Promise.resolve(c))
    const second = sinon.spy((c: Context) => Promise.resolve(c))

    const pipe = chain([first, second])

    it('should process both pipes and return the context.', async () => {
      const res = await pipe(ctx)

      assert.deepEqual(res, ctx)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, ctx)
    })
  })
})
