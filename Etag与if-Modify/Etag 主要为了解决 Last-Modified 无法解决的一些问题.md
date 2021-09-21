Etag 主要为了解决 Last-Modified 无法解决的一些问题:

1、一些文件也许会周期性的更改，但是他的内容并不改变(仅仅改变的修改时间)，这个时候我们并不希望客户端认为这个文件被修改了，而重新GET;
2、某些文件修改非常频繁，比如在秒以下的时间内进行修改，(比方说1s内修改了N次)，If-Modified-Since能检查到的粒度是s级的，这种修改无法判断(或者说UNIX记录MTIME只能精确到秒)
（即If-Modify-since在不识别在秒级内的修改）
3、某些服务器不能精确的得到文件的最后修改时间；

![](C:\Users\Administrator\Desktop\markdown笔记\Etag与if-Modify\images\1.jpg)

注意：ETag与last-modified是一个or的关系，优先检查Etag，未命中则查看last-modified