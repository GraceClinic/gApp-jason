<?php
/**
 * ModuleBasedLayout.php
 *
 * @copyright GRACE HOLDINGS LLC.
 * @License GRACE HOLDINGS LLC.
 *
 * GRACE HOLDINGS LLC. CONFIDENTIAL
 */
/**
 * Zend plugin for module based application
 *
 * @package Common_Plugins
 * @since   0.1
 */
class Common_Plugins_ModuleBasedLayout
    extends Zend_Layout_Controller_Plugin_Layout
{
    /**
     * Retrieves appropriate module layout file based on requested route.
     *
     * @param Zend_Controller_Request_Abstract $request
     */
    public function preDispatch(Zend_Controller_Request_Abstract $request)
    {
        $this->getLayout()->setLayoutPath(
            Zend_Registry::get('config')->resources->frontController->moduleDirectory
                . DS . $request->getModuleName() . DS . 'layouts');
        Zend_Layout::getMvcInstance()->assign('page', $request->getControllerName());
    }
}