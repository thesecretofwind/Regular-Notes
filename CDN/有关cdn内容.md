## CDN

### 介绍

CDN（Content Delivery NetWork）内容分发网络，是将源站内容分发至最接近用户的节点，使用户可就近取得所需内容，提高用户访问的响应速度和成功率，解决因分布，带宽，服务器性能带来的访问延迟问题，适用于站点加速、点播、直播等场景

### CDN的实现原理

#### DNS解析过程

1. 用户提交域名（流地址栏输入url地址）
2. 浏览器判断请求的地址的是否命中强缓存（expire字段或者cache-control字段来控制，后者的优先级更高），如果命中强缓存，直接从内存中取出文件进行解析
3. 查看DNS缓存是否存在url对应的ip地址，如果存在，直接发这个ip地址发起请求
4. 如果不存在，向本地域名服务器发送DNS报文，而DNS域名服务器则会采用迭代或递归的方式来查找url对应ip的地址，找到后返回对应的ip地址
5. 如果没有命中强缓存，则向目的ip地址发起请求（tcp三次握手建立tcp连接），服务器则会判断是否命中协商缓存（if-Modify/Etag这个响应时候的字段，前者表示文件最后一次修改时间，后者表示文件的hash标识，内容改变后是不一样的，发送给服务端的字段由if-Modified-since，if-None-Match字段，服务器会根据这两个字段来判断是否命中协商缓存），如果命中协商缓存，则返回状态码304，浏览器则直接从内存中获取文件
6. 如果不命中协商缓存，服务器则返回相应的文件

#### CDN请求过程

1. 当用户点击网站页面上的内容url，经过本地DNS系统解析，DNS系统会最终将域名的解析权交给CNAME指向（一个别名记录（Canonical Name），当DNS系统在查询CNAME左面的名称时，都会转向CNAME右面的名称再进行查询，一致最终到最后的ptr或A的名称，成功查询后才会做出响应，否则失败）CDN专用DNS服务器

2. CDN的DNS服务器将CDN的全局负载均衡设备ip地址返回给用户

3. 用户向CDN的全局负载均衡设备发起内容url访问请求

4. CDN全局负载均衡设备根据用户的ip地址，以及用户请去的内容url，选择一台用户所属区域的区域负载均衡设备，告诉用户向这台设备发起请求

5. 区域负载均衡设备会为用户选择一台合适的缓存服务器提供服务，选择的依据包括：1.根据用户ip地址，判断哪一台服务器距用户最近；2.根据用户所请求的url中携带的内容名称，判断哪一台服务器上由用户所需内容；3.查询各个服务器当前的负载情况，判断哪一台服务器尚有服务能力。基于以上条件的综合分析后，区域负载均衡设备会像全局负载均衡设备返回一台缓存服务器的ip地址

6. 全局负载均衡设备把服务器的ip地址返回给用户

7. 用户向缓存服务器发起请求，缓存服务器响应用户请求，将用户所需内容传送到用户终端。如果这台缓存服务器上并灭有用户想要的内容，而区域均衡设备依然把它分配给了用户，那么这台服务器就要像它的上一级缓存服务器请求内容，直至追溯到网站的原服务器将内容拉到本地

   ![cdn请求具体流程](C:\Users\Administrator\Desktop\markdown笔记\CDN\images\1.jpg)

（

简单版的例子

假设通过CDN加速的域名为`www.a.com`，接入CDN网络，开始使用加速服务后，当终端用户（北京）发起HTTP请求时，处理流程如下：

1. 当终端用户（北京）向`www.a.com`下的指定资源发起请求时，首先向LDNS（本地DNS）发起域名解析请求。
2. LDNS检查缓存中是否有`www.a.com`的IP地址记录。如果有，则直接返回给终端用户；如果没有，则向授权DNS查询。
3. 当授权DNS解析`www.a.com`时，返回域名CNAME `www.a.tbcdn.com`对应IP地址。
4. 域名解析请求发送至阿里云DNS调度系统，并为请求分配最佳节点IP地址。
5. LDNS获取DNS返回的解析IP地址。
6. 用户获取解析IP地址。
7. 用户向获取的IP地址发起对该资源的访问请求。

- 如果该IP地址对应的节点已缓存该资源，则会将数据直接返回给用户，例如，图中步骤7和8，请求结束。
- 如果该IP地址对应的节点未缓存该资源，则节点向源站发起对该资源的请求。获取资源后，结合用户自定义配置的缓存策略，将资源缓存至节点，例如，图中的北京节点，并返回给用户，请求结束。

）

##### 详讲DNS请求的第七步：

首先CDN的缓存会分成2级，l1级和l2级存放的数据会有一定比例（设置比例的原因：1.可以通过一致性hash的手段，在同等资源的情况下，缓存更多内容，提高整体缓存命中率；2.可以平衡计算和io，充分利用不同配置的机器的能力，个人觉得是提高命中率，一些需要数据比较频繁的会放在l1级缓存，这样就可以减少查找的时间）

当用户向CDN缓存服务器发起资源请求时，CDN服务器会查看l1级换粗你是否存在请求资源的缓存，如果有该资源的缓存，则直接返回该资源，如果没有缓存，查看l2级缓存，如果l2级缓存存在请求资源，则返回请求资源，同时将l1级缓存存放该资源，如果l2级缓存不存在，则去到OSS（存放所有图片资源的地方）寻找，找到返回

![例子](C:\Users\Administrator\Desktop\markdown笔记\CDN\images\2.jpg)

#### CDN的优势

1. 为了加速网站的访问（即加快资源的加载，从而浏览器解析文件速度加快）

2. 为了实现跨运营商、跨地域的全网覆盖。由于区域ISP（互联网服务提供商）局限，出口带宽的限制，导致互联不互通的情况。当使用与运营商合作，布置CDN节点，可以覆盖全球的线路，重发利用带宽资源，平衡源站流量

3. CDN的负载均衡和分布式存储奇数，可以加强网站的可靠性。

   

关于一些CDN的一些常见名词：

1. CNAME记录：一个别名记录（Canonical Name）；当DNS系统查询CNAME左边的名称的时候，都会转向CNAME右面的名称再进行查询，一致最总到最后的PTR或A名称，成功查询才会做出响应，否则失败
2. CNAME域名：CDN的域名加速需要用到CNAME记录，如在阿里云控制台配置完成CDN加速后，回得到一个加速后的域名，称为CNAME域名（该域名一定顶以*.*kunlun.com),用户需要将自己的域名作ANANE指向这个*.*kunlun.com的域名后，域名解析的工作就正式转向阿里云，该域名所有的请求都将转向阿里云CDN的节点
3. 边缘节点：也称CDN节点、Cache节点等。是相对网络的复杂结构而提出的一个概念，指距离最终用户介入具有较少的中间环节的网络节点，对重罪介入用户有较好的响应能力和来连接速度。其作用是将访问量较大的网页内容和对象保存在服务器前端的专业cache设备，以此来提高网站访问的速度和质量