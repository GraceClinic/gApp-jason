<?php
abstract class Common_Abstracts_DbTable extends Zend_Db_Table_Abstract
{

    public function getPrimary(){
        return $this->_primary;
    }

    public function getName(){
        return $this->_name;
    }
    // make this available for automating find function
    public function getDependentTables(){
        return $this->_dependentTables;
    }
}