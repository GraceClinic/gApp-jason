<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 11/6/14
 * Time: 7:55 PM
 */
/**
 * Class WordShuffle_Model_Round
 *
 * @property    int         idGame          unique identifier for game record
 * @property    int         time            time allotted to play round
 * @property    int         wordCount       number of words created during the round
 * @property    int         points          points scored during the round
 * @property    datetime    start           date time current game started
 * @property    datetime    end             date time current game ended
 */
class WordShuffle_Model_Round extends WordShuffle_Model_Abstract
{
    // variable serving class properties
    private
        $_idGame = null,
        $_time = null,
        $_wordCount = 0,
        $_points = 0,
        $_start = null,
        $_end = null;


    protected function setIdGame($x){
        $this->_idGame = (int) $x;
    }
    protected function getIdGame(){
        return (int) $this->_idGame;
    }

    protected function setTime($x){
        $this->_time = (int) $x;
    }
    protected function getTime(){
        return (int) $this->_time;
    }

    protected function setWordCount($x){
        $this->_wordCount = (int) $x;
    }
    protected function getWordCount(){
        return (int) $this->_wordCount;
    }

    protected function setPoints($x){
        $this->_points = (int) $x;
    }
    protected function getPoints(){
        return (int) $this->_points;
    }

    protected function setStart($x){
        $this->_start = $x;
    }
    protected function getStart(){
        return $this->_start;
    }

    protected function setEnd($x){
        $this->_end = $x;
    }
    protected function getEnd(){
        return $this->_end;
    }


    protected function _validateModel(){
        // todo: validate game state
        return true;
    }
}