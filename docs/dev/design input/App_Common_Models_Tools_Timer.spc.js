/**
 * App_Common_Models_Tools_Timer Class
 *
 * Global application timer for general synchronization needs
 *
 * @returns     {App_Common_Models_Tools_Timer}
 **/

/**
 * PROPERTIES
 * @property    trip     {int}      time periods between trips
 *
 **/
/**
 * @property    trip
 * Milliseconds until timer trips
 *
 * @type        int
 * @public
 */
/**
 * @property    isTripped
 * Tracks when timer hits defined trip time
 *
 * @type        boolean
 * @public
 */
/**
 * @property    now
 * Current timer count since start of timer
 *
 * @type        int
 * @public
 */
/**
 * @property    delta
 * Current count within the active trip window
 *
 * @type        int
 * @public
 */
/**
 * @property    passedTrips
 * Number of trip windows passed since last trip
 *
 * @type        int
 * @public
 */

/**
 * METHODS
 * There is no actual "_construct()" method.  The class constructor is the function named after the class.  The method
 * definition below serves as documentation for the constructor logic.
 */
/**
 * @method  reset
 * Resets the timer to zero
 *
 * @public
 * @returns {number}
 */
