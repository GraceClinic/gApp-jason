<?php
abstract class Common_Abstracts_DbTable extends Zend_Db_Table_Abstract
{

    /**
     * Returns the name of the table's primary key column.  Currently abstract only functions assuming table
     * has one primary key.  Tables with multiple primary keys require overwrite of this function and/or
     * overwrite of the Mapper abstract, which assumes that this returns a string
     *
     * @return string
     * @throws exception
     */
    public function getPrimary(){
        if(is_array($this->_primary)&&(count($this->_primary)==1)&&(key($this->_primary)==1)){
            $key = $this->_primary[1];
        }elseif(!is_array($this->_primary)){
            $key = $this->_primary;
        }else{
            throw new Exception("Table ".$this->_name." has multiple primary keys, you must overwrite abstracts to handle properly.");
        }
        return $key;
    }

    public function getName(){
        return $this->_name;
    }
    // make this available for automating find function
    public function getDependentTables(){
        return $this->_dependentTables;
    }
}