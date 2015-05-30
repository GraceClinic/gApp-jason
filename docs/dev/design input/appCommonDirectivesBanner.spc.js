/**
 * appCommonDirectivesBanner Class
 *
 * Displays message bar across top of a DIV element that houses it.  During construction, the banner
 * directive sets a watcher on the "msg" property.  If the property is non-null, the banner will display each
 * message in the array for the time defined by "expires".  After it displays each message, it is removed from the
 * "msg" array.  When there are no messages remaining, the banner fades to invisible.
 *
 * Dependency injection:
 * @param {App_Common_Models_Tools_Logger}  Logger  - reference to Logger object
 * @param {object}  $interval   - reference to AngularJS $interval object
 *
 * @returns {appCommonDirectivesBanner}     - returns the singleton that services directive features and functions
 *
 **/

/**
 * PROPERTIES
 * @property    msg         {App_Common_Models_Message[]}      Array of App_Common_Models_Message objects
 * @property    expires     {int}                              Milliseconds to display each message element
 *
 **/

/**
 * METHODS
 * There is no actual "_construct()" method.  The class constructor is the function named after the class.  The method
 * definition below serves as documentation for the constructor logic.
 */
/**
 * @method closeMsg()
 * Immediately removes the active message from the "msg" array.  If there are no more messages, the method hides the
 * banner, otherwise the next message displays as appropriate.
 * 
 **/

/**
 * DETAILED SPECIFICATION
 *
 * The Banner Directive allows for display of multiple messages at the top of the containing DIV element.  The directive
 * must display each message for the period of time dictated by the "expires" property.  At the end of the time, the
 * directive must switch to the next message in the array.  If it is the last element, the directive must fade the
 * Banner from view.  The Banner object must be draggable within the containing DIV.  This should be defined as a
 * separate directive.
 *
 **/