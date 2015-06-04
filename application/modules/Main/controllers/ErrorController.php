<?php

class Main_ErrorController extends Main_Controller_Abstract
{

    public function errorAction()
    {
        echo 'errorAction';
        $errors = $this->_getParam('error_handler');
        $msg = $this->_getParam('msg');

        if (!$errors || !$errors instanceof ArrayObject) {
            if($msg){
                $this->view->message = $msg;
            }else{
                $this->view->message = 'You have reached the error page';
            }
            return;
        }

        switch ($errors->type) {
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ROUTE:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_CONTROLLER:
            case Zend_Controller_Plugin_ErrorHandler::EXCEPTION_NO_ACTION:
                // 404 error -- controller or action not found
                $this->getResponse()->setHttpResponseCode(404);
//                $priority = Zend_Log::NOTICE;
                $this->view->message = 'Page not found';
                // route to the root of the AngularJS application
//                $this->_redirect('/app.html');
                break;
            default:
                // application error
                $this->getResponse()->setHttpResponseCode(500);
                $priority = Zend_Log::CRIT;
                $this->view->message = 'Application error';
                break;
        }

        // Log exception, if logger available
        /** @var Zend_Log Handle to Zend logging object*/
        if ($log = $this->getLog()) {
            $priority = Zend_Log::NOTICE;
            $log->log($this->view->message, $priority, $errors->exception);
            $log->log('Request Parameters', $priority, $errors->request->getParams());
        }

        // conditionally display exceptions
        if ($this->getInvokeArg('displayExceptions') == true) {
            $this->view->exception = $errors->exception;
        }

        $this->view->request   = $errors->request;
    }

    /**
     * @return Zend_Log
     */
    public function getLog()
    {
        $bootstrap = $this->getInvokeArg('bootstrap');
        if (!$bootstrap->hasResource('Log')) {
            return false;
        }
        $log = $bootstrap->getResource('Log');
        return $log;
    }


}

