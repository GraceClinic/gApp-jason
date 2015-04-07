<?php
/**
 * @class WordShuffle_Instructions
 *
 * @property   
 */
class WordShuffle_InstructionsController extends Common_Abstracts_RestController
{

    /*
     * << description of init >>
     *
     */
     public function init()
    {
		parent::init();
		
		// todo:  determine extension of constructor logic, do not override original init() function, only extend it

    }

    // todo:  determine what happens on a get with no parameter specified
    public function indexAction(){
    
        // todo:  instantiate appropriate model
        $model = new WordShuffle_Model_Instructions();
        $model->find();
        
        // todo:  perhaps findAll
        //$all = $model->findAll();

        $response = Array(
            "model" => json_decode($model->toJSON())
        );

        $this->getResponse()->appendBody(json_encode($response));
    }

    public function getAction($id = 0){

        $model = new WordShuffle_Model_Instructions();
        $model->find();

        $response = Array(
            "model" => json_decode($model->toJSON())
        );

        $this->getResponse()->appendBody(json_encode($response));

    }

    // todo:  itemize post data as parameters
    public function putAction($id = 0){
        
        // creation of new instructions not Allowed!
        $this->toJSONResponse(
            array('message' => self::HTTP_METHOD_NOT_ALLOWED . " Cannot create new WordShuffle Instructions!"), 1, self::HTTP_METHOD_NOT_ALLOWED
        );

    }

    // todo:  itemize post data as parameters
    public function postAction($id = 0){

        // update of instruction not Allowed!
        $this->toJSONResponse(
            array('message' => self::HTTP_METHOD_NOT_ALLOWED . " Cannot update WordShuffle Instructions!"), 1, self::HTTP_METHOD_NOT_ALLOWED
        );

    }

    public function deleteAction(){
        // delete of instruction not Allowed!
        $this->toJSONResponse(
            array('message' => self::HTTP_METHOD_NOT_ALLOWED . " Cannot delete WordShuffle Instructions!"), 1, self::HTTP_METHOD_NOT_ALLOWED
        );
    }

}
