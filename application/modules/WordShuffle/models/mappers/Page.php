<?php
// todo:  update docBlock with class description and properties
/**
 * << class description >>
 *
 * @package WordShuffle_Model_Mapper
 *
 * @class WordShuffle_Model_Mapper_Page
 *  
 */
class WordShuffle_Model_Mapper_Page extends Common_Abstracts_Mapper
{
    // todo:  create mapping between table fields and model properties (format is <table field> => <model prop>
    protected $_map = array(
        'id'                => 'id',
        'idInstructions'    => 'idInstructions',
        'body'              => 'body',
        'sequence'          => 'sequence'
    );

    protected $_findAllBy = array(
        'idInstructions'
    );

    /**
     * Generic findAll implementation for a simple query for multiple records fitting the criteria.  If the model
     * has information stored in other tables, the method requires extension to handle that disparate information
     * and load it into the models.
     *
     * @param array $by - OPTIONAL criteria for limiting record set, if not set, _findAllBy is used
     * @return Common_Abstracts_Model[]        - array of models associated with this mapper
     */
    public function findAll($by = null)
    {
        // execute parent find procedure to get relevant data
        /** @var  WordShuffle_Model_Page[] $results */
        $pages = parent::findAll($by);
        sleep(2);
        // process each page and retrieve the file contents for the body
        if(count($pages) > 0){
            /** @var WordShuffle_Model_Page $page */
            for($i=0; $i<count($pages); $i++){
                $pages[$i]['body'] = file_get_contents($pages[$i]['body'],FILE_USE_INCLUDE_PATH);
            }
        }

        return $pages;
    }
}