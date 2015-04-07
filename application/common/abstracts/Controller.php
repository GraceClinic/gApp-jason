<?php
/**
 * Created by PhpStorm.
 * User: jderouen
 * Date: 6/15/14
 * Time: 4:27 PM
 */

// top level controller abstract extends to all controllers
abstract class Common_Abstracts_Controller extends Zend_Controller_Action{

    public $Module = null;

    public function init(){
        // this is the controller abstract for the WordShuffle module
        $ModuleName = Zend_Controller_Front::getInstance()->getRequest()->getModuleName();

        // define the Module object for passing to Javascript frontend
        // @var     stdClass
        $this->Module = new stdClass();
        $this->Module->idTag = 'App-Module';
        $this->Module->name = $ModuleName;
        $this->Module->model = $ModuleName;
        $this->Module->title = "eForEveryone!";


        $this->Module->Controller = new stdClass();

        // define the global Controller properties
        $this->Module->Controller->idTag = 'App-Module-Controller';
        $this->Module->Controller->name = Zend_Controller_Front::getInstance()->getRequest()->getControllerName();
        $this->Module->Controller->Action = Zend_Controller_Front::getInstance()->getRequest()->getActionName();
        $this->Module->Controller->msg = 'no message';

    }

    public function postDispatch(){

        // post the Model messages to the Controller->msg property for display to user
//        foreach(Common_Models_SysMan::getInstance()->Msg as $msg){
//            if($msg->type == Common_Models_Msg::INFO){
//                $this->Module->Controller->msg = $this->Module->Controller->msg.';  '.$msg->text;
//            }
//        }
//        $this->Module->Controller->msg = ltrim($this->Module->Controller->msg,'; ');
//
//        try{
//            // make the Module object available to the frontend
//            $this->view->assign('Module',$this->Module);
//        }catch(Exception $e){
//            throw $e;
//        }
//
//        try{
//            // This will translate all of the properties attached to the Controller during execution of the specific controller/action
//            // to the frontend Javascript side.
//            $this->view->assign('JSON',$this->toJSON());
//        }catch(Exception $e){
//            //Not invalid property Exception
//            throw new Exception('Execution of Controller->toJSON() failed for unknown reasons.  The module content follows<br><br>'.
//                json_encode($this->Module).'<br><br>Zend error follows:<br><br>'.$e);
//        }

    }

}



