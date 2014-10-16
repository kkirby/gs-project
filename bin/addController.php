<?php
$name = $argv[1];
$local = dirname(__FILE__).'/../lib/consoleTemplates/controller';
$pwd = trim(`pwd`);
$dir = $pwd.'/'.$name;
echo $dir;
@mkdir($dir,0777,true);
$layout = file_get_contents($local.'/layout.html');
$style = file_get_contents($local.'/style.scss');
$view = file_get_contents($local.'/View.gs');
$viewController = file_get_contents($local.'/ViewController.gs');
$layout = str_replace('@',ucfirst($name),$layout);
$style = str_replace('@',ucfirst($name),$style);

file_put_contents($dir.'/'.$name.'.html',$layout);
file_put_contents($dir.'/'.$name.'.scss',$style);
file_put_contents($dir.'/'.ucfirst($name).'View.gs',$view);
file_put_contents($dir.'/'.ucfirst($name).'.gs',$viewController);

?>