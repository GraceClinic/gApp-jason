<?php
/**
 * Instructions associated with Word Shuffle
 *
 * @package WordShuffle_Model
 * @class   WordShuffle_Model_Instructions
 * @extends Common_Abstracts_Model
 *
 * @property    string      title           - instructions title
 * @property    string      picture         - location to picture associated with instructions
 * @property    WordShuffle_Model_Page[]        Pages  - array of instruction pages
 * @property    WordShuffle_Model_Mapper_Instructions   Mapper
 */
class WordShuffle_Model_Instructions extends Common_Abstracts_Model
{

    /*****************************
     * CLASS CONSTANTS declaration
     *****************************/
    const   INSTRUCTIONS_ID = 1;

    /**
     * << description of init >>
     *
     **/
    protected function init()
    {
		parent::init();

        // WordShuffle instructions indexed with known id within database
        //$this->find(self::INSTRUCTIONS_ID);
        $this->id = self::INSTRUCTIONS_ID;
    }

    /************************************
     * MODEL PROPERTIES SETTERS / GETTERS
     ************************************/
    // todo:  use "php_prop" live template to insert new properties
    private $_title = null;
    protected function setTitle($value){
        $this->_title = (string) $value;
    }
    protected function getTitle(){
        return (string) $this->_title;
    }
    private $_picture = null;
    protected function setPicture($value){
        $this->_picture = (string) $value;
    }
    protected function getPicture(){
        return (string) $this->_picture;
    }
    private $_Pages = array();
    protected function setPages($pages){
        $this->_Pages = $pages;
    }
    protected function getPages(){
        return $this->_Pages;
    }

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