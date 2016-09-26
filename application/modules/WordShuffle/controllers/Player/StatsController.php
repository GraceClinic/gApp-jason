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

    // todo:  determine if you will extend or override the abstract getAction()

    /**
     * getAction
     *
     * @public
     * @param   int $roundDuration
     * @return void
     */
    public function indexAction()
    {
        $roundDuration = $this->getRequest()->getParam("roundDuration");
        $this->_SysMan->Logger->info('START '.$this->_className.'->indexAction()','Player_StatsController');
        $this->_model = new $this->_modelClass($roundDuration);
        $response = Array(
            "model" => $this->_model->toArray(true)
        );

        $this->_SysMan->Logger->info('END '.$this->_className.'->indexAction()','Player_StatsController');
        $this->getResponse()->appendBody(json_encode($response));
    }


    // todo:  determine if you will extend or override the abstract putAction()

    // todo:  determine if you will extend or override the abstract postAction()
    /**
     * overriding postAction and validating the environment
     *
     * @public                 
     * @param   $model  -model sent from the front end
     * @param   $method -which method to be called
     * @param   $args   -arguments for the called method
     * @param   $noModel    -if you want to send a model back
     * @return void     
     */
    public function postAction($model = Array(), $method = '', $args = Array(), $noModel = false)
    {
        if (getenv('APPLICATION_ENV') == 'testing') {
            parent::postAction($model, $method, $args, $noModel);
        }
        else {
            $this->FORBID = true;
        }
    }
    
    
    // todo:  determine if you will extend or override the abstract deleteAction()
    
    /**
     * deleteAction overridden, not permitted
     *
     * @public                 
     * @param   $id -id of the record in table
     * @return void     
     */
    public function deleteAction($id=0)
    {
        $this->FORBID = true;
    }

    // todo:  determine if you will extend the preDispatch() method, do not override original

    // todo:  determine if you will extend the postDispatch() method, do not override original

    /**
     * putAction overridden, not permitted
     *
     * @public
     * @param   $model  -model with set parameters to insert into db
     * @return void
     */
    public function putAction($model = Array())
    {
        $this->FORBID = true;
    }


}
