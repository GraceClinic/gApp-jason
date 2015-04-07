<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 10/11/14
 * Time: 4:57 PM
 *
 * Class WordShuffle_Model_Mapper_Game
 *
 * @property    WordShuffle_Model_Game    _model     Reference to respective model
 * @property    WordShuffle_Model_DbTable_Game   dbTable Default table object storing model information
 *
 */
class WordShuffle_Model_Mapper_Game extends WordShuffle_Model_Mapper_Abstract
{
    // map table field name pointing to Game property
    protected $_map = array(
        'id'                => 'id',
        'idPlayer'          => 'idPlayer',
        'secondsPerRound'   => 'secondsPerRound',
        'roundsPerGame'     => 'roundsPerGame',
        'start'             => 'start',
        'end'               => 'end',
        'points'            => 'points',
        'roundAvg'          => 'roundAvg',
        'status'            => 'status'
    );

    public function abandonUncompletedGames(){
        $fields = array(
            'status' => WordShuffle_Model_Game::ABANDONED
        );

        $where = $this->_db->quoteInto('idPlayer = ?',$this->_model->idPlayer);
        $where = $where.$this->_db->quoteInto(' And (status = ?',WordShuffle_Model_Game::IN_PROGRESS);
        $where = $where.' Or status IS NULL)';
        $this->getDbTable()->update($fields, $where);

    }

    public function findRounds(){

    }
    /**
     * Saving a Game record requires saving all of the round objects.
     *
     */
//    protected function _postSave()
//    {
//        // save each Round object
//        foreach($this->_model->Rounds as $round){
//            // @var WordShuffle_Model_Round $round
//            // set the game reference for each round object
//            $round->idGame = $this->_model->id;
//            $round->save();
//        }
//
//    }
}