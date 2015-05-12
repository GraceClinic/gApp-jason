<?php
class WordShuffle_PlayerController extends WordShuffle_Controller_Abstract
{
    protected
        $_modelClass = 'WordShuffle_Model_Player';

    /**
     * For the Player model, delete is just a proxy for logout.  User cannot delete the player record.
     *
     * @param int $id
     */
    public function deleteAction($id = 0){

        $model = new WordShuffle_Model_Player($id);

        $results = $model->logout();

        $response = Array(
            "results" => $results
        );

        $this->getResponse()->appendBody(json_encode($response));

        // stop all other processing
    }
}