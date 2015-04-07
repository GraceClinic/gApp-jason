<?php

abstract class Common_Abstracts_RestController extends Zend_Rest_Controller
{
    /** Header to read JSON Web Token for ReSTful requests */
    CONST AUTHORIZATION = "Authorization";

    /** HTTP Status Codes */
    CONST HTTP_OK = 200;
    CONST HTTP_CREATED = 201;
    CONST HTTP_MOVED_PERM = 301;
    CONST HTTP_BAD_REQUEST = 400;
    CONST HTTP_UNAUTHORIZED = 401;
    CONST HTTP_FORBIDDEN = 403;
    CONST HTTP_FILE_NOT_FOUND = 404;
    CONST HTTP_METHOD_NOT_ALLOWED = 405;
    CONST HTTP_TOO_MANY_REQUESTS = 429;
    CONST HTTP_INTERNAL_SERVER_ERROR = 500;

    /**
     * Flag the user as not authorized to perform an action
     * Raised automatically when SysMan::Trigger stops usage.
     * @var bool
     */
    protected $NOT_AUTHORIZED = true;
    /**
     * Flag the user as forbidden from performing an action.
     * Raise this flag in actions like update or delete when accessing other user data
     * @var bool
     */
    protected $FORBID = false;
    /** @var bool Flag the request as triggered an Internal Server Error */
    protected $SERVER_ERROR = false;
    /** @var null PlaceHolder for error details to provide on Server Errors */
    protected $ERROR_INFO = null;
    /** @var null */
    protected $AuthToken = null;
    /** @var Common_Models_SysMan */
    protected $_SysMan = null;
    /** @var Common_Abstracts_Model */
    protected $_model = null;
    /** @var string */
    protected $_modelClass = null;

    public function init()
    {
        //Disable Internal Zend Layout and Renderer. Allows for toJSONResponse to set JSON data
        $this->_helper->layout->disableLayout();
        $this->_helper->viewRenderer->setNoRender(TRUE);

        $this->_SysMan = Common_Models_SysMan::getInstance();

        //AngularJS POST encodes the data element as a JSON object.
        //Zend/PHP has trouble understanding that format without calling json_decode first.
        try {
            $contents = file_get_contents("php://input");
            if ($contents) {
                $JSONPostParams = json_decode($contents);
                // transfer contents of JSON data array to Post parameters
                foreach ($JSONPostParams as $key => $value) {
                    $this->getRequest()->setParam($key, $value);
                }
                $this->_SysMan->Logger->info(get_class($this).'.init(), parameters = '.print_r($JSONPostParams,true));
            }
        } catch (Exception $e) {
            // todo:  log error
//            $this->SysMan->log->err("Problem applying JSON post parameters");
            $this->SERVER_ERROR = true;
            $this->ERROR_INFO = "Problem applying JSON post parameters";
        }
    }

    public function indexAction(){
        // this is anonymous play
        $this->_model = new $this->_modelClass();
        $this->_model->find();

        $response = Array(
            "model" => $this->_model->toArray(true)
        );

        $this->getResponse()->appendBody(json_encode($response));
    }

    public function getAction($id = 0){

        $this->_model = new $this->_modelClass($id);
        $this->_model->find();

        $response = Array(
            "model" => $this->_model->toArray(true)
        );

        $this->getResponse()->appendBody(json_encode($response));

    }

    public function putAction($model = Array()){
        $this->_model = new $this->_modelClass($model);
        $this->_model->save();

        $response = Array(
            "model" => $this->_model->toArray(true)
        );

        $this->getResponse()->appendBody(json_encode($response));
    }

    public function postAction($model = Array(), $method = '', $arguments = Array()){
        $this->_model = new $this->_modelClass($model);
        $results = $this->_model->$method($arguments);
        $response = Array(
            "model" => $this->_model->toArray(true),
            "method" => $method,
            "results" => $results
        );

        $this->getResponse()->appendBody(json_encode($response));
    }

    public function deleteAction($model = Array()){
        $this->_model = new $this->_modelClass($model);

        $results = $this->_model->delete();

        $response = Array(
            "model" => $this->_model->toArray(true),
            "results" => $results
        );

        $this->getResponse()->appendBody(json_encode($response));
    }

    /**
     * CORS headers. Allows cross site requests to the server
     */
    protected function ApplyDefaultHeaders()
    {
        $this->getResponse()
            ->setHeader("Access-Control-Allow-Origin", "*")
            ->setHeader("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, Authorization")
            ->setHeader("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS")
            ->setHeader("content-type", "application/json");
    }

