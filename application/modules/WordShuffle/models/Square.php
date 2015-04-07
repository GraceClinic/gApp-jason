<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 9/28/14
 * Time: 7:51 PM
 */
class WordShuffle_Model_Square extends WordShuffle_Model_Abstract
{

    // variable serving class properties
    private
        $Letter = 'X';

    public function __construct(array $data = array())
    {
        parent::__construct($data);


    }

    protected function setLetter($x){
        $this->Letter = $x;
    }
    protected function getLetter(){
        return $this->Letter;
    }

}