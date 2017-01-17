# 了解Web及网络基础

## 网络基础TCP/IP

### TCP/IP的分层管理

1. 应用层

   决定了向用户提供应用服务时通信的活动。比如FTP，DNS，HTTP协议

2. 传输层

   对应用层提供处于网络连接中的两台计算机之间的数据传输。两个性质不同的协议：

   1. TCP(Transmission Control Protocol，传输控制协议)
   2. UDP(User Data Protocol，用户数据报协议)

3. 网络层

   用于处理在网络上流动的数据包，规定了通过怎样的路径到达对方计算机。

4. 链路层

   用于处理连接网络的硬件部分。包括控制操作系统，硬件设备驱动，网卡(NIC)等。

## 与HTTP关系密切的协议：IP、TCP和DNS

### 负责传输的IP协议

按层次分，IP(Internet Protocol)网际协议位于网络层。

要确保数据包传送到对方，需要满足各类条件。其中两个重要条件是IP地址和MAC地址(Media Access Control Address)

IP地址指明了节点被分配到的地址，MAC地址是指网卡所属的固定地址。IP地址可以和MAC地址进行匹配。

**使用ARP协议凭借MAC地址进行通信**

IP间的通信依赖MAC地址。在中转时，利用下一站中转设备的MAC地址来搜索下一个中转目标。这时采用ARP协议(Address Resolution Protocol，解析地址协议)，根据通信方的IP地址就能反查出对应的MAC地址。

### 确保可靠性的TCP协议

按层次分，TCP位于传输层。

TCP协议为了更容易传送大数据才把数据分割，而且TCP协议能够确认数据最终是否送达到对方。

**确保数据能到达目标**

为了准确无误地将数据送达目标处，TCP协议采用了三次握手(three-way handshaking)策略。握手过程采用了TCP的标志——SYN(synchronize)和ACK(acknowledgement)。

发送端首先发送一个带SYN标志的数据包给对方。接受端收到后，回传一个带有SYN/ACK标志的数据包表示传达确认。最后发送端再回传一个带ACK标志的数据包，代表“握手”结束。

### 负责域名解析的DNS服务

和HTTP协议一样位于应用层。提供通过域名查IP，或逆向从IP反查域名的服务。

# 简单的HTTP协议

## 告知服务器意图的HTTP方法

1. GET：获取资源

   用于请求访问已被URI识别的资源。指定资源经服务器端解析后返回响应内容。

2. POST：传输实体主体

   POST的主要目的并不是获取响应的主体内容，一般用于修改服务器端数据。

3. PUT：传输文件

   像FTP协议的文件上传一样，要求在请求报文的主体中包含文件内容，然后保存到请求URI指定的位置。

   鉴于HTTP/1.1的PUT方法自身不带验证机制，任何人都可以上传文件，存在安全问题，因此一般Web网站不使用该种方法。配合Web应用程序的验证机制，或架构设计采用REST(Representational State Transfer，表征状态转移)标准的同类Web网站，就可能开放。

4. HEAD：获得报文首部

   和GET方式一样，但不返回报文主体部分。用于确认URI的有效性及资源更新的日期时间等。

5. DELETE：删除文件

   与PUT类似，按请求URI删除指定的资源。同样存在安全性问题。

6. OPTIONS：询问支持的方法

   用来查询针对请求URI指定的资源支持的方法。

   ```http
   HTTP/1.1 200 OK
   Allow: GET, POST, HEAD, OPTIONS
   ```

7. TRACE：追踪路径

   让Web服务器端将之前的请求通信环回给客户端的方法。

   发送请求时，在`Max-ForWards`首部字段中填入数值，每经过一个服务器端就减1，当刚好减到0时，就停止继续传输，最后接收到请求的服务器端则返回状态码`200 OK`的响应。用来确认连接源目标服务器过程中发生的一系列操作。（不常用）

8. CONNECT：要求用隧道协议连接代理

   要求在与代理服务器通信时建立隧道，实现用隧道协议进行TCP通信。主要使用SSL(Secure Sockets Layer，安全套接层)和TLS(Transport Layer Security，传输层安全)协议把通信内容加密后经网络隧道传输。

   CONNECT方法的格式： `CONNECT 代理服务器名:端口号 HTTP版本`

   ```http
   CONNECT proxy.hackr.jp:8080 HTTP/1.1
   Host: proxy.hackr.jp
   -------
   HTTP/1.1 200 OK
   ```

## 持久连接节省通信量

### 持久连接

持久连接，也称HTTP keep-alive或HTTP connection reuse方法。持久连接的特点是，只要任意一端没有明确提出断开连接，则保持TCP连接状态。

### 管线化

持久连接使得多数请求以管线化(pipelining)方式发送成为可能。管线化技术可以不用等待响应亦可直接发送下一个请求。

## 使用Cookie的状态管理

