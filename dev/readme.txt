README
======

This directory should be used to place project specific documentation including
but not limited to project notes, generated API/phpdoc documentation, or
manual files generated or hand written.  Ideally, this directory would remain
in your development environment only and should not be deployed with your
application to it's final production location.

This is an example implementation of the gApp project.  It is not without its flaws.
You will find errors.  Feel free to fix as you discover.  This implementation is
strictly a teaching tool.


Setting Up Your VHOST
=====================

The following is a sample VHOST you might want to consider for your project.

<VirtualHost *:80>
   DocumentRoot "C:/webserver/GIT/WordShuffle/public"
   ServerName .local

   # This should be omitted in the production environment
   SetEnv APPLICATION_ENV development

   <Directory "C:/webserver/GIT/WordShuffle/public">
       Options -Indexes MultiViews FollowSymLinks
       AllowOverride All
       Order allow,deny
       Allow from all
   </Directory>

</VirtualHost>