    /**
     * Format Response body, headers, and status code.
     * Easier interface for DRY approach to API returns;
     * @param array $returnArr
     * @param $error
     * @param int $statusCode
     * @throws Zend_Controller_Response_Exception
     */
    protected function toJSONResponse(array $returnArr, $error=0, $statusCode = self::HTTP_OK)
    {
        $response = $this->getResponse();

        if ($error) {
            $response->clearAllHeaders()->clearBody();
        }
        $returnArr['error'] = $error;

        $response->setBody(
            Zend_Json_Encoder::encode($returnArr)
        )->setHttpResponseCode($statusCode);

        //Apply CORS headers
        $this->ApplyDefaultHeaders();
    }

    /**
     *
     */
    public function headAction()
    {
    }

    /**
     * This is for returning a help file to a developer
     *
     */
    public function optionsAction()
    {
        $this->ApplyDefaultHeaders();

        $this->getResponse()
            ->setBody(Zend_Json_Encoder::encode("Options Data"))
            ->setHttpResponseCode(200)
            ->setHeader("Access-Control-Max-Age", "3600");
    }


    /**
     *  CONTROLLER ABSTRACT FUNCTIONS
     */

    /**
     * Before dispatching the requested controller/action
     *
     */
    public function preDispatch()
    {
        $request = $this->getRequest();
        //Log every page request with the SysMan before processing actions.
        $this->_SysMan->state = array(
            'module' => strtolower($request->getParam('module')),
            'controller' => strtolower($request->getParam('controller')),
            'action' => strtolower($request->getParam('action')),
        );
        // todo: execute state handling through SysMan
        $this->NOT_AUTHORIZED = FALSE;
    }

    /**
     *
     */
    public function postDispatch()
    {
        if ($this->NOT_AUTHORIZED) {
            $this->toJSONResponse(
                array('message' => self::HTTP_UNAUTHORIZED . " Not Authorized"), 1, self::HTTP_UNAUTHORIZED
            );
        } elseif ($this->FORBID) {
            $this->toJSONResponse(
                array('message' => self::HTTP_FORBIDDEN . " Forbidden"), 1, self::HTTP_FORBIDDEN
            );
        } elseif ($this->SERVER_ERROR) {
            $this->toJSONResponse(
                array('message' => $this->ERROR_INFO), 1, self::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Overridden to allow actions in the API to have function parameters
     * http://devzone.zend.com/1138/actions-now-with-parameters/
     * @param string $action
     * @throws Exception
     */
    public function dispatch($action)
    {
        $this->preDispatch();
        if (!$this->NOT_AUTHORIZED && !$this->FORBID && !$this->SERVER_ERROR) {
            try {
                //Dispatch the action, with named parameters as able
                // Get all request parameters
                $params = $this->getRequest()->getParams();

                // Get all action method parameters
                $method_params_array = $this->get_action_params($action);

                $data = array(); // It will send to the action

                foreach ($method_params_array as $param) {
                    $name = $param->getName();
                    if ($param->isOptional()) { // Check whether the parameter is optional
                        // If there is no data to send, use the default
                        $data[$name] = !empty($params[$name]) ? $params[$name] : $param->getDefaultValue();
                    } elseif (empty($params[$name])) {
                        // The parameter cannot be empty as defined
                        throw new Exception('Parameter: ' . $name . ' Cannot be empty');
                    } else {
                        $data[$name] = $params[$name];
                    }
                }
                //Call the controller action with parameters
                try{
                    call_user_func_array(array($this, $action), $data);
                }catch(Exception $e){
                    $this->SERVER_ERROR = true;
                    $this->ERROR_INFO = $e->getMessage();
                    //echo $e->getMessage();
                }
            } catch (Exception $e) {
                $this->SERVER_ERROR = true;
                $this->ERROR_INFO = $e;
                // todo:  route to error controller on JS side
                return;
            }
        }
        $this->postDispatch();
    }

    /**
     * Helper function for Dispatch override
     * @param $action
     * @return ReflectionParameter[]
     */
    private function get_action_params($action)
    {
        $classRef = new ReflectionObject($this);
        $className = $classRef->getName();
        $funcRef = new ReflectionMethod($className, $action);
        $paramsRef = $funcRef->getParameters();
        return $paramsRef;
    }

}
