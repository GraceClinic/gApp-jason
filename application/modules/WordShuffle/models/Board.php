<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 9/28/14
 * Time: 7:48 PM
 */
class WordShuffle_Model_Board extends WordShuffle_Model_Abstract
{

    // variable serving class properties
    private
        $_Squares = [],
        $_rows = 5,
        $_cols = 5;

    public function __construct(array $data = array())
    {
        parent::__construct($data);

        $this->Squares = [];

    }

    protected function setSquares($x){
        //argument x does not matter, squares dictated by row and col configuration
        for($i=0;$i<$this->rows;$i++){
            for($j=0;$j<$this->cols;$j++){
                $this->_Squares[$i][$j] = new WordShuffle_Model_Square();
            }
        }

    }
    protected function getSquares(){
        return $this->_Squares;
    }

    protected function setRows($x){
        $this->_rows = $x;
    }
    protected function getRows(){
        return $this->_rows;
    }

    protected function setCols($x){
        $this->_cols = $x;
    }
    protected function getCols(){
        return $this->_cols;
    }
}