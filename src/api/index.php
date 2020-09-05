<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-type");

$host_name = 'db5000837917.hosting-data.io';
$database = 'dbs739823';
$user_name = 'dbu77880';
$password = "ZHs#sM%m_%8XnUt";

$connect = new mysqli($host_name, $user_name, $password, $database);
if ($connect->connect_error) {
  Output(500);
}

function utf8_encode_deep(&$input) {
	if (is_string($input)) {
		$input = utf8_encode($input);
	} else if (is_array($input)) {
		foreach ($input as &$value) {
			utf8_encode_deep($value);
		}

		unset($value);
	} else if (is_object($input)) {
		$vars = array_keys(get_object_vars($input));

		foreach ($vars as $var) {
			utf8_encode_deep($input->$var);
		}
	}
  return $input;
}
function utf8_decode_deep(&$input) {
	if (is_string($input)) {
		$input = utf8_decode($input);
	} else if (is_array($input)) {
		foreach ($input as &$value) {
			utf8_decode_deep($value);
		}

		unset($value);
	} else if (is_object($input)) {
		$vars = array_keys(get_object_vars($input));

		foreach ($vars as $var) {
			utf8_decode_deep($input->$var);
		}
	}
  return $input;
}
function Output($status, $data) {

  header('Content-Type: application/json; charset=UTF-8');

  if ($status === 200) {
    header("HTTP/1.1 200 ok");
    $response['status'] = 200;
    $response['status_message'] = "success";
    $response['data'] = utf8_encode_deep($data);
    // $response['sql'] = $sql;
    $json_response = json_encode($response);
    echo $json_response;
  } elseif ($status === 404) {
    header("HTTP/1.1 200");
    $response['status'] = 404;
    $response['status_message'] = "not found";
    // $response['data'] = utf8_encode_deep($data);
    // $response['sql'] = $sql;
    $json_response = json_encode($response);
    echo $json_response;
  } else {
    header("HTTP/1.1 500 error");
    $response['status'] = 500;
    $response['status_message'] = "error";
    $response['data'] = utf8_encode_deep($data);
    $json_response = json_encode($response);
    echo $json_response;
  }

}
function Select($sql) {
  global $connect;
  $output = array();
  $result = $connect->query($sql);
  if ($result->num_rows > 0) {

      while($row = $result->fetch_assoc()) {
        array_push($output, $row);
      }
      return $output;

  } else {

    return $output;

  }
}
function Insert($sql,$output = true) {
  global $connect;
  if (mysqli_query($connect,$sql)) {
    if ($output) {
      Output(200,"success");
    } else {
      return true;
    }
  } else {
    if ($output) {
      Output(500, mysqli_error($connect));
    } else {
      return mysqli_error($connect);
    }
  }
}
function confirmData(&$input) {
  global $connect;
	if (is_string($input)) {
		$input = utf8_decode($connect->real_escape_string($input));
	} else if (is_array($input)) {
		foreach ($input as &$value) {
			confirmData($value);
		}

		unset($value);
	} else if (is_object($input)) {
		$vars = array_keys(get_object_vars($input));

		foreach ($vars as $var) {
			confirmData($input->$var);
		}
	}
  return $input;
}

if (isset($_GET)) {
  $data = confirmData($_REQUEST);

  switch ($data['selector']) {
    case "get":
        $sql = "SELECT * FROM `progressbar` WHERE uid = '".$data["uid"]."'";
        $res = Select($sql);
        Output(200,$res);
        break;

    case "post":
        $sql = "INSERT INTO `progressbar`(`uid`, `value`, `finish`) VALUES ('".$data['uid']."',".$data['value'].",".$data['finish'].")";
        Insert($sql);
        break;

    case "update":
        Insert("UPDATE `progressbar` SET `value`=".$data['value']." WHERE `id` = ".$data["id"]);
        break;

    case "delete":
        Insert("DELETE FROM `progressbar` WHERE `id` = ".$data["id"]);
        break;

    case "new":
        Insert("DELETE FROM `progressbar` WHERE `uid` = '".$data["uid"]."'");
        break;

    default:
        echo "Hallo World";

    }
} else {
  echo "Keine Werte erkannt";
}
?>
