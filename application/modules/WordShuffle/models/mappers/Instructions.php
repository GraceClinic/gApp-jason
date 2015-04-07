<?php
// todo:  update docBlock with class description and properties
/**
 * << class description >>
 *
 * @package WordShuffle_Models_Mapper
 *
 * @class WordShuffle_Models_Mapper_Instructions
 *
 * @property    
 *
 */

class WordShuffle_Model_Mapper_Instructions extends Common_Abstracts_Mapper
{
    // map table field name pointing to Game property
    protected $_map = array(
        'id'            => 'id',
        'title'         => 'title',
        'picture'       => 'picture',
    );
    /** @var WordShuffle_Model_Instructions  $_model     Reference to the model associated with specific mapper, should be passed in constructor  */
    protected $_model;

    public function find($id = null){
        $this->_model->SysMan->Logger->info($this->_className.' find() START, id = '.$id.'; model->id = '.$this->_model->id);
        $success = parent::find($id);

        $this->_model->SysMan->Logger->info($this->_className.' parent::find() success =  '.$success);

        if ($success){
            $this->_model->Pages = $this->_findPages($id);
        }

        return $success;
    }

    /**
     * @param string|array|Zend_Db_Table_Select $where      - OPTIONAL where clause limiting search
     * @param string|array                      $order      - OPTIONAL An SQL ORDER clause.
     * @param int                               $count      - OPTIONAL An SQL LIMIT count.
     * @param int                               $offset     - OPTIONAL An SQL LIMIT offset.
     * @return array[]      - array of Instruction objects complete with Pages property loaded
     * @throws Exception
     */
    public function findAll($where = null,$order = null,$count = null,$offset = null){
        $results = parent::findAll($where,$order,$count,$offset);

        if (count($results) > 0){
            for($i=0; $i<count($results); $i++){
                $results[$i] = new WordShuffle_Model_Instructions($results[$i]);
                $results[$i]->Pages = $this->_findPages($results[$i]->id);
            }
        }

        return $results;
    }
	// todo:  document this function if you include it
    protected function init(){
		// todo:  extend constructor logic of abstract here, do not override the parent constructor
    }

    protected function _preSave()
    {
        // todo:  determine what you will do before a save operation, document if you include
    }

    protected function _postSave()
    {
        // todo:  determine what you will do after a save operation, document if you include
    }

    /**
     * Finds all of the Pages attached to the Instructions id passed as an argument.  If argument not present, it uses
     * the id of the associated Instruction object.
     *
     * @param $id
     * @return WordShuffle_Model_Page[]     - array of Page objects for the Instructions id
     * @throws Exception
     */
    protected function _findPages($id = null){
        $pages = array();
        $this->_model->SysMan->Logger->info($this->_className.' _findPages() START, id = '.$id.'; model->id = '.$this->_model->id);

        if($id == null){
            $id = $this->_model->id;
        }

        if($id !== null){
            $pageModel = new WordShuffle_Model_Page();
            $where = $this->_db->quoteInto('idInstructions = ?',$id,'INTEGER');
            $order = 'sequence ASC';
            $pages = $pageModel->findAll($where,$order);

            $countIsRight = count($pages) > 0;

            if (!$countIsRight) {
                throw new Exception(
                    'Attempt to get pages yielded no records.  Cannot build WordShuffle_Model_Instructions object without pages.'
                );
            }

            // transform associative array of pages into an array of page models
            for($i=0; $i<count($pages); $i++){
                $pages[$i] = new WordShuffle_Model_Page($pages[$i]);
            }
        }

        $this->_model->SysMan->Logger->info($this->_className.' _findPages() END, page count = '.count($pages));

        return $pages;
    }
}