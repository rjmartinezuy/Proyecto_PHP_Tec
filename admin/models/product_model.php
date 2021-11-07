<?php
  include_once(LIBS.'/database.php');

class ProductModel {
    public $productId;
    public $productName;
    public $productDescription;
    public $productPrice;
    public $productStock;
    public $productActivo;
    public $categoryId;
    public $images="";

    function __construct($id,$name,$description,$price,$stock,$isActive,$categoryId,$images){
        $this->productId=$id;
        $this->productName=$name;
        $this->productDescription=$description;
        $this->productPrice=$price;
        $this->productStock=$stock;
        $this->productActive=$isActive;
        $this->categoryId=$categoryId;
        $this->images=$images;
    }
}


function allProducts(){
    $link = Connect();
    $sql = "SELECT * FROM producto";
    $result = $link->query($sql);
    $listProduct = [];
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $images=getImages($row["productoid"]);
            $listProduct[] = new ProductModel($row["productoid"],$row["productonombre"],$row["productodescripcion"],$row["productoprecio"],$row["stock"],
                                                $row["productoesactivo"],$row["categoriaid"],$images);
        }
    } 

    $link->close();
    return $listProduct;
}

function getProductById($id){
    $con = Connect();
    $sql = "SELECT * FROM producto WHERE productoid = $id";
    $result = $con->query($sql);
    if ($result->num_rows > 0) {
        $images=getImages($id);
        while($row = $result->fetch_assoc()) {
            return new ProductModel($row["productoid"],$row["productonombre"],$row["productodescripcion"],$row["productoprecio"],$row["stock"],
                                        $row["productoesactivo"],$row["categoriaid"],$images);
        }
    } 
    $con->close();
    return null;
}


function existsProduct($name){
    $link = Connect();
    $sql = "SELECT * FROM producto WHERE productonombre = '$name' ";
    $result = $link->query($sql);
    $existe=false;
    if($result->num_rows>0){
        $existe=true;
    }
    $link->close();
    
    return $existe;
}


function putProduct($productName,$productCategory,$productPrice,$productStock,$productDescription,$imagesArray){
   if(!existsProduct($productName)){
    $link = Connect();
    $sql = " INSERT INTO producto(productonombre, productodescripcion, productoprecio, stock, productoesactivo, categoriaid) 
    VALUES ('$productName','$productDescription',$productPrice,$productStock,1,$productCategory)";
    $result = $link->query($sql);

    if($result){
        $lastIdInserted = $link->insert_id; 

        if(!file_exists(BASE_URL.'productImages/'.$lastIdInserted)){
            mkdir(BASE_URL.'productImages/'.$lastIdInserted);
        }


        foreach($imagesArray as $img){
            $i = json_decode($img)->file;
            $rutaTemp=BASE_URL."imgTemp/".$i;
            $ruta=BASE_URL."productImages/".$lastIdInserted."/".$i;
            if(copy($rutaTemp, $ruta)){
                $file=BASE_URL.'imgTemp/'.$i;
                unlink($file);
                }
            }
            return true;

        }else{
            return false;
        }


    }else{
        return -1;
    }
   }

    function getImages($productId){
        $files=glob(BASE_URL.'productImages/'.$productId.'/*');
        return $files;
    }

    function editProduct($productId,$productName,$productCategory,$productPrice,$productStock,$productDescription,$imagesArray,$newImagesArray){
        $link = Connect();
        $sql = "UPDATE producto 
                    SET productonombre = '$productName', 
                        productodescripcion = '$productDescription',
                        productoprecio = $productPrice,
                        stock = $productStock,
                        categoriaid = '$productCategory'
                    WHERE productoid = $productId";

        $link->query($sql);
        $images=getImages($productId);

        foreach($images as $img){
            if(!findInArray($img, $imagesArray)){
               //se borra la imagen del servidor
               unlink($img);
            }
        }
       
        if($newImagesArray!='' && count($newImagesArray)>0){
            
            foreach($newImagesArray as $newImg){
                $i = json_decode($newImg)->file;
            
                $rutaTemp=BASE_URL."imgTemp/".$i;
                $ruta=BASE_URL."productImages/".$productId."/".$i;
                if(copy($rutaTemp, $ruta)){
                    $file=BASE_URL.'imgTemp/'.$i;
                    unlink($file);
                    }
                }
            }
        
        return true;

        
    }

    function findInArray($search, $array){
        foreach($array as $element){
            if($element==$search){
                return true;
            }
        }
        return false;
    }



?>