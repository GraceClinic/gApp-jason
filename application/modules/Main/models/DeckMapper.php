<?php
/**
 * Translates Deck object to data source
 *
 * @package Main_Model
 *
 * @class Main_Model_DeckMapper
 *  
 */
class Main_Model_DeckMapper extends Common_Abstracts_Mapper
{
    protected 
        $_map = array(
            'id' => 'id'
        ),
        $_findAllBy = array(
        );

    protected function _preSave()
    {
        // todo:  determine what you will do before a save operation, document if you include
    }

    protected function _postSave()
    {
        // todo:  determine what you will do after a save operation, document if you include
    }
 
}