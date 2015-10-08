<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Drexel Uploader | Mark Koh</title>
<link rel="shortcut icon" href="icon.ico"/>
<link href="css/default.css" rel="stylesheet" type="text/css" />
<link href="css/uploadify.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="scripts/jquery-1.3.2.min.js"></script>
<script type="text/javascript" src="scripts/swfobject.js"></script>
<script type="text/javascript" src="scripts/jquery.uploadify.v2.1.0.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	$("#uploadify").uploadify({
		'uploader'       : 'scripts/uploadify.swf',
		'script'         : 'scripts/uploadify.php',
		'cancelImg'      : 'cancel.png',
		'folder'         : 'uploads',
		'queueID'        : 'fileQueue',
		'auto'           : false,
		'multi'          : true
	});
});
</script>
</head>

<body> 
<?php include("../../pswd/password_protectdrexel.php"); ?>

<div class="header">
		<img src="images/header.png" width="575" height="150" alt="header" />
        <br />
        <a href="http://markkoh.net"><img src="images/sub.png" alt="subheader" /></a>
  </div>
  
<div class="content" >
Choose your files to upload:<br /><br />

<div id="fileQueue"></div>
<input type="file" name="uploadify" id="uploadify" src="images/browse.png"/>
<p><a href="javascript:$('#uploadify').uploadifyUpload();"><img src="images/upload.png" alt="uploadbuttton" width="150" height="51" border="0px"/></a> <img src="images/divider.png" alt="divider" height="51" width="5" border="0px"/> <a href="javascript:$('#uploadify').uploadifyClearQueue();"><img src="images/cancel.png" alt="uploadbuttton" width="150" height="51" border="0px"/></a></p>
<p><font face="Calibri, Arial, Myriad Pro" size="+1">Click <a href="uploads/">here</a> to view your uploaded files</font></p>


</div>
</body>
</html>
