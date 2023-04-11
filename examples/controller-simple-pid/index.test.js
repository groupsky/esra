import { expect, test, vi } from 'vitest'
import controller from './index.js'
import { processRunner } from '../../index.js'

const configuration = {
  p: 1,
  i: 0.1,
  d: 0.001,
  sp: 20,
}

test.each([
  { pv: 0, outputs: [null, 22, 24] },
  { pv: 10, outputs: [null, 11, 12] },
  { pv: 20, outputs: [null, 0, 0] },
  { pv: 30, outputs: [null, -11, -12] },
  { pv: 50, outputs: [null, -33, -36] },
])('returns outputs $outputs for pv $pv', ({ pv, outputs }) => {
  vi.useFakeTimers({
    now: 0,
  })
  const runner = processRunner(controller)

  for (let i = 0; i < outputs.length; i++) {
    const firstResult = runner({ ...configuration, pv })
    expect(firstResult).toEqual(outputs[i])
    vi.advanceTimersByTime(1000)
  }
})

test.each([{ pvs: [0, 5, 10], outputs: [null, 16.495, 12.495] }])(
  'returns outputs $outputs for pvs $pvs',
  ({ pvs, outputs }) => {
    vi.useFakeTimers({
      now: 0,
    })
    const runner = processRunner(controller)

    for (let i = 0; i < outputs.length; i++) {
      const firstResult = runner({ ...configuration, pv: pvs[i] })
      expect(firstResult).toEqual(outputs[i])
      vi.advanceTimersByTime(1000)
    }
  },
)
