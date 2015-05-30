/**
 * App Class
 *
 * The AngularJS root module for the entire web application
 *
 * @param   ui.router       {object}            Angularjs module for controlling URL state
 * @param   ui.bootstrap    {object}            Angularjs module for implementation of Twitter bootstrap functions and features
 * @param   App_Main        {App_Main}          Grace Application main module
 * @param   App_WordShuffle {App_WordShuffle}   Grace Application WordShuffle module
 **/

/**
 * DETAILED SPECIFICATION
 *
 * This is the AngularJS singleton that forms the entire Grace Application.
 *
 * This application has a couple of dependencies on outside vendor provider libraries.  These libraries are found
 * in the "Lib" package located in the root of the AngularJS application.  All of these libraries are loaded through
 * Bower package manager.  First, it requires 'ui.router' for servicing state management at the URL level.  Second,
 * the application requires 'ui.bootstrap' to provide some core styling and DOM elements similar to the Twitter
 * bootstrap library.
 *
 * In regards to the Grace Application itself.  There are presently two modules that compose the application; hence
 * this application module requires them for functionality.  First, the "App_Main" module provides a default landing
 * page and error handling for the site at large.  It is a generic module designed to index the other various modules
 * that compose the Grace Application.  Second, the "App_WordShuffle" module is the first core module contained
 * within the Grace Application.  This is a full web application on its own.  It is a word game that allows players
 * to race the clock in the identification of words within a square matrix.
 *
 * Please consult the AngularJS documentation for the various configurations and initializations possible for an
 * AngularJS module.  As the spec currently stands, the application is configured by the App_Interceptor class and
 * the App_Routes class.
 *
 * https://code.angularjs.org/1.3.15/docs/guide/module
 *
 **/
