import * as assert from 'assert'
import 'mocha'
import * as sinon from 'sinon'
import { chain, choose } from '../src'

interface Context { id: number }
const _ctx: Context = { id: 1 }

describe('When choosing from two pipes', () => {
  describe('and none results in success.', async () => {
    const first = sinon.stub().resolves(null)
    const second = sinon.stub().resolves(null)

    const pipe = choose([first, second])

    it('should process both pipes and return null.', async () => {
      const res = await pipe(_ctx)

      assert.equal(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, _ctx)
    })
  })

  describe('and the first one results in success.', () => {
    const first = sinon.stub().resolves(_ctx)
    const second = sinon.stub().resolves(null)

    const pipe = choose([first, second])

    it('should only process the first pipe and return the context.', async () => {
      const res = await pipe(_ctx)

      assert.deepEqual(res, _ctx)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and the second one results in success.', () => {
    const first = sinon.stub().resolves(null)
    const second = sinon.stub().resolves(_ctx)

    const pipe = choose([first, second])

    it('should process both pipes and return the context.', async () => {
      const res = await pipe(_ctx)

      assert.deepEqual(res, _ctx)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, _ctx)
    })
  })
})

describe('When chaining two pipes', () => {
  describe('and none results in success.', async () => {
    const first = sinon.stub().resolves(null)
    const second = sinon.stub().resolves(null)

    const pipe = chain([first, second])

    it('should process only the first pipe and return null.', async () => {
      const res = await pipe(_ctx)

      assert.equal(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and the first one results in success.', () => {
    const first = sinon.stub().resolves(_ctx)
    const second = sinon.stub().resolves(null)

    const pipe = chain([first, second])

    it('should process both pipes and return null.', async () => {
      const res = await pipe(_ctx)

      assert.deepEqual(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, _ctx)
    })
  })

  describe('and the second one results in success.', () => {
    const first = sinon.stub().resolves(null)
    const second = sinon.stub().resolves(_ctx)

    const pipe = chain([first, second])

    it('should process only the first pipe and return null.', async () => {
      const res = await pipe(_ctx)

      assert.deepEqual(res, null)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and both result in success.', () => {
    const first = sinon.stub().resolves(_ctx)
    const second = sinon.stub().resolves(_ctx)

    const pipe = chain([first, second])

    it('should process both pipes and return the context.', async () => {
      const res = await pipe(_ctx)

      assert.deepEqual(res, _ctx)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.calledOnce(second)
      sinon.assert.calledWithExactly(second, _ctx)
    })
  })
})
