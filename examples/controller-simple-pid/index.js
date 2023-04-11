import { useState } from '../../index.js'

/**
 * Simple pid controller
 * @link https://en.wikipedia.org/wiki/PID_controller
 *
 * @param {number} p - proportional coefficient
 * @param {number} i - integral coefficient
 * @param {number} d - derivative coefficient
 * @param {number} pv - measured process variable
 * @param {number} sp - desired set-point
 * @return {number} - output
 */
export default ({ p, i, d, pv, sp }) => {
  const [lastError, setLastError] = useState()
  const error = sp - pv
  setLastError(error)

  // get the elapsed time since last execution defaulting to 1 for the first run
  const timestamp = Date.now()
  const [lastTimestamp, setLastTimestamp] = useState()
  const dt = lastTimestamp != null ? (timestamp - lastTimestamp) / 1000 : null
  setLastTimestamp(timestamp)

  // compute the integral
  const [lastIError, setLastIError] = useState()
  const iError = dt == null ? null : lastIError != null ? lastIError + error * dt : error * dt
  setLastIError(iError)

  // compute the derivative
  const dError = lastError != null && dt != null ? (error - lastError) / dt : null

  return iError != null && dError != null ? p * error + i * iError + d * dError : null
}
