<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 11/9/14
 * Time: 5:17 PM
 */
/**
 * Class Common_Models_Logger
 *
 * Logger class handles writing lines to the application.log file.  Messages may be
 * classified as {@see DEBUG}, {@see INFO INFO}, {@see WARN WARN }, or {@see ERR ERR}
 *
 * @property    int         logLevel    Determines verbosity of logging
 *
 */
class Common_Models_Logger
{
    const DEBUG = 3;
    const INFO  = 2;
    const WARN  = 1;
    const ERR   = 0;

    const
        ERRNO_NO_ERROR = 0,
        ERRNO_APP_ERROR = 10,
        ERRNO_CTRL_ERROR = 20,
        ERRNO_CTRL_ACTION_ERROR = 30,
        ERRNO_MODEL_ERROR = 40,
        ERRNO_MODEL_SAVE_ERROR = 50,
        ERRNO_MODEL_GET_ERROR = 60;

    private
        $logLevel = self::DEBUG,
        $logger;               /** @var Zend_Log _logger Handle to Zend logging object*/

    /**
     * Constructor. Attach to the Zend log writer and set the log level if given (default to self:ERR
     *
     * @param int $level
     */
    public function __construct($level = self::ERR)
    {
        $this->logLevel = $level;
        $this->logger   = Zend_Registry::get('logger');
    }

    public function setLogLevel($level = self::ERR)
    {
        $this->logLevel = $level;
    }
    public function getLogLevel()
    {
        return $this->logLevel;
    }
    /**
     * Log a message
     *
     * @param int    $level  Class constant for logging level
     * @param string $code   Error code to log
     * @param string $string Error message to log
     * @return bool
     */
    public function Log($level, $code, $string)
    {
        if ($level > $this->logLevel) { //Stop messages that are above the logging level
            return false;
        }
        $prepend = "[".$_SERVER['REMOTE_ADDR'].":".$_SERVER['REMOTE_PORT']."] ".
            "[User:".Common_Models_SysMan::getInstance()->Session->idPlayer."]: ";
        if($code){
            $message = $prepend."ErrorCode ".$code.": ".$string;
        }else{
            $message = $prepend.$string;
        }
        try {
            switch ($level) {
                case self::DEBUG:
                    $this->logger->debug($message);
                    break;
                case self::INFO:
                    $this->logger->info($message);
                    break;
                case self::WARN:
                    $this->logger->warn($message);
                    break;
                case self::ERR:
                    $this->logger->err($message);
                    break;
            }
            return TRUE;
        }
        catch (Exception $exc) {
            //Some Error occurred. Attempt to error log it and echo it out to the page
            //Some Error occurred. Attempt to echo it out to the page
            $msg = '<br>LOGGER ERROR. Unable to log priority ' . $level . ' message \'' . $string . '\'' . PHP_EOL .
                '<br>Error code: ' . $exc->getCode() . PHP_EOL .
                '<br>Error Desc: ' . $exc->getMessage();
            echo $msg;

            return FALSE;
        }
    }

    /**
     * Insert a message in the log file with a type of "DEBUG"
     *
     * @param string $message Message to be logged
     * @return bool True on success, false otherwise
     */
    public function debug($message)
    {
        return $this->Log(self::DEBUG,false,$message);
    }

    /**
     * Insert a message in the log file with a type of "INFO"
     *
     * @param string $message Message to be logged
     * @return bool True on success, false otherwise
     */
    public function info($message)
    {
        return $this->Log(self::INFO,false,$message);
    }

    /**
     * Insert a message in the log file with a type of "WARN"
     *
     * @param string $message Message to be logged
     * @return bool True on success, false otherwise
     */
    public function warn($message)
    {
        return $this->Log(self::WARN,false,$message);
    }

    /**
     * Insert a message in the log file with a type of "ERR"
     *
     * @param string $message Message to be logged
     * @return bool True on success, false otherwise
     */
    public function err($message)
    {
        return $this->Log(self::ERR,false,$message);
    }

}