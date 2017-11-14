const assert = require('assert')
const should = require('should')
const sinon = require('sinon')

require('should-sinon')

const { chain, choose } = require('../lib/index')

const _ctx = { id: 1 }

describe('When choosing from two pipes', () => {
  describe('and none results in success.', async () => {
    const first = sinon.stub().resolves(null)
    const second = sinon.stub().resolves(null)

    const pipe = choose([ first, second ])
    const res = pipe(_ctx)

    it('should process both pipes and return undefined', () => should(res).be.fulfilledWith(undefined))

    it('should call the first function once with the context', () =>
      should(first).be.calledOnce().and.be.calledWithExactly(_ctx))

    it('should call the second function once with the context', () =>
      should(second).be.calledOnce().and.be.calledWithExactly(_ctx))
  })

  describe('and the first one results in success.', () => {
    const first = sinon.stub().resolves(_ctx)
    const second = sinon.stub().resolves(null)

    const pipe = choose([ first, second ])

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

    const pipe = choose([ first, second ])

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
    const first = sinon.stub().resolves()
    const second = sinon.stub().resolves()

    const pipe = chain([ first, second ])

    it('should process only the first pipe and return null.', async () => {
      const res = await pipe(_ctx)

      assert.equal(res, undefined)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and the first one results in success.', () => {
    const first = sinon.stub().resolves(_ctx)
    const second = sinon.stub().resolves()

    const pipe = chain([ first, second ])

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

    const pipe = chain([ first, second ])

    it('should process only the first pipe and return null.', async () => {
      const res = await pipe(_ctx)

      assert.deepEqual(res, undefined)
      sinon.assert.calledOnce(first)
      sinon.assert.calledWithExactly(first, _ctx)
      sinon.assert.notCalled(second)
    })
  })

  describe('and both result in success.', () => {
    const first = sinon.stub().resolves(_ctx)
    const second = sinon.stub().resolves(_ctx)

    const pipe = chain([ first, second ])

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
