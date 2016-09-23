<?php
/**
 * @class WordShuffle_Player_StatsController
 *
 * @property   
 */
class WordShuffle_Player_StatsController extends Common_Abstracts_RestController
{

    // todo: define model class name proxied by this controller
    protected
        $_modelClass = 'WordShuffle_Model_Player_Stats';

    // todo:  determine extend the init(), do not override original init() function

    // todo:  determine if you will extend or override the abstract indexAction()
    public function indexAction()
    {
        $roundDuration = $this->getRequest()->getParam('roundDuration');
        $this->_SysMan->Logger->info('roundDuration Received ='.$roundDuration,$this->_className);
        $this->_SysMan->Logger->info('START '.$this->_className.'->getAction()',$this->_className);
        $this->_model = new $this->_modelClass();
        $this->_SysMan->Logger->info('START '.$this->_modelClass.'->find()',$this->_className);
        $success = $this->_model->find($roundDuration);
        $this->_SysMan->Logger->info('END '.$this->_modelClass.'->find()',$this->_className);

        $response = Array(
            "model" => $this->_model->toArray(true)
        );

        $this->_SysMan->Logger->info('END '.$this->_className.'->getAction()',$this->_className);

        $this->getResponse()->appendBody(json_encode($response));
    }

    // todo:  determine if you will extend or override the abstract getAction()
    public function getAction($id = 0)
    {
        $this->FORBID = true;
    }

    // todo:  determine if you will extend or override the abstract putAction()
    public function putAction($id = 0)
    {
        $this->FORBID = true;
    }

    // todo:  determine if you will extend or override the abstract postAction()
    public function postAction($model = Array(), $method = '', $args = Array(), $noModel = false)
    {
        if(getenv('APPLICATION_ENV') == 'testing')
            parent::postAction($model, $method, $args, $noModel);
        else {
            $this->ERROR_INFO = 'POST Action is not allowed in '.getenv('APPLICATION_ENV').' environment';
            $this->toJSONResponse(
                array('message' => $this->ERROR_INFO), 1, self::HTTP_FORBIDDEN
            );
        }

    }

    // todo:  determine if you will extend or override the abstract deleteAction()
    public function deleteAction($id = 0)
    {
        $this->FORBID = true;
    }

    // todo:  determine if you will extend the preDispatch() method, do not override original

    // todo:  determine if you will extend the postDispatch() method, do not override original

}
