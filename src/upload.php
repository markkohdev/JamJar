<?php

ini_set('upload_max_filesize','250M');
ini_set('post_max_size','100M');

if (!empty($_FILES)) {
    $tempFile = $_FILES['file']['tmp_name'];
    // $targetPath = $_SERVER['DOCUMENT_ROOT'] . $_REQUEST['folder'] . '/';
    $uuid = date("YmdHis");
    $targetPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
    $targetFile =  str_replace('//','/',$targetPath) . $uuid .'_'.$_FILES['file']['name'];

    // $fileTypes  = str_replace('*.','',$_REQUEST['fileext']);
    // $fileTypes  = str_replace(';','|',$fileTypes);
    // $typesArray = split('\|',$fileTypes);
    // $fileParts  = pathinfo($_FILES['Filedata']['name']);

    // if (in_array($fileParts['extension'],$typesArray)) {
        // Uncomment the following line if you want to make the directory if it doesn't exist
        // mkdir(str_replace('//','/',$targetPath), 0755, true);

        move_uploaded_file($tempFile,$targetFile);
        echo $targetFile;
    // } else {
    //  echo 'Invalid file type.';
    // }
}
else {
    echo "No files submitted";
    http_response_code(400);
}
?>


<?php
// if ( !empty( $_FILES ) ) {

//     $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
//     $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];

//     move_uploaded_file( $tempPath, $uploadPath );

//     $answer = array( 'answer' => 'File transfer completed' );
//     $json = json_encode( $answer );

//     echo $json;

// } else {

//     echo 'No files';

// }
?>