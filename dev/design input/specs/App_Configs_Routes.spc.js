/**
 * App_Config_Routes Class
 *
 * Routes URL request to proper Controller.
 *
 * Dependency injection:
 * @param   $stateProvider      {object}    Reference to the ui.router stateProvider object for definition of URL states
 * @param   $urlRouterProvider  {object}    Reference to ui.router urlRouterProvider for definition of route alias
 *
 **/

/**
 * DETAILED SPECIFICATION
 *
 * Defines a module, controller, and action hierarchical architecture for the web application.  The complete URL route
 * follows the base application root as '/m/:module/:controller/:action.
 *
 * The :module parameter identifies the first level of routing.  The configuration will apply the module HTML
 * template based on the identified ":module" parameter within the URL.  The template loads from the root of
 * the associated module directory calculated by hashing the module name to the root module views directory,
 * "app/modules/:module/views/".  The template found in that location must be named "Layout.tpl.html".
 *
 * The :controller parameter loads the specific controller template.  It is this template that must load the specific
 * AngularJS controller.  For example, the template for the Welcome controller must contain the following DIV element:
 *
 *      <div ng-controller="WordShuffle_Controllers_Welcome as Welcome">
 *
 * This configuration file loads the controller template from the following file:
 *
 *      app/modules/:module/views/:controller.tpl.html
 *
 * The action route loads the main content for the requested action from the following file:
 *
 *      app/modules/:module/views/:controller/:action.tpl.html
 *
 * All three of these templates must nestle within each other through the AngularJS "ui-view" directive attached to a
 * specific DIV element defining the template load location.
 **/
 