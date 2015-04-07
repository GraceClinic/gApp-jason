<?php

class Main_Bootstrap extends Zend_Application_Module_Bootstrap
{

    protected function _initAutoload()
    {
        // Define the paths to all of the extended namespaces created by dividing the model into packages.
        // It is necessary to manually add all of the new components as they are created in the application architecture
        $nameSpaceToPath = array(
//            Example of Game package contained under module
//            'Model_Game'    => 'models/Game'
        );

        $autoLoaderResource = $this->getResourceLoader();

        /* The Autoloader resource comes with the following mappings to assume subdirectories under the module directory:
            forms/, models/, models/mapper, models/DbTable, plugins/, services/, and views/.
        Create references to the others (in this case, the "controllers/" directory since it contains the Abstract */
        $autoLoaderResource
            ->addResourceType('controller', 'controllers', 'Controller');

        // now loop through and load the mapper and DbTable for each of the model components
        foreach($nameSpaceToPath as $ns => $path) {
            $autoLoaderResource->addResourceType('mapper',$path.'/mappers',$ns.'_Mapper');
            $autoLoaderResource->addResourceType('DbTable',$path.'/DbTable',$ns.'_DbTable');
        }

        return $autoLoaderResource;
    }
}