Cookie会根据从服务器端发送的响应报文内的一个叫做Set-Cookie的首部字段信息，通知客户端保存Cookie。当下次客户端往该服务器发送请求时，客户端会自动在请求报文中加入Cookie值后发送出去。服务器端发现客户端发送过来的Cookie后，会去检查客户端来源，对比服务器上的记录，最后得到之前的状态信息。

# HTTP报文内的HTTP信息

## HTTP报文

用于HTTP协议交互的信息被称为HTTP报文。分为请求报文和响应报文。HTTP报文本身是由多行数据构成的字符串文本（用CR+LF换行）。HTTP报文大致可分为报文首部和报文主体两块，用空行划分。通常不一定要有报文主体。

## 报文结构

报文首部（请求/状态行，请求/响应首部字段，通用首部字段，实体首部字段，其他），空行(CR+LF)，报文主体

## 编码提升传输速率

### 报文主体和实体主体的差异

- 报文（message）

  是HTTP通信中的基本单位，由8位组字节流组成，通过HTTP通信传输。

- 实体（entity）

  作为请求或响应的有效载荷数据（补充项）被传输，其内容由实体首部和实体主体组成。

HTTP报文的主体用于传输请求或响应的实体主体。通常，报文主体等于实体主体。只有在传输中进行编码操作时，实体主体的内容发生变化，才导致它和报文主体产生差异

### 压缩传输的内容编码

内容编码指明应用在实体内容上的编码格式，并保持实体信息原样压缩。内容编码后的实体由客户端接收并负责解码。常用的内容编码有已下几种：

- gzip (GNU zip)
- compress (UNIX系统的标准压缩)
- deflate (zlib)
- identity (不进行编码)

### 分割发送的分块传输编码

在传输大容量数据时，通过把数据分割成多块，能够让浏览器逐步显示页面。这种把实体主体分块的功能称为分块传输编码(Chunked Transfer Coding)。

分块传输编码会将实体主体分成多个部分（块）。每一块都会用十六进制来标记块的大小，而实体主体的最后一块会用`0(CR+LF)`来标记。

## 发送多种数据的多部分对象集合

发送邮件时，我们可以在邮件里写入文字并添加多份附件。这是因为采用了MIME(Multipurpose Internet Mail Extensions，多用途因特网邮件扩展)机制，它允许邮件处理文本、图片、视频等多个不同类型的数据。例如，图片等二进制数据以ASCII码字符串编码的方式指明，就是利用MIME来描述标记数据类型。而在MIME扩展中会使用一种称为多部分对象集合(Multipart)的方法，来容纳多份不同类型的数据。

相应地，HTTP协议中也采纳了多部分对象集合，发送的一份报文主体内可含有多类型实体。通常是在图片或文本文件等上传时使用。

多部分对象集合包含的对象如下。

- multipart/form-data

  在Web表单文件上传时使用。

  ```http
  Content-Type: multipart/form-data; boundary=AaB03x

  --AaB03x
  Content-Disposition: form-data; name="field1"

  Joe Blow
  --AaB03x
  Content-Disposition: form-data; name="pics"; filename="file1.txt"
  Content-Type: text/plain

  ...(file1.txt's data)...
  --AaB03x--
  ```

- multipart/byteranges

  状态码206(Partial Content，部分内容)响应报文包含了多个范围的内容时使用。

  ```http
  HTTP/1.1 206 Partial Content
  Date: Fri, 13 Jul 2012 02:45:26 GMT
  Last-Modified: Fri, 31 Aug 2007 02:02:20 GMT
  Content-Type: multipart/byteranges; boundary=THIS_STRING_SEPARATES

  --THIS_STRING_SEPARATES
  Content-Type: application/pdf
  Content-Range: bytes 500-999/8000

  ...(范围指定的数据)...
  --THIS_STRING_SEPARATES
  Content-Type: application/pdf
  Content-Range: bytes 7000-7999/8000

  ...(范围指定的数据)...
  --THIS_STRING_SEPARATES--
  ```

## 获取部分内容的范围请求

指定范围发送的请求叫做范围请求(Range Request)。执行范围请求时，会用到首部字段Range来指定资源的byte范围。

- 5001~10000字节：`Range: bytes=5001-10000`
- 从5001字节之后全部的：`Range: bytes=5001-`
- 从一开始到3000字节和5000~7000字节的多重范围：`Range: bytes=-3000, 5000-7000`

针对范围请求，响应会返回状态码为`206 Partial Content`的响应报文。另外，对于多重范围的范围请求，响应会在首部字段`Content-Type`标明`multipart/byteranges`后返回响应报文。如果服务器无法响应范围请求，则返回`200 OK`和完整的实体内容。

## 内容协商返回最合适的内容

同一个Web网站可能存在多份相同内容的页面。比如英文版和中文版的Web页面，内容相同，但使用的语言不同。当浏览器的默认语言为英文或中文，访问相同URI的Web页面时，则会显示对应中文版或英文版的Web页面。这样的机制成为内容协商(Content Negotiation)。

