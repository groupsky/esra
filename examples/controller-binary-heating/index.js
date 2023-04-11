import { useState } from '../../index.js'

/**
 * Heating controller that controls heating element to match target temperature by turning it off and on
 * @param {boolean} state - true if the heating is on, false otherwise
 * @param {number} targetValue - target temperature
 * @param {number} currentValue - current temperature
 * @param {number} onHysteresis - hysteresis for turning on
 * @param {number} offHysteresis - hysteresis for turning off
 * @return {boolean}
 */
export default ({ targetValue, currentValue, onHysteresis = 0, offHysteresis = 0 }) => {
  const [lastOutput, setLastOutput] = useState(false)
  if (lastOutput) {
    return setLastOutput(currentValue <= targetValue + offHysteresis)
  } else {
    return setLastOutput(currentValue < targetValue - onHysteresis)
  }
}
