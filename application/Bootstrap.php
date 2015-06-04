<?php

require_once('common/models/SysMan.php');
require_once('common/models/Session.php');

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initConfig()
    {
        Zend_Registry::set('config', new Zend_Config($this->getOptions()));
    }

    protected function _initDoctype()
    {
        $this->bootstrap('view');
        $view = $this->getResource('view');
        $view->doctype('XHTML1_STRICT');
    }

    /**
     *  define constants
     */
    protected function _initConstants()
    {
        $options = $this->getOption('constants');

        if (is_array($options)) {
            foreach($options as $key => $value) {
                if(!defined($key)) {
                    define($key, $value);
                }
            }
        }
    }

    /**
     * Enable Firebug and FirePHP query logging.
     */
    protected function _initDbProfiler()
    {
        $this->bootstrap("db");
        $db = $this->getResource("db");
        $db->setProfiler(new Zend_Db_Profiler_Firebug());
        $db->getProfiler()->setEnabled(TRUE);
    }

    /**
     * This function allows access to the database connection from all classes.
     *
     * @return Zend_Db_Adapter_Abstract
     */
    protected function _initDb()
    {
        $params = array(
            'host'     => 'localhost',  //DO NOT CHANGE THESE SETTINGS
            'username' => 'gappUsr',        //Update your mysql database to use this user
            'password' => 'gappUsr2gapp',
            'dbname'   => 'gapp',        //Must stay uppercase; Case sensitive in CentOS
        );

        $db = Zend_Db::factory('PDO_MYSQL', $params);
        Zend_Db_Table::setDefaultAdapter($db);
        // create the connection in order to interface
        $db->getConnection();
        Zend_Registry::set('db', $db);

        return $db;

    }

    /**
     * Create a logger object and insert it into Zend_Registry
     */
    protected function _initLogger()
    {
        $this->bootstrap("log");
        /** @var Zend_Log $logger */
        $logger = $this->getResource("log");
        $logger->setTimestampFormat("Y-m-d H:i:s");
        Zend_Registry::set("logger", $logger);
    }
    protected function _initSessionNamespaces()
    {
        $this->bootstrap('session');

        // Zend_Session::setOptions(array('strict'=>true));

        // If you want all requests to have and use sessions, then place this function call early and
        // unconditionally in your bootstrap code.
        Zend_Session::start();

        if(Zend_Session::sessionExists()){
            $sessionExists = true;
        }else{
            $sessionExists = false;
        }

        Common_Models_Session::initSession();

        $msg = 'START Zend application; ';
        if($sessionExists){
            $msg = $msg.'Session exists, session object: ';
        }else{
            $msg = $msg.'Session created and initialized: ';
        }
        $msg = $msg.PHP_EOL.'{'.print_r(Common_Models_SysMan::getInstance()->Session->toArray(),true)."}";
        Common_Models_SysMan::getInstance()->Logger->info($msg,'Bootstrap');

    }

    public function __destruct(){
        if(!Zend_Session::isDestroyed()){
            Common_Models_SysMan::getInstance()->Logger->info('END application','Bootstrap');
        }
    }

}

