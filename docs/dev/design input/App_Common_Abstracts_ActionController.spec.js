/**
 * App_Common_Abstracts_ActionController class
 *
 * Action Controller superclass, serves as the base for all angularJS controllers intended to control URL actions.
 * Monitors URL state and triggers action methods based on URL parameters passed to controller.  During construction,
 * this superclass validates if the constructor is properly set.  If all is good, it processes the current controller
 * state to determine if an action method should be triggered.  The controller monitors the URL state through
 * rootScope and triggers state processing as appropriate.  This is not exactly a base class (superclass) since
 * Angularjs does not allow for this functionality against controllers.  It is merely extending the scope object
 * with features and functions provided by this superclass, though it does so without extension of the "this" object
 * or the class prototype.
 *
 * Dependency injections:
 * @param   SysMan          {App_Common_Models_SysMan}      - reference for use by any action controller
 * @param   $stateParams    {object}                        - ui.router state parameters
 * @param   $state          {object}                        - ui.router state object for routing direct state routing
 * @param   $rootScope      {object}                        - angularjs application scope
 * @param   $scope          {object}                        - angularjs local scope to controller
 * @param   self            {object}                        - reference to calling controller extending this base class
 *
 **/

/**
 * PROPERTIES
 * @property    msg {{text: string, type: string}[]}    - array of object messages to display to user formatted as associative
 * @property    SysMan {App_Common_Models_SysMan}       - reference to the SysMan singleton for sharing information across controllers and modules
 * array where index "type" is one of the SysMan constants INFO, CAUTION, or WARNING
 **/

/**
 * METHODS
 * There is no actual "_construct()" method.  The class constructor is the function named after the class.  The method
 * definition below serves as documentation for the constructor logic.
 */
/**
 * @method goToState
 *      Route application to specified state.  This method has no return value.
 * @param       module	    {string}	- name of the module
 * @param       controller	{string}	- name of the controller
 * @param       action	    {string}	- name of the action
 *
 **/