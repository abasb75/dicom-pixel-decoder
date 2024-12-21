<?php

// php ./makeFileList.php

$files = [];

$finded = scandir('./test-files');

for($i=0;$i<count($finded);$i++){
    $file = $finded[$i];
    if($file != '.' && $file!=='..'){
        $files[] = $file;
    }
}
if(file_exists('data.json')){
    unlink('data.json');
}

$json_data =json_encode($files);
file_put_contents('data.json',$json_data);

echo 'json created';