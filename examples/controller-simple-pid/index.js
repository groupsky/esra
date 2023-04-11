/**
 * Simple pid controller
 * @link https://en.wikipedia.org/wiki/PID_controller
 *
 * @param {number} p - proportional coefficient
 * @param {number} i - integral coefficient
 * @param {number} d - derivative coefficient
 * @param {number} pv - measured process variable
 * @param {number} sp - desired set-point
 * @param {{output: number, iError: *, error: number, timestamp: number}} lastOutput - last output
 * @return {{output: number, iError: *, error: number, timestamp: number}} - output
 */
export default ({ p, i, d, pv, sp, lastOutput }) => {
  const error = sp - pv

  // get the elapsed time since last execution defaulting to 1 for the first run
  const timestamp = Date.now()
  const dt = lastOutput?.timestamp != null ? (timestamp - lastOutput.timestamp) / 1000 : null

  // compute the integral
  const iError = dt == null ? null : lastOutput?.iError != null ? lastOutput.iError + error * dt : error * dt

  // compute the derivative
  const dError = lastOutput?.error != null && dt != null ? (error - lastOutput.error) / dt : null

  const output = iError != null && dError != null ? p * error + i * iError + d * dError : null

  return { output, timestamp, iError, error, dError }
}