内容协商会以响应资源的语言、字符集、编码方式等作为判断的基准。内容协商技术有以下3种类型：

- 服务器驱动协商(Server-driven Negotiation)

  以请求的首部字段为参考，在服务器端自动处理。但对于用户来说，并不一定能筛选出最优内容。

- 客户端驱动协商(Agent-driven Negotiation)

  用户从浏览器显示的可选项列表中手动选择，还可以利用JavaScript脚本在Web页面上自动进行上述选择。比如按OS的类型或浏览器类型，自动切换成PC版页面或手机版页面。

- 透明协商(Transparent Negotiation)

  是两者的结合体，由服务器端和客户端各自进行内容协商。

# 返回结果的HTTP状态码

## 状态码告知从服务器端返回的请求结果

|      | 类别                     | 原因短语          |
| ---- | ---------------------- | ------------- |
| 1XX  | Informational(信息性状态码)  | 接受的请求正在处理     |
| 2XX  | Success(成功状态码)         | 请求正常处理完毕      |
| 3XX  | Redirection(重定向状态码)    | 需要进行附加操作以完成请求 |
| 4XX  | Client Error(客户端错误状态码) | 服务器无法处理请求     |
| 5XX  | Server Error(服务器错误状态码) | 服务器处理请求出错     |

## 2XX Success

### 200 OK

表明从客户端发来的请求在服务器端被正常处理了。在响应报文内，随状态码一起返回的信息会因方法不同发生改变。

### 204 No Content

代表服务器接收的请求已成功处理，但在返回的响应报文中不含实体的主体部分。比如，当从浏览器发出请求处理后，返回204响应，那么浏览器显示的页面不发生变化。

一般在只需要从客户端往服务器发送信息，而对客户端不需要发送新信息内容的情况下使用。

### 206 Partial Content

 表示客户端进行了范围请求，而服务器成功执行了这部分的GET请求。响应报文中包含由Content-Range指定范围的实体内容。

## 3XX Redirection

表明浏览器需要执行某些特殊的处理以正确处理请求。

### 301 Moved Permanently

永久性重定向。表示请求的资源已被分配了新的URI，以后应使用资源现在所指的URI。

当指定资源路径的最后忘记添加斜杠，就会产生301状态码：`http://example.com/sample`

### 302 Found

临时性重定向。表示请求的资源已被分配了新的URI，希望用户（本次）能使用新的URI访问。与301类似，但是302表示资源不是永久移动，是临时的。换句话说，已移动的资源对应的URI将来还可能发生变化。不会去更新书签。

### 303 See Other

表示由于请求对应的资源存在另一个URI，应使用GET方法定向获取请求的资源。与302类似，但303明确表示客户端应当采用GET方法获取资源。

> 当301、302、303响应状态码返回时，几乎所有的浏览器都会把POST改成GET，并删除请求报文内的主体，之后请求会自动再次发送。
>
> 301、302标准是禁止将POST方法改成GET方法的，但实际使用时大家都会这么做。

### 304 Not Modified

表示客户端发送附带条件的请求时，服务器端允许请求访问资源，但因发生请求为满足条件的情况后，直接返回`304 Not Modified`（服务器端资源未改变，可直接使用客户端未过期的缓存）。304返回不包含任何响应的主体。

[^附带条件的请求]: 是指采用GET方法的请求报文中包含If-Match，If-Modified-Since，If-None-Match，If-Range，If-Unmodified-Since中任一首部

### 307 Temporary Redirect

临时重定向。与`302 Found`有相同的含义。307会遵照浏览器的标准，不会从POST变成GET。但是，对于处理响应时的行为，每种浏览器有可能出现不同的情况。

## 4XX Client Error

### 400 Bad Request

表示请求报文中存在语法错误。

### 401 Unauthorized

表示发送的请求需要有通过HTTP认证（BASIC认证、DIGEST认证）的认证信息。若之前已进行过一次请求，则表示用户认证失败。

返回含有401的响应必须包含一个适用于被请求资源WWW-Authenticate首部用以质询(challenge)用户信息。当浏览器初次接收到401响应，会弹出认证用的对话窗口。

### 403 Forbidden

表示对请求资源的访问被服务器拒绝了。服务器端没有必要给出拒绝的详细理由，也可以在实体的主要部分对原因进行描述，就可以让用户看到。

### 404 Not Found

表示服务器上无法找到请求的资源。除此之外，也可以在服务器端拒绝请求且不想说明理由时使用。

## 5XX Server Error

### 500 Internal Server Error

表明服务器端在执行请求时发生了错误。也有可能是Web应用存在bug或某些临时的故障。

### 503  Service Unavailable

表明服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。如事先得知解除以上状况需要的时间，最好写入Retry-After首部字段再返回给客户端。

# 与HTTP协作的Web服务器

## 用单台虚拟主机实现多个域名

HTTP/1.1规范允许一台HTTP服务器搭建多个Web站点。