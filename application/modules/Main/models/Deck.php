<?php

/**
 * A deck of cards unique for the game.  Decks created as needed if one does not exist for use.
 * 
 * @package Main_Model
 * @class   Main_Model_Deck
 * @property    integer         inUse        Flags if deck is in use
 */
class Main_Model_Deck extends Common_Abstracts_Model
{

    /*****************************
     * CLASS CONSTANTS declaration
     *****************************/
    const HEART = 'Heart';
    const DIAMOND = 'Diamond';
    const SPADE = 'Spade';
    const CLUB = 'Club';

    /**
     * << description of init >>
     * Typically, this method validates the properties with session state to determine if it is appropriate.
     * Also, this is the time for writing session information as appropriate.
     *
     **/
    protected function init()
    {
		parent::init();
		
		$this->excludeFromJSON(array(
		    
        ));
        
    }

    /************************************
     * MODEL PROPERTIES SETTERS / GETTERS
     ************************************/
    private $_inUse = null;
    protected function setInUse($value){
        $this->_inUse = (integer) $value;
    }
    protected function getInUse(){
        return $this->_inUse;
    }
    // todo: move property docblock to top of class
    /**
     * @property    datetime         lastUsed        datetime when deck last used
     */
    private $_lastUsed = null;
    protected function setLastUsed($value){
        $this->_lastUsed = $value;
    }
    protected function getLastUsed(){
        return $this->_lastUsed;
    }


    /****************************************
     * MODEL PUBLIC METHODS declaration / definition
     ****************************************/
    // todo:  use "php_method" live template to insert new methods

    /************************************
     * MODEL PRIVATE FUNCTIONS definition
     ************************************/
    // todo: use "php_func" live template to insert to functions
    
    /**
     * Specific model logic that follows find function.  Override as required, otherwise ignore.
     *
     * @protected
     * @return      boolean     - flags successful execution
     */
    protected function _postFind()
    {
        return true;
    }
    
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
     *  This may require gathering existing data from the database as validating or maintaining as appropriate
     *
      * @return boolean  Indication to save method that preUpdate succeeded; therefore, save can continue
     **/
    protected function _preUpdate(){
         $success = true;
         
       // TODO:  determine if preUpdate process required prior to table update
        
        return $success;
    }

    /**
     * This is logic common to an insert or an update to the database
     *
     * @public
     * @return  boolean
     */
    public function _preSave()
    {
        // todo: define method
        return true;
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

}