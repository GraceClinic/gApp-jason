<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 10/11/14
 * Time: 4:57 PM
 *
 * Class WordShuffle_Model_Mapper_Player
 *
 * @property    WordShuffle_Model_Player    _model     Reference to respective model
 * @property    WordShuffle_Model_DbTable_Game   dbTable Default table object storing model information
 *
 */
class WordShuffle_Model_Mapper_Player extends WordShuffle_Model_Mapper_Abstract
{
    const CHALLENGE_TABLE = 'WordShuffle_Models_DbTable_Challenge';
    // map table field name to Player property
    protected $_map = array(
        'id'                => 'id',
        'idChallenge'       => 'idChallenge',
        'secret'            => 'secret',
        'name'              => 'name',
        'createDate'        => 'createDate',
        'modifyDate'        => 'modifyDate'
    );

    protected $_findAllBy = array(
        'name'
    );

    public function find($id = null){
        $success = parent::find($id);

        // find list of challenges
        if($success){
            $this->_model->challenges = $this->findChallenges();
            $this->_findGameDefaults();
        }

        // todo:  find game defaults and populate properties

        return $success;
    }

    public function findAll($by = null)
    {
        // execute parent find procedure to get relevant data
        /** @var  array $results */
        $results = parent::findAll($by);
        $challenges = $this->findChallenges();

        // The Player object gets its "challenge" property from the dependent Challenge table
        if ($results && count($results) > 0) {
            for ($i = 0; $i < count($results); $i++) {
                $results[$i]['challenges'] = $challenges;
            }
        }

        return $results;
    }

    public function findChallenges(){
        $challengeTable = new WordShuffle_Model_DbTable_Challenge();
        $rowSet = $challengeTable->fetchAll();
        if(count($rowSet) > 0){
            $ret = $rowSet->toArray();
            // convert id to integer
            for($i=0;$i<count($ret);$i++){
                $ret[$i]['id'] = (int) $ret[$i]['id'];
            }
        }else{
            throw new Exception(' WordShuffle_Model_Mapper_Player query to retrieve all from Challenge table resulted in none.  '.
                'There should be multiple questions from which the player will chose.');
        }

        return $ret;
    }

    /**
     * Validate secret provided by Player object
     *
     * @public
     * @return boolean
     */
    public function secretIsValid()
    {
        $player = new WordShuffle_Model_Player();
        $player->Mapper->find($this->_model->id);

        // set the challenges in preparation for return to frontend
        $this->_model->challenges = $player->challenges;

        // compare entered secret to database
        return $this->_scrubClean($player->secret) == $this->_scrubClean($this->_model->secret);

    }

    /**
     * Determines is player name exists in the database
     *
     * @return boolean      - true if name exists
     */
    public function nameExists(){
        $where = $this->_db->quoteInto('name = ?',$this->_model->name);
        $players = $this->findAll($where);
        return count($players);
    }

    /**
     * Scrubs spaces, converts to lowercase, trims tabs, returns, etc from ends, removes all spaces in preparation for
     * clean comparison
     *
     * @private
     * @param  string   $string             - string to clean
     * @return string
     */
    private function _scrubClean($string)
    {
        return str_replace(" ","",strtolower(trim($string)));
    }
    /**
     * Find the game defaults from the last game:  rounds per game and seconds per round
     *
     * @private
     */
    private function _findGameDefaults()
    {
        $gameTable = new WordShuffle_Model_DbTable_Game();

        $where1 = $this->_db->quoteInto('idPlayer = ?',$this->_model->id);
        $selectRecentDate = "(Select max(start) from WSGame where ".$this->_db->quoteInto("idPlayer = ?",$this->_model->id).')';
        $where2 = 'start = '.$selectRecentDate;

        $select = $gameTable->select()->where($where1)->where($where2);
        $rowSet = $gameTable->fetchAll($select);

        // should only be one record
        if(count($rowSet) == 1) {
            $ret = $rowSet->toArray();
            // set the Player roundsPerGame and secondsPerRound default per the last game played
            $this->_model->roundsPerGame = (int) $ret[0]['roundsPerGame'];
            $this->_model->secondsPerRound = (int) $ret[0]['secondsPerRound'];
        }elseif(count($rowSet) == 0){
            // do nothing, game defaults set by Session object defaults, new Game record will be created on play event
        }else{
            throw new Exception($this->_className.'->_findGameDefaults() resulted in multiple records.  There should only be one.');
        }

    }



}