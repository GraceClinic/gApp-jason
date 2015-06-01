/**
 * App_WordShuffle Class
 *
 * The WordShuffle module.  Encapsulates all controllers, models, and directives that create the WordShuffle game.
 *
 * Dependency injections:
 * @param   ui.router   {object}    reference to angularjs ui.router module
 * @param   ngSanitize  {object}    reference to angularjs ngSanitize module
 *
 **/

/**
 * DETAILED SPECIFICATION
 *
 * There are no special configurations are run blocks for the WordShuffle module.  The App_Configs_Routes handles all
 * necessary routing within this module through the URL parameters:  module, controller, and action.  This module
 * simply declares a namespace for itself within the AngularJS framework by registering itself to the App top-level
 * module.  All of its controllers, models, and directives will register with this declared module namespace.  The
 * "ui.router" module is listed as a dependency because App_Common_Models_SysMan requires access to "$state" service
 * which is registered to the "ui.router" module.  SysMan is referenced many times within App_WordShuffle, hence
 * it requires the dependency.  In addition, this module requires access to the $sce service found within ngSanitize.
 * It needs this to display HTML text found in WordShuffle_Models_Instructions_Page object.
 *
 **/
 