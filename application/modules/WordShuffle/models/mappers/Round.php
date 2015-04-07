<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 11/8/14
 * Time: 8:38 PM
 *
 * Class WordShuffle_Model_Mapper_Round
 *
 * @property    WordShuffle_Model_Round    _model     Reference to respective model
 * @property    WordShuffle_Model_DbTable_Round   dbTable Default table object storing model information
 *
 */
class WordShuffle_Model_Mapper_Round extends WordShuffle_Model_Mapper_Abstract
{
    // map table field name to Game property
    protected $_map = array(
        'id'            =>'id',
        'idWSgame'      =>'idGame',
        'time'          =>'time',
        'points'        => 'points',
        'wordCount'     => 'wordCount',
        'start'         => 'start',
        'end'           => 'end'
    );

    protected $_findAllBy = array(
        'idWSgame'
    );
}