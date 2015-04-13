<?php

/**
 * Wordshuffle game square
 * 
 * @package WordShuffle_Models_Game
 * @class   WordShuffle_Models_Game_Square
 * @property    string          letter      - letter attached to square
 * @property    int             row         - row index
 * @property    int             col         - column index
 * @property    boolean         isSelected  - flags if square is selected
 */
class WordShuffle_Model_Game_Square extends Common_Abstracts_Model
{
    /************************************
     * MODEL PROPERTIES SETTERS / GETTERS
     ************************************/
    private $_letter = null;
    protected function setLetter($value){
        $this->_letter = (string) $value;
    }
    protected function getLetter(){
        return $this->_letter;
    }
    private $_row = null;
    protected function setRow($value){
        $this->_row = (int) $value;
    }
    protected function getRow(){
        return $this->_row;
    }
    private $_col = null;
    protected function setCol($value){
        $this->_col = (int) $value;
    }
    protected function getCol(){
        return $this->_col;
    }
    private $_isSelected = null;
    protected function setIsSelected($value){
        $this->_isSelected = (boolean) $value;
    }
    protected function getIsSelected(){
        return $this->_isSelected;
    }

    /**
     * Initialize Game model after construction.  Set properties to default values and determine properties to exclude
     * from JSON array that passes to frontend.
     *
     */
    protected function init()
    {
        // exclude instructions property from JSON array, frontend does not require
        $this->excludeFromJSON(array('id','msg'));

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
     * Square has no database presence.  Everything maintained in session variables. Model always validates
     *
     * @return  bool        - returns true if validation is successful
     */
    protected function _validateModel(){
        // return false to insure that the developer always creates an appropriate find validation
        return true;
    }
}