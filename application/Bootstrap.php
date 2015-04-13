<?php

require_once('common/models/SysMan.php');

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
            'username' => 'e4User',        //Update your mysql database to use this user
            'password' => 'e4User2e4',
            'dbname'   => 'e4',        //Must stay uppercase; Case sensitive in CentOS
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
        //Zend_Session::start();

        $session = Common_Models_SysMan::initSession();

        // make the session handler available to all function who need it
        Zend_Registry::set('session', $session);
        Common_Models_SysMan::getInstance()->Logger->info('Zend session started');

        if($session->idPlayer == 0){
            Common_Models_SysMan::getInstance()->Logger->info('Zend session does not exists, created and initialized');
        }else{
            Common_Models_SysMan::getInstance()->Logger->info('Zend session exists, session object: '.
                print_r(Common_Models_SysMan::getInstance()->Session->toArray(),true));
        }

//
//        // if user identified, maintain session variables, otherwise initialize session variables
//        if (!isset($session->idGame)) {
//            // stuff
//            $session->idGame = 0;
//            $session->idPlayer = 0;
//            $session->playerName = '';
//            $session->idChallenge = 0;
//            $session->roundsPerGame = 3;
//            $session->secondsPerRound = 120;
//            $session->start = null;
//            $session->end = null;
//            $session->points = 0;
//            $session->roundAvg = 0;
//            $session->signInState = 0;
//            $session->Rounds = Array();
//        }


    }


}

