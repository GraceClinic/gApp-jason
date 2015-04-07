<?php

define('DS', DIRECTORY_SEPARATOR);
// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . DS . '..' . DS . 'application'));

// Define application environment
defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'development'));

define('APP_LIBRARY_PATH', APPLICATION_PATH . DS . 'library');
define('APP_COMMON_PATH', APPLICATION_PATH . DS . 'common');

// Define path to public directory
defined('PUBLIC_PATH')
|| define('PUBLIC_PATH', realpath(dirname(__FILE__)));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    get_include_path(),
    APP_LIBRARY_PATH,
    APP_COMMON_PATH,
    APPLICATION_PATH
)));

/** Zend_Application */
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . DS . 'configs' . DS . 'application.ini'
);
$application->bootstrap()
            ->run();