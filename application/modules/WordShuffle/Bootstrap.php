<?php

class WordShuffle_Bootstrap extends Zend_Application_Module_Bootstrap
{

    protected function _initAutoload()
    {
        // Define the paths to all of the extended namespaces created by dividing the model into packages.
        // It is necessary to manually add all of the new components as they are created in the application architecture
        $nameSpaceToPath = array(
//            Example of Game package contained under module
            'Model_Game'    => 'models/Game',
            'Model_Player'  =>  'models/Player'
        );

        $autoLoaderResource = $this->getResourceLoader();

        /* The Autoloader resource comes with the following mappings to assume subdirectories under the module directory:
            forms/, models/, models/mapper, models/DbTable, plugins/, services/, and views/.
        Create references to the others (in this case, the "controllers/" directory since it contains the Abstract */
        $autoLoaderResource
            ->addResourceType('controller', 'controllers', 'Controller');

        // now loop through and load the mapper and DbTable for each of the model components
        foreach($nameSpaceToPath as $ns => $path) {
            $autoLoaderResource->addResourceType($ns,$path,$ns);
            $autoLoaderResource->addResourceType($ns.'_Mapper',$path.'/mappers',$ns.'_Mapper');
            $autoLoaderResource->addResourceType($ns.'_DbTable',$path.'/DbTable',$ns.'_DbTable');
        }

        return $autoLoaderResource;
    }

    protected function _initRestRoute()
    {
        $this->bootstrap('frontController');
        $frontController = Zend_Controller_Front::getInstance();

        // create rest route for the entire WordShuffle module
        $restRoute = new Zend_Rest_Route($frontController,array(),
            array('WordShuffle')
        );
        // if it were necessary to specify certain controllers with the 'WordShuffle' module, this would be the syntax
//        $restRoute = new Zend_Rest_Route($frontController,array(),
//            array('WordShuffle'=>
//                array(
//                    'Game',
//                    'Player'
//                )
//            )
//        );

        $frontController->getRouter()->addRoute('WordShuffle', $restRoute);
    }
}
