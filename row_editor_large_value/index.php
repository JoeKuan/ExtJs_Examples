<?php 
 $home = "../";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1">
    <title>Single HighChart demo for ExtJS 4</title>
    <link rel="stylesheet" type="text/css" href="<?php echo $home; ?>/extjs4/resources/css/ext-all.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo $home; ?>/extjs4/examples/shared/example.css" />
    <link rel="stylesheet" type="text/css" href="<?php echo $home; ?>/extjs4/resources/css/ext-all-gray.css" />
    <script type="text/javascript">
      <?php echo "var HOME ='{$home}';\n"; ?>
    </script>
        <style type="text/css">
    #loading-message {
color: #4e4e4e;
font-style: bold;
font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif;
}

#loading-mask {
       position: absolute;
                top: 0;
                    left: 0;
                         width: 100%;
                               height: 100%;
                                      background: #FFFFFF;
                                               z-index: 1;
}
#loading {
       position: absolute;
                top: 40%;
                    left: 45%;
                         z-index: 2;
}
#loading SPAN {
       background: url('/images/blue_spinning_circ.gif') no-repeat left center;
                padding: 5px 30px;
                        display: block;
}
    </style>    
    <script type="text/javascript" src="<?php echo $home; ?>/extjs4/bootstrap.js"></script>
    <script type='text/javascript' src="<?php echo $home; ?>/row_editor_large_value/roweditor.js"></script>
  </head>
  <body id="docbody"></body>
</html>
