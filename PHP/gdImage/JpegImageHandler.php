<?php
//此为图片处理类，基于GC库，此类表示一张图片，提供在这张图片上画图，写文字，保存为图片等函数
class JpegImageHandler {
    //相关静态配置数据
    const FONT_PATH = "/usr/local/appsweb/htdocs/commapp/fonts/";
    const FONT_SIMSUN = "simsun.ttc";
    const FONT_MSYHBD = "msyhbd.ttf";
    const FONT_STKAITI = "stkaiti.ttf";
    const FONT_SIMHEI = "simhei.ttf";
    const FONT_FZCYJT = "fzcyjt.ttf";
    const FONT_JDTS = "jdts.TTF";
    
    const WHITE_COLOR = "#FFFFFF";
    const BLACK_COLOR = "#000000";
    const RED_COLOR = "#FF0000";
    const GREEN_COLOR = "#00FF00";
    const BLUE_COLOR = "#0000FF";
    const YELLOW_COLOR = "#FFFF00";
    
    const JPEG = "jpeg";
    const JPG = "jpeg";
    const PNG = "png";
    
    protected $img_location;
    
    protected $img_obj;
    
    protected $img_size, $img_width, $img_height;
    //检查文件是否已经存在
    protected function checkFile($location) {
        //OSS_LOG(__FILE__, __LINE__, LP_ERROR, "$location " . is_string($location) . " " . file_exists($location) . "\n");
        return is_string($location) && file_exists($location);
    }
    //构造函数，获取文件本地路径和图片格式编码
    public function JpegImageHandler($location, $type = self::JPEG) {
        if (!$this->checkFile($location))
            throw new Exception("$location img file not exist!", -1);
        $this->img_location = $location;
        if ($type == self::PNG)//支持JEG和PNG两种
            $this->img_obj = imagecreatefrompng($location);
        else
            $this->img_obj = imagecreatefromjpeg($location);
        $this->img_size = getimagesize($location);
        $this->img_width = $this->img_size[0];
        $this->img_height = $this->img_size[1];
    }
    //析构函数
    function __destruct() {
        imagedestroy($this->img_obj);
    }
    
    public function GetImgObj() {
        return $this->img_obj;
    }
    
    public function GetImgWidth() {
        return $this->img_width;
    }
    
    public function GetImgHeight() {
        return $this->img_height;
    }
    //写文字函数，加粗的实现为右移一个像素再写一次
    public function DrawText($text = "", $fontsize = 10, $left = 0, $top = 0, $color = JpegImageHandler::WHITE_COLOR, $fontfile = JpegImageHandler::FONT_MSYHBD, $is_bond = false) {
        //检查字体文件是否存在
        putenv("GDFONTPATH=" . JpegImageHandler::FONT_PATH);
        if (!$this->checkFile(self::FONT_PATH . $fontfile)) {
            OSS_LOG(__FILE__, __LINE__, LP_ERROR, "GDLib:font file not exist!\n");
            //return -1;
            throw new Exception("font file not exist!", -1);
        }
        //转码，并获取边界参数
        $text_utf8 = mb_convert_encoding($text, "UTF-8", "GBK");
        $box = imagettfbbox($fontsize, 0, $fontfile, $text_utf8);
        //var_dump($box);
        $ttf_width = $box[2] - $box[6];
        $ttf_height = $box[3] - $box[7];
        
        /*
        if ($this->img_width < $ttf_width || $this->img_height < $ttf_height) {
            OSS_LOG(__FILE__, __LINE__, LP_ERROR, "draw text $text outside!\n");
            return -2;
            //throw new Exception("draw text $text outside!", -2);
        }
        */
        //计算颜色数据，并写文字
        $r = hexdec(substr($color, 1, 2));
        $g = hexdec(substr($color, 3, 2));
        $b = hexdec(substr($color, 5));
        
        $img_color = imagecolorallocate($this->img_obj, $r, $g, $b);
        imagealphablending($this->img_obj, true);
        
        imagettftext($this->img_obj, $fontsize, 0, $left, $top + $ttf_height, $img_color, $fontfile, $text_utf8);
        if ($is_bond)
            imagettftext($this->img_obj, $fontsize, 0, $left + 1, $top + $ttf_height, $img_color, $fontfile, $text_utf8);
        
        return 0;
    }
    
    /**
     * @param JpegImageHandler $subimg
     */
    //画图函数，subimg为JpegImageHandler类
    public function DrawImage($subimg, $left = 0, $top = 0, $trans = 100, $left_sub = 0, $top_sub = 0, $width_sub = 0, $height_sub = 0) {
        if ($width_sub == 0)
            $width_sub = $subimg->GetImgWidth();
        if ($height_sub == 0)
            $height_sub = $subimg->GetImgHeight();
        imagecopymerge($this->img_obj, $subimg->GetImgObj(), $left, $top, $left_sub, $top_sub, $width_sub, $height_sub, $trans);
        return 0;
    }
    //获取图片的二进制数据
    public function Get64BaseImg($location = "", $buf_file = "") {
        if ($buf_file == "") {
            srand();
            $ran = rand(0, PHP_INT_MAX);
            $buf_file = "buf$ran.jpg";
        }
        $buf_file = $location . $buf_file;
        imagejpeg($this->img_obj, $buf_file, 100);
        $stream = fopen($buf_file, "r");
        $ret = base64_encode(stream_get_contents($stream));
        fclose($stream);
        unlink($buf_file);
        return $ret;
    }
    //将图片写入本地，获取本地文件路径
    public function GetLocalFile($location = "", $buf_file = "") {
        if ($buf_file == "") {
            srand();
            $ran = rand(0, PHP_INT_MAX);
            $buf_file = "buf$ran.jpg";
        }
        $buf_file = $location . $buf_file;
        imagejpeg($this->img_obj, $buf_file, 100);
        return $buf_file;
    }
}

?>