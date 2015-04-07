<?php

/**
 * TODO: record description
 * 
 * @package WordShuffle_Model_Page
 * @class   WordShuffle_Model_Page_Page
 * @property    int         idInstructions        - foreign key to instruction record
 * @property    string      body            - fully qualified name to file containing body content
 * @property    int         sequence        - order of page display
 */
class WordShuffle_Model_Page extends Common_Abstracts_Model
{

    /*****************************
     * CLASS CONSTANTS declaration
     *****************************/
    // todo: itemize class constants

    /**
     * << description of init >>
     *
     **/
    protected function init()
    {
		parent::init();
		
		// todo:  determine extension of constructor logic, do not override original init() function, only extend it

    }

    /************************************
     * MODEL PROPERTIES SETTERS / GETTERS
     ************************************/
    // todo:  use "php_prop" live template to insert new properties

    private $_idInstructions = null;
    protected function setIdInstructions($value){
        $this->_idInstructions = (int) $value;
    }
    protected function getIdInstructions(){
        return (int) $this->_idInstructions;
    }

    private $_body = null;
    protected function setBody($value){
        $this->_body = (string) $value;
    }
    protected function getBody(){
        return (string) $this->_body;
    }

    private $_sequence = null;
    protected function setSequence($value){
        $this->_sequence = (int) $value;
    }
    protected function getSequence(){
        return (int) $this->_sequence;
    }
    

    /****************************************
     * MODEL METHODS declaration / definition
     ****************************************/
    // todo:  use "php_method" live template to insert new methods

    /************************************
     * MODEL PRIVATE FUNCTIONS definition
     ************************************/
    // todo: use "php_func" live template to insert to functions
    
    /**
     * << description of preInsert >>
     *
     * @return boolean  Indication to save method that preInsert succeeded; therefore, save can continue
     *
     **/
    protected function _preInsert(){
        $success = true;
        
        // todo: determine if preInsert process required prior to table inserts
        
        return $success;
    }

    /**
     *  << description of preUpdate >>
     *
     * @param Common_Abstracts_Model $old
     * @return boolean  Indication to save method that preUpdate succeeded; therefore, save can continue
     **/
    protected function _preUpdate($old){
         $success = true;
         
       // TODO:  determine if preUpdate process required prior to table update
        
        return $success;
    }

    /**
     * << description of preInsert >>
     *
     * @return boolean  Indication to save method that postSave succeeded; therefore, save can continue
     *
     **/
     protected function _postSave(){
         $success = true;
         
       // TODO:  determine if postSave process required after table update/insert
        
        return $success;
    }

    /**
     * Validates the result of a find operation to insure that it belongs to the requesting user and/or they are allowed
     * to see the results.
     *
     * @return bool
     */
    protected function _validateModel(){
        // todo:  validate the find return to make sure user is allowed to read record
        return true;
    }
}