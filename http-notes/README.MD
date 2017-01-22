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

HTTP/1.1规范允许一台HTTP服务器搭建多个Web站点。即使物理层面只有一台服务器，但只要使用虚拟主机(Virtual Host)的功能，则可以假想已具有多台服务器。如果一台服务器内托管了两个域名，当收到请求的时候就需要弄清楚究竟要访问哪个域名。

在相同的IP地址下，由于虚拟主机可以寄存多个不同主机名和域名的Web网站，因此在发送HTTP请求时，必须在Host首部内完整指定主机名或域名的URI。

## 通信数据转发程序：代理、网关、隧道

代理、网关、隧道等应用程序和服务器可以将请求转发给通信线路上的下一站服务器，并且能接收从那台服务器发送的响应再转发给客户端。

- 代理

  代理是一种有转发功能的应用程序，它扮演了位于服务器和客户端“中间人”的角色，接收由客户端发送的请求并转发给服务器，同时也接收服务器返回的响应并转发给客户端。

- 网关

  网关是转发其他服务器通信数据的服务器，接收从客户端发来的请求时，它就像自己拥有资源的源服务器一样对请求进行处理。有时客户端可能都不会察觉，自己的通信目标是一个网关。

- 隧道

  隧道是在相隔甚远的客户端和服务器两者之间进行中转，并保持双方通信连接的应用程序。

### 代理

代理不改变请求URI，会直接发送给前方持有资源的目标服务器。持有资源的服务器被称为源服务器。从源服务器返回的响应经过代理服务器后再传给客户端。

在HTTP通信过程中，可级联多台代理服务器。请求和响应的转发会经过数台类似锁链一样连起来的代理服务器。转发时，需要附加Via首部字段以标记出经过的主机信息。

使用代理服务器的理由：利用缓存技术减少网络带宽的流量，组织内部针对特定网站的访问控制，以获取访问日志为主要目的，等等。代理有多种使用方法，按两种基准分类。一种是是否使用缓存，另一种是是否会修改报文。

- 缓存代理

  代理转发响应时，缓存代理(Caching Proxy)会预先将资源的副本（缓存）保存在代理服务器上。当代理再次接收到对相同资源的请求时，就可以不从源服务器哪里获取资源，而是将之前缓存的资源作为响应返回。

- 透明代理

  转发请求或响应时，不对报文做任何加工的代理类型被称为透明代理(Transparent Proxy)。反之，对报文内容进行加工的代理被称为非透明代理。

### 网关

网关的工作机制和代理十分相似。而网关能使线路上的服务器提供非HTTP协议服务。客户端以HTTP请求网关，网关用非HTTP协议与服务器通信，然后以HTTP响应客户端。

利用网关可以提高通信的安全性，因为可以再客户端与网关之间的通信线路上加密以确保连接的安全性。比如，网关可以连接数据库，使用SQL语句查询数据。另外，在Web购物网站上进行信用卡结算时，网关可以和信用卡结算系统联动。

### 隧道

隧道可按要求建立起一条鱼其他服务器的通信线路，届时使用SSL等加密手段进行通信。隧道的目的是确保客户端能与远距离的服务器进行安全的通信。

隧道本身不会去解析HTTP请求。也就是说，请求保持原样中转给之后的服务器。隧道会在通信双方断开连接时结束。隧道本身是透明的，客户端不用在意隧道的存在。

## 保存资源的缓存

缓存是指代理服务器或客户端本地磁盘内保存的资源副本。利用缓存可以减少对服务器的访问，因此也就节省了通信流量和通信时间。

缓存服务器是代理服务器的一种，并归类在缓存代理类型中。当代理转发从服务器返回的响应时，代理服务器将会保存一份资源的副本。

### 缓存的有效期限

当源服务器更新时，如果还是使用不变的缓存，就会返回更新前的“旧”资源。即使存在缓存，也会因为客户端的要求、缓存的有效期等因素，向源服务器确认资源的有效性。若判断缓存失效，缓存服务器会再次从源服务器上获取“新”资源。

### 客户端的缓存

缓存不仅可以存在于缓存服务器内，还可以存在客户端浏览器中。IE将客户端缓存称为临时网络文件(Temporary Internet File)。如果浏览器缓存有效，将不会向服务器请求资源，直接读取本地资源。当判定缓存过期后，会向源服务器确认资源的有效性。



> **在HTTP出现之前的协议**
>
> - FTP (File Transfer Protocol)
>
>   传输文件时使用的协议。该协议历史久远，可追溯到1973年前后，比TCP/IP协议族的出现还早。沿用至今。
>
> - NNTP (Network News Transfer Protocol)
>
>   用于NetNews电子会议室内传送消息的协议。现在，利用Web交换信息已成主流，该协议不怎么使用了。
>
> - Archie
>
>   搜索 anonymous FTP 公开的文件信息的协议。现在已经不常使用。
>
> - WAIS (Wide Area Information Servers)
>
>   以关键词检索多个数据库使用的协议。现在已被HTTP协议代替，已经不怎么使用。
>
> - Gopher
>
>   查找与互联网连接的计算机内信息的协议。现在已被HTTP协议代替，已经不怎么使用。

# HTTP首部

## HTTP报文首部

HTTP协议的请求和响应报文中必定包含HTTP首部。首部内容为客户端和服务器分别处理请求和响应提供所需要的信息。对于客户端用户来说，这些信息中的大部分内容都无须亲自查看。报文首部由几个字段构成。

**HTTP请求报文**

在请求中，HTTP报文由方法、URI、HTTP版本、HTTP首部字段等部分构成。

```http
GET / HTTP/1.1
Host: hackr.jp
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/= >20100101 Firefox/13.0
Accept: text/html, application/xhtml+xml, application/xml; q=0.9 */*; q=0.8
Accept-Language: ja, en-us; q=0.7,en; q=0.3
Accept-Encoding: gzip, deflate
DNT: 1
Connection: keep-alive
If-Modified-Since: Fri, 31 Aug 2007 02:02:20 GMT
If-None-Match: "45bae1-16a-46d776ac"
Cache-Control: max-age=0
```

**HTTP 响应报文**

在响应中，HTTP 报文由 HTTP 版本、状态码（数字和原因短语）、HTTP 首部字段 3 部分构成

```http
HTTP/1.1 304 Not Modified
Date: Thu, 07 Jun 2012 07:21:36 GMT
Server: Apache
Connection: close
Etag: "45bae1-16a-46d776ac"
```

在报文众多的字段当中，HTTP 首部字段包含的信息最丰富。首部字段同时存在于请求和响应报文内，并涵盖HTTP报文相关的内容信息。因HTTP版本或扩展规范的变化，首部字段可支持的字段内容略有不同。下面只涉及HTTP/1.1及常用的首部字段。

## HTTP 首部字段

### HTTP 首部字段传递重要信息

HTTP 首部字段是构成 HTTP 报文的要素之一，它能起到传递额外重要信息的作用。使用首部字段是为了给浏览器和服务器提供报文主体大小、所使用的语言、认证信息等内容。

### HTTP 首部字段结构

首部字段结构：`首部字段名: 字段值`。单个 HTTP 首部字段可以有多个字段值与之对应。如：`Keep-Alive: timeout=15, max=100`

> **若 HTTP 首部字段重复了会如何**
>
> 当 HTTP 报文首部中出现了两个或两个以上具有相同首部字段名时，在规范内尚未明确，根据浏览器内部处理逻辑的不同，结果可能会不一致。有的会优先处理第一次出现的首部字段，而有些会优先处理最后出现的。

### 4 种 HTTP 首部字段类型

- 通用首部字段 (General Header Fields)

  请求报文和响应报文两方都会使用的首部

- 请求首部字段 (Request Header Fields)

  从客户端向服务器端发送请求报文时使用的首部。补充了请求的附加内容、客户端信息、响应内容相关优先级等信息。

- 响应首部字段 (Response Header Fields)

  从服务器端向客户端返回响应报文时使用的首部。补充了响应的附加内容，也会要求客户端附加额外的内容信息。

- 实体首部字段 (Entity Header Fields)

  针对请求报文和响应报文的实体部分使用的首部。补充了资源内容更新时间等与实体有关的信息。

### HTTP/1.1 首部字段一览

**通用首部字段**

| 首部字段名             | 说明            |
| ----------------- | ------------- |
| Cache-Control     | 控制缓存的行为       |
| Connection        | 逐跳首部、连接的管理    |
| Date              | 创建报文的日期时间     |
| Pragma            | 报文指令          |
| Trailer           | 报文末端的首部一览     |
| Transfer-Encoding | 指定报文主体的传输编码方式 |
| Upgrade           | 升级为其他协议       |
| Via               | 代理服务器的相关信息    |
| Warning           | 错误通知          |

**请求首部字段**

| 首部字段名               | 说明                              |
| ------------------- | ------------------------------- |
| Accept              | 用户代理可处理的媒体类型                    |
| Accept-Charset      | 优先的字符集                          |
| Accept-Encoding     | 优先的内容编码                         |
| Accept-Language     | 优先的语言（自然语言）                     |
| Authorization       | Web 认证信息                        |
| Expect              | 期待服务器的特定行为                      |
| From                | 用户的电子邮箱地址                       |
| Host                | 请求资源所在服务器                       |
| If-Match            | 比较实体标记（ETag）                    |
| If-Modified-Since   | 比较资源的更新时间                       |
| If-None-Match       | 比较实体标记（与If-Match相反）             |
| If-Range            | 资源未更新时发送实体Byte的范围请求             |
| If-Unmodified-Since | 比较资源的更新时间（与If-Modified-Since相反） |
| Max-Forwards        | 最大传输逐跳数                         |
| Proxy-Authorization | 代理服务器要求客户端的认证信息                 |
| Range               | 实体的字节范围请求                       |
| Referer             | 对请求中 URI 的原始获取方                 |
| TE                  | 传输编码的优先级                        |
| User-Agent          | HTTP 客户端程序的信息                   |

**响应首部字段**

| 首部字段名              | 说明             |
| ------------------ | -------------- |
| Accept-Ranges      | 是否接受字节范围请求     |
| Age                | 推算资源创建经过时间     |
| ETag               | 资源的匹配信息        |
| Location           | 令客户端重定向至指定URI  |
| Proxy-Authenticate | 代理服务器对客户端的认证信息 |
| Retry-After        | 对再次发起请求的时机要求   |
| Server             | HTTP 服务器的安装信息  |
| Vary               | 代理服务器缓存的管理信息   |
| WWW-Authenticate   | 服务器对客户端的认证信息   |

**实体首部字段**

| 首部字段名            | 说明             |
| ---------------- | -------------- |
| Allow            | 资源可支持的 HTTP 方法 |
| Content-Encoding | 实体主体适用的编码方式    |
| Content-Language | 实体主体的自然语言      |
| Content-Length   | 实体主体的大小（单位：字节） |
| Content-Location | 替代对应资源的 URI    |
| Content-MD5      | 实体主体的报文摘要      |
| Content-Range    | 实体主体的位置范围      |
| Content-Type     | 实体主体的媒体类型      |
| Expires          | 实体主体过期的日期时间    |
| Last-Modified    | 资源的最后修改日期时间    |

### 非 HTTP/1.1 首部字段

在 HTTP 协议通信交互中使用到的首部字段，不限于 RFC2616 中定义的 47 种首部字段。还有 Cookie、Set-Cookie 和 Content-Disposition 等在其他 RFC 中定义的首部字段，它们的使用频率也很高。

这些非正式的首部字段统一归纳在 RFC4229 HTTP Header Field Registrations 中。

### End-to-end 首部和 Hop-by-hop 首部

HTTP 首部字段将定义成缓存代理和非缓存代理的行为，分为 2 种类型。

- 端到端首部（End-to-end Header）

  分在此类别中的首部会转发给请求/响应对应的最终接收目标，且必须保存在由缓存生成的响应中，另外规定它必须被转发。

- 逐跳首部（Hop-by-hop Header）

  分在次类别中的首部只对单次转发有效，会因通过缓存或代理而不再转发。HTTP/1.1 和之后版本中，如果要使用 hop-by-hop 首部，需要提供 Connection 首部字段。

下面列举了 HTTP/1.1 中的逐跳首部字段。除这 8 个首部字段之外，其他均属于端到端首部。

- Connection
- Keep-Alive
- Proxy-Authenticate
- Proxy-Authorization
- Trailer
- TE
- Transfer-Encoding
- Upgrade

## HTTP/1.1 通用首部字段

### Cache-Control

通过指定首部字段 Cache-Control 的指令，就能操作缓存的工作机制。指令的参数是多选的，多个指令通过`,`分隔。

**Cache-Control 指令一览**

缓存请求指令

| 指令                | 参数   | 说明             |
| ----------------- | ---- | -------------- |
| no-cache          | 无    | 强制向源服务器再次验证    |
| no-store          | 无    | 不缓存请求或响应的任何内容  |
| max-age = [秒]     | 必需   | 响应的最大Age值      |
| max-stale( = [秒]) | 可省略  | 接收已过期的响应       |
| min-fresh = [秒]   | 必需   | 期望在指定时间内的响应仍有效 |
| no-transform      | 无    | 代理不可更改媒体类型     |
| only-if-cached    | 无    | 从缓存获取资源        |
| cache-extension   | -    | 新指令标记（token）   |

缓存响应指令

| 指令              | 参数   | 说明                      |
| --------------- | ---- | ----------------------- |
| public          | 无    | 可向任意方提供响应的缓存            |
| private         | 可省略  | 仅向特定用户返回响应              |
| no-cache        | 可省略  | 缓存前必须先确认其有效性            |
| no-store        | 无    | 不缓存请求或响应的任意内容           |
| no-transform    | 无    | 代理不可更改媒体类型              |
| must-revalidate | 无    | 要求中间缓存服务器对缓存的响应有效性再进行确认 |
| max-age = [秒]   | 必需   | 响应的最大Age值               |
| s-maxage = [秒]  | 必需   | 公关缓存服务器响应的最大Age值        |
| cache-extension | -    | 新指令标记（token）            |

#### 表示是否能缓存的指令

- public

  `Cache-Control: public`

  当指定使用 public 指令时，则明确表明其他用户也可利用缓存。

- private

  `Cache-Control: private`

  当指定 private 指令后，响应只以特定的用户作为对象，与 public 相反。缓存服务器会对该特定用户提供资源缓存的服务，对于其他用户发送过来的请求，代理服务器则不会返回缓存。

- no-cache

  `Cache-Control: no-cache`

  使用 no-cache 指令的目的是为了防止从缓存中返回过期的资源。客户端发送的请求中包含 no-cache 指令，则表示客户端将不会接受缓存过的响应。服务器返回的响应中如果包含 no-cache 指令，那么缓存服务器不能对资源进行缓存。

  `Cache-Control: no-cache=Location`

  由服务器返回的响应中，若报文首部字段 Cache-Control 中对 no-cache 字段名具体指定参数值，那么客户端在接收到这个响应报文后，就不能使用缓存。只能在响应指令中指定该参数。

#### 控制可执行缓存的对象的指令

- no-store

  `Cache-Control: no-store`

  该指令规定缓存不能在本地存储请求或响应的任一部分。

#### 指定缓存期限和认证的指令

- s-maxage

  `Cache-Control: s-maxage=60480(s)`

  功能和 max-age 相同，不同点是 s-maxage 指令只适用于供多位用户使用的公共缓存服务器。也就是说，对于向同一用户重复返回响应的服务器来说，这个指令没有任何作用。另外，当使用 s-maxage 指令后，则直接忽略对 Expires 首部字段及 max-age 指令的处理。

- max-age

  `Cache-Control: max-age=60480(s)`

  当**请求**中包含 max-age 时，如果判定缓存资源的缓存时间数值比指定时间的数值更小，那么客户端就接受缓存的资源。当`max-age=0`时缓存服务器通常需要将请求转发给源服务器。当**响应**中包含 max-age 时，缓存服务器将不对资源的有效性再作确认，而 max-age 数值代表资源保存为缓存的最长时间。

  HTTP/1.1版本的缓存服务器会优先处理 max-age，忽略Expires。而 HTTP/1.0 版本会优先处理 Expires，忽略 max-age。

- min-fresh

  `Cache-Control: min-fresh=60(s)`要求缓存服务器返回至少还未过指定时间的缓存资源

- max-stale

  `Cache-Control: max-stale=3600(s)`指示缓存资源即使过期也照常接收。如未指定具体数字，那么即使过期，只要仍处于 max-stale 指定的时间内，仍旧会被客户端接收。

- only-if-cached

  `Cache-Control: only-if-cached`表示客户端仅在缓存服务器本地缓存目标资源的情况下才会要求其返回。换言之，该指令要求缓存服务器不重新加载响应，也不会再次确认资源有效性。若发送请求缓存服务器的本地缓存无响应，则返回状态码`504 Gateway Timeout`

- must-revalidate

  `Cache-Control: must-revalidate`代理会向源服务器再次验证即将返回的响应缓存目前是否仍然有效。若代理无法连通源服务器再次获取有效资源的话，缓存必须给客户端一条`504 Gateway Timeout`状态码。

  使用 must-revalidate 指令会忽略请求的 max-stale 指令。

- proxy-revalidate

  `Cache-Control: proxy-revalidate`要求所有的缓存服务器在接收到客户端带有该指令的请求返回响应之前，必须再次验证缓存的有效性。

- no-transform

  `Cache-Control: no-transform`规定无论是在请求还是响应中，缓存都不能改变实体主体的媒体类型。可以防止缓存或代理压缩图片等类似操作。

#### Cache-Control 扩展

- Cache-extension token

  `Cache-Control: private, community="UCI"`通过 cache-extension 标记（token），可以扩展 Cache-Control 首部字段内的指令。如果缓存服务器不能理解 community 这个新指令，就会直接忽略。

### Connection

Connection 首部字段具备如下两个作用：

#### 控制不再转发给代理的首部字段

`Connection: 不再转发的首部字段名`在客户端发送请求和服务器返回响应内，使用 Connection 可控制不再转发给代理的首部字段（即 Hop-by-hop 首部）。

#### 管理持久连接

`Connection: close` HTTP/1.1 版本的默认连接都是持久连接。为此，客户端会在持久连接上连续发送请求。当服务器端想明确断开连接时，则指定 Connection 首部字段的值为 close。

`Connection: Keep-Alive` HTTP/1.1 之前的 HTTP 版本的默认连接都是非持久连接。为此，如果想在旧版本的 HTTP 协议上为此持续连接，则需要指定 Connection 首部字段的值为 Keep-Alive。

客户端发送请求给服务器时，带有`Connection: Keep-Alive`。服务器返回响应时也会加上`Connection: Keep-Alive`

### Date

表明创建 HTTP 报文的日期和时间。HTTP/1.1 协议使用在 RFC1123 中规定的日期时间的格式，如下所示：

```http
Date: Tue, 03 Jul 2012 04:40:59 GMT
```

之前的 HTTP 协议版本中使用在 RFC850 中定义的格式，如下所示：

```http
Date: Tue, 03-Jul-12 04:40:59 GMT
```

还有一种格式，与C标准库内的 asctime() 函数的输出格式一致：

```http
Date: Tue Jul 03 04:40:59 2012
```

### Pragma

是 HTTP/1.1 之前版本的历史遗留字段，仅作为与 HTTP/1.0 的向后兼容而定义。

`Pragma: no-cache` 该首部字段属于通用首部字段，但只用在客户端发送的请求中。客户端会要求所有的中间服务器不返回缓存的资源。所有的中间服务器如果都能以 HTTP/1.1 为基准，那直接采用`Cache-Control: no-cache` 指定缓存是最理想的。但要整体掌握全部中间服务器使用的 HTTP 协议版本不现实。因此，发送请求会同时含有下面两个首部字段。

```http
GET / HTTP/1.1
Cache-Control: no-cache
Pragma: no-cache
```

### Trailer

首部字段 Trailer 会实现说明在报文主体后记录了哪些首部字段。该首部字段可应用在 HTTP/1.1 版本分块传输编码时。

```http
HTTP/1.1 200 OK
Date: Tue, 03 Jul 2012 04:40:56 GMT
Content-Type: text/html
...
Transfer-Encoding: chunked
Trailer: Expires

...(报文主体)...
0
Expires: Tue, 28 Sep 2004 23:59:59 GMT
```

指定首部字段 Trailer 的值为 Expires，在报文主体之后（分块长度 0 之后）出现了首部字段 Expires。

### Transfer-Encoding

首部字段 Transfer-Encoding 规定了传递报文主体时采用的编码方式。HTTP/1.1 的传输编码方式仅对分块传输编码有效。

`Transfer-Encoding: chunked`

### Upgrade

首部字段 Upgrade 用于检测 HTTP 协议及其他协议是否可使用更高的版本进行通信，其参数值可以用来指定一个完全不同的通信协议。

```http
GET /index.html HTTP/1.1
Upgrade: TLS/1.0
Connection: Upgrade
```

```http
HTTP/1.1 101 Switching Protocols
Upgrade: TLS/1.0, HTTP/1.1
Connection: Upgrade
```

使用首部字段 Upgrade 时，还需要额外指定 `Connection: Upgrade`。对于附有 Upgrade 的请求，服务器可用 `101 Switching Protocols`状态码作为响应返回。

### Via

使用首部字段 Via 是为了追踪客户端与服务器之间的请求和响应报文的传输路径，还可以避免请求回环的发生。经常会和 TRACE 方法一起使用。

### Warning

HTTP/1.1 的 Warning 首部是从 HTTP/1.0 的响应首部（Retry-After）演变过来的。该首部通常会告知用户一些与缓存相关的问题的警告。

```http
HTTP/1.1 200 OK
Warning: 113 gw.hackr.jp:8080 "Heuristic expiration" Tue, 03 Jul => 2012 05:09:44 GMT
Warning: [警告码] [警告的主机:端口号] "[警告内容]" ([日期时间])
```

HTTP/1.1 中定义了 7 种警告。

| 警告码  | 警告内容                                     | 说明                                    |
| ---- | ---------------------------------------- | ------------------------------------- |
| 110  | Response is stale（响应已过期）                 | 代理返回已过期的资源                            |
| 111  | Revalidation failed（再验证失败）               | 代理再验证资源有效性时失败（服务器无法到达等原因）             |
| 112  | Disconnection operation（断开连接操作）          | 代理与互联网连接被故意切断                         |
| 113  | Heuristic expiration（试探性过期）              | 响应的使用期超过 24 小时（有效缓存的设定时间大于 24 小时的情况下） |
| 119  | Miscellaneous warning（杂项警告）              | 任意的警告内容                               |
| 214  | Transformation applied（使用了转换）            | 代理对内容编码或媒体类型等执行了某些处理时                 |
| 299  | Miscellaneous persistent warning（持久杂项警告） | 任意的警告内容                               |

## 请求首部字段

### Accept

```
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
```

Accept 首部字段可通知服务器，用户代理能够处理的媒体类型及媒体类型的相对优先级。可使用 type/subtype 这种形式，一次指定多种媒体类型。下面举几个媒体类型的例子。

- 文本文件

  ```
  text/html, text/plain, text/css...  application/xhtml+xml, application/xml...
  ```

- 图片文件

  ```
  image/jpeg, image/gif, image/png...
  ```

- 视频文件

  ```
  video/mpeg, video/quicktime
  ```

- 应用程序使用的二进制文件

  ```
  application/octet-stream, application/zip...
  ```

如果浏览器不支持显示格式，则使用其他指定的类型显示。若想给显示的媒体类型增加优先级，则使用`q=`来额外表示权重值，用分号进行分隔。q的范围是0~1。当服务器提供多种内容时，优先返回权重值最高的媒体类型。

### Accept-Charset

```
Accept-Charset: iso-8859-5, unicode-1-1;q=0.8
```

可以用来通知服务器用户代理支持的字符集及字符集的相对优先顺序。可以指定多种字符集，用q表示权重。

### Accept-Encoding

```
Accept-Encoding: gzip, deflate
```

用来告知服务器用户代理支持的内容编码及内容编码的优先级顺序。可一次指定多种内容编码，用q表示权重。可使用星号`*`作为通配符，指定任意的编码格式。

- gzip

  由文件压缩程序 gzip（GNU zip）生成的编码格式（RFC1952），采用 Lempel-Ziv 算法（LZ77）及 32 位循环冗余校验（Cyclic Redundancy Check，通称 CRC）

- compress

  由 UNIX 文件压缩程序 compress 生成的编码格式，采用 Lempel-Ziv-Welch 算法（LZW）

- deflate

  组合使用 zlib 格式（RFC1950）及由 deflate 压缩是算法（RFC1951）生成的编码格式。

- identity

  不执行压缩或不会变化的默认编码格式

### Accept-Language

```
Accept-Language: zh-cn,zh;q=0.7,en-us,en;q=0.3
```

用来告知服务器用户代理能够处理的自然语言集，可一次指定多种语言，用q表示权重。

### Authorization

```
Authorization: Basic dWVub3NlbjpwYXNzd29yZA==
```

用来告知服务器，用户代理的认证信息（证书值）。想通过服务器认证的用户代理会在接收到返回的 401 状态码响应后，把首部字段 Authorization 加入请求中。

### Expect

```
Expect: 100-continue
```

告知服务器期望出现的某种特定行为。如服务器无法理解客户端的期望，会返回状态码`417 Expectation Failed`。HTTP/1.1 只定义了100-continue（状态码`100 Continue`之意）。等待状态码 100 响应的客户端发送请求时需要指定 `Expect: 100-continue`

### From

```
From: info@hackr.jp
```

用来告知服务器使用用户代理的用户的电子邮件地址。

### Host

```
Host: www.hackr.jp
```

告知服务器请求的资源所处的互联网主机名和端口号。Host 首部字段是 HTTP/1.1 规范内唯一一个必须被包含在请求内的首部字段。首部字段 Host 和以单台服务器分配多个域名的虚拟主机的工作机制又很密切的关系。

### If-XXX

形如 If-xxx 这种样式的请求首部字段，都可称为条件请求。服务器只有判断指定条件为真时，才会执行请求。

#### If-Match

```
If-Match: "123456"
```

告知服务器匹配资源所用的实体标记（ETag）值。这时的服务器无法使用弱 ETag 值。服务器会比对 If-Match 的字段值和资源的 ETag 值，仅当两者一致时才会执行请求。反之返回状态码 `412 Precondition Failed` 的响应。还可以使用`*`全匹配。

#### If-None-Match

与 If-Match 作用相反。用于指定 If-None-Match 字段值的实体标记（ETag）值与请求资源的 ETag 不一致时处理请求。在 GET 和 HEAD 方法中使用首部字段 If-None-Match 可获取最新的资源。

#### If-Modified-Since

```
If-Modified-Since: Thu, 15 Apr 2004 00:00:00 GMT
```

告知服务器在 If-Modified-Since 指定的日期之后更新过资源，则希望能处理该请求。若未更新过，则返回状态码 `304 Not Modified` 的响应。可以通过确认首部字段 Last-Modified 来确定资源的更新日期时间。

#### If-Unmodified-Since

```
If-Unmodified-Since: Thu, 03 Jul 2012 00:00:00 GMT
```

与 If-Modified-Since 作用相反。告知服务器，指定的请求资源在指定日期之后未更新过，则处理请求。如果之后发生过更新，则返回状态码 `412 Precondition Failed` 。

#### If-Range

```http
GET /index.html HTTP/1.1
If-Range: "123456"
Range: bytes=5001-10000
```

告知服务器若指定的 If-Range 字段值（ETag 值或者时间）和请求资源的 ETag 值或时间相一致时，则作为范围请求处理。反之，则返回全体资源。

如果使用 If-Match，如果服务器端资源已更新，则会返回 `412 Precondition Failed` ，客户端重新发送请求，再返回新资源。与使用 If-Range 比起来，需要花费两倍的功夫。

### Max-Forwards

```
Max-Forwards: 10
```

通过 TRACE 方式或 OPTIONS 方式，发送包含首部字段 Max-Forwards 的请求时，该字段以十进制整数形式指定可经过的服务器最大数目。服务器在往下一个服务器转发请求之前，会将 Max-Forwards 的值减 1 后重新复制。当服务器接收到 Max-Forwards 值为 0 的请求时，则不再进行转发，而是直接返回响应。可以用于对传输路径上的通信状态有所把握。

### Proxy-Authorization

```
Proxy-Authorization: Basic dGlwOjkpNLAGfFY5
```

接收到代理服务器发来的认证质询时，客户端会发送包含首部字段 Proxy-Authorization 的请求，以告知服务器认证所需要的信息。

这个行为与客户端和服务器之间的 HTTP 访问认证相似，不同处在于，认证行为发生在客户端与代理之间。

### Range

```
Range: bytes=5001-10000
```

告知服务器资源的指定范围。如果能处理范围请求则返回 `206 Partial Content` 的响应。无法处理则返回 `200 OK` 的响应及全部资源。

### Referer

```
Referer: http://www.hackr.jp/index.htm
```

告知服务器请求的原始资源的URI。客户端一般都会发送 Referer 给服务器。但当直接在浏览器的地址栏输入 URI，处于安全考虑时，也可以不发送该首部字段。因为原始资源的URI中的查询字符串可能含有ID和密码等保密信息。

### TE

```
TE: gzip, deflate;q=0.5
```

告知服务器客户端能够处理响应的传输编码方式及相对优先级，与 Accept-Encoding 的功能相似，但是用于传输编码。除指定传输编码之外，还可以指定伴随 trailer 字段的分块传输编码方式。

### User-Agent

```
User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/=>20100101 Firefox/13.0.1
```

会将创建请求的浏览器和用户代理名称等信息传达给服务器。由网络爬虫发起请求时，有可能会在字段内添加爬虫作者的电子邮件地址。此外，如果请求经过代理，那么中间也很可能被添加上代理服务器的名称。

## 响应首部字段

### Accept-Ranges

```
Accept-Ranges: bytes
```

用来告知客户端服务器是否能处理范围请求，以指定获取服务器端某个部分的资源。若可处理范围请求指定其为 `bytes` ，反之指定其为 `none` 。

### Age

```
Age: 600(s)
```

告知服务器源服务器在多久前创建了响应。若创建该响应的服务器是缓存服务器，Age 值是指缓存后的响应再次发起认证到认证完成的时间值。代理创建响应时必须加上首部字段 Age。

### ETag

```
ETag: "82e22293907ce725faf67773957acd12"
```

告知客户端实体标识。它是一种可将资源以字符串形式做唯一性标识的方式。每份资源都会分配对应的 ETag 值，当资源更新时，ETag 值也需要更新。资源被缓存时，就会分配唯一性标识。当使用不同语言环境浏览器访问同一个 URI 时，会返还对应语言的资源。若下载过程中出现连接中断、再连接的情况，都会依照 ETag 值来指定资源。

#### 强 ETag 值

```
ETag: "usagi-1234"
```

强 ETag 值，不论实体发生多么细微的变化都会改变其值。

#### 弱 ETag 值

```
ETag: W/"usagi-1234"
```

弱 ETag 值只用于提示资源是否相同。只有资源发生了根本变化，产生差异时才会改变 ETag 值。

### Location

```
Location: http://www.usagidesign.jp/sample.html
```

将响应接收方引导至某个与请求 URI位置不同的资源。基本上，该字段会配合 `3xx: Redirection` 的响应，提供重定向的 URI。

### Proxy-Authenticate

```
Proxy-Authenticate: Basic realm="Usagidesign Auth"
```

把由代理服务器所需求的认证信息发送给客户端。与客户端和服务器之间的 HTTP 访问认证 WWW-Authenticate 的行为相似，不同之处在于其认证行为是在客户端与代理服务器之间进行的。

### Retry-After

```
Retry-After: 120
```

告知客户端应该在多久之后再次发送请求。主要配合 `503 Service Unavailable` 响应，或 `3xx Redirect`响应。字段可以指定为具体的日期时间，也可以是创建响应后的秒数。

### Server

```
Server: Apache/2.2.17 (Unix)
```

告知客户端当前服务器上安装的 HTTP 服务器应用程序的信息。可包括软件应用名称，版本号和安装时启用的可选项。

```
Server: Apache/2.2.6 (Unix) PHP/5.2.5
```

### Vary

```
Vary: Accept-Language
```

可对缓存进行控制。源服务器会向代理服务器传达关于本地缓存使用方法的命令。从代理服务器接收到源服务器返回包含 Vary 指定项的响应之后，若再要进行缓存，仅对请求中含有相同 Vary 指定首部字段的请求返回缓存。即使对相同资源发起请求，但由于 Vary 指定的首部字段不相同，因此必须要从源服务器重新获取资源。

### WWW-Authenticate

```
WWW-Authenticate: Basic realm="Usagidesign Auth"
```

用于 HTTP 访问认证。告知客户端适用于访问请求 URI 所指定资源的认证方案（Basic 或是 Digest）和带参数指示的质询（challenge）。状态码 `401 Unauthorized` 响应中，肯定带有 WWW-Authenticate。realm 字段的字符串是为了辨别请求 URI 指定资源所受到的保护策略。

## 实体首部字段

### Allow

```
Allow: GET, HEAD
```

通知客户端能够支持 Request-URI 指定资源的所有 HTTP 方法。当服务器收到不支持的 HTTP 方法时，会以状态码 `405 Method Not Allow` 作为响应返回，同时将 Allow 写入首部字段返回。

### Content-Encoding

```
Content-Encoding: gzip
```

会告知客户端服务器对实体的主体部分选用的内容编码方式。内容编码是指在不丢失实体信息的前提下所进行的压缩。

### Content-Language

```
Content-Language: zh-CN
```

告知客户端，实体主体使用的自然语言。

### Content-Length

```
Content-Length: 15000
```

表明了实体主体部分的大小（单位是字节）。对实体主体进行内容编码传输时，不能再使用 Content-Length 首部字段。

### Content-Location

```
Content-Location: http://www.hackr.jp/index-ja.html
```

给出报文主体部分相对应的 URI。和 Location 不同，Content-Location 表示的是报文主体返回资源对应的 URI。比如，对于使用首部字段 Accept-Language 的服务器驱动请求，当返回的页面内容与实际请求的对象不同时，首部字段 Content-Location 内容会写明 URI。（访问 http://www.hackr.jp/ 返回的对象确实 http://www.hackr.jp/index-ja.html 等类似情况）

### Content-MD5

```
Content-MD5: OGFkZDUwNGVhNGY3N2MxMDIwZmQ4NTBmY2IyTY==
```

是一串由 MD5 算法生成的值，其目的在于检查报文主体在传输过程中是否保持完整，以及确认传输到达。对报文主体执行 MD5 算法获得的 128 位二进制数，再通过 Base64 编码后将结果写入 Content-MD5 字段值。客户端会以同样的方式计算比较，确保报文的准确性。

无法通过 Content-MD5 对内容上的偶发性改变查证，也无法检查出恶意篡改。因为内容如果能够被篡改，那么意味着 Content-MD5 同样也可以重新计算然后篡改。

### Content-Range

```
Content-Range: bytes 5001-10000/10000
```

针对范围请求，返回响应时使用 Content-Range，能告知客户端作为响应返回的实体的哪个部分符合范围请求。字段值以字节为单位，表示当前发送部分及整个实体大小。

### Content-Type

```
Content-Type: text/html; charset=UTF-8
```

说明了实体主体内对象的媒体类型。和首部字段 Accept 一样使用 `type/subtype` 形式值。

### Expires

```
Expires: Wed, 04 Jul 2012 08:26:05 GMT
```

会将资源失效的日期告知客户端。缓存服务器会以缓存来应答请求，直到超过指定时间。源服务器不希望缓存服务器对资源缓存时，最好在 Expires 字段内写入与首部字段 Date 相同的时间值。但是，当首部字段 Cache-Control 有指定 max-age 指令时，将优先处理 max-age 指令。

### Last-Modified

```
Last-Modified: Wed, 23 May 2012 09:59:55 GMT
```

指明资源最终修改的时间。一般来说，这个值就是 Request-URI 指定资源被修改的时间。

## 为 Cookie 服务的首部字段

Cookie 的工作机制是用户识别及状态管理。调用 Cookie 时，由于可校验 Cookie 的有效期，以及发送方的域、路径、协议等信息，所以正规发布的 Cookie 内的数据不会因来自其他 Web 站点和攻击者的攻击而泄露。

Cookie的规格标准文档有以下4种。

- 由网景公司颁布的规格标准（目前最为普及的 Cookie 方式是以此为基准的）
- RFC2109（已淡出人们的视线）
- RFC2965（定义了新的 HTTP 首部 Set-Cookie2 和 Cookie2，事实上几乎没投入使用）
- RFC6265（将网景公司制定的标准作为业界事实标准，重新定义 Cookie 标准后的产物）

### Set-Cookie

```
Set-Cookie: status=enable; expires=Tue, 05 Jul 2011 07:26:31 GMT; path=/; domain=.hack.jp;
```

| 属性           | 说明                                       |
| ------------ | ---------------------------------------- |
| NAME=VALUE   | 赋予 Cookie 的名称和其值（必须项）                    |
| expires=DATE | Cookie 的有效期（若不明确指定则默认为浏览器关闭前为止）          |
| path=PATH    | 将服务器上的文件目录作为 Cookie 的适用对象（若不指定则默认为文档所在的文件目录） |
| domain=域名    | 作为 Cookie 适用对象的域名（若不指定则默认为创建 Cookie 的服务器的域名） |
| Secure       | 仅在 HTTPS 安全通信时才会发送 Cookie                |
| HttpOnly     | 加以限制，使 Cookie 不能被 JavaScript 脚本访问        |

- expires 属性

  一旦 Cookie 从服务器端发送至客户端，服务器端就不存在可以显式删除 Cookie 的方法。可以通过覆盖已过期的 Cookie，实现对客户端 Cookie 的实质性删除操作。

- path 属性

  有办法可避开这项限制，安全机制效果不好。

- domain 属性

  除了针对具体指定的多个域名发送 Cookie 之外，不指定 domain 属性更安全。

- secure 属性

  ```
  Set-Cookie: name=value; secure
  ```

  仅在 HTTPS 安全连接的情况下才会进行 Cookie 的回收，即使域名相同使用 HTTP 也不会进行回收。当省略 secure 属性时，不论 HTTP 还是 HTTPS，都会对 Cookie 进行回收。

- HttpOnly 属性

  ```
  Set-Cookie: name=value; HttpOnly
  ```

  主要目的是防止跨站脚本攻击（Cross-site scripting，XSS）对 Cookie 的信息窃取。

### Cookie

```
Cookie: status=enable
```

告知服务区，当前客户端想获得 HTTP 状态管理支持时，就会在请求中包含从服务器接收到的 Cookie。接收到多个 Cookie 时，同样可以以多个 Cookie 形式发送。

## 其他首部字段

### X-Frame-Options

```
X-Frame-Options: DENY
```

属于 HTTP 响应首部，用于控制网站内容在其他 Web 网站的 Frame 标签内的显示问题。主要目的是防止点击劫持（clickjacking）攻击。可以指定两个字段值。

- DENY：拒绝
- SAMEORIGIN：仅同源域名下的页面匹配时许可。

现在主流的浏览器都已支持。能在所有的 Web 服务器端预先设定好 X-Frame-Options 是最理想的状态。

### X-XSS-Protection

```
X-XSS-Protection: 1
```

属于 HTTP 响应首部，是针对跨站脚本攻击（XSS）的一种对策，用于控制浏览器 XSS 防护机制的开关。0 时将 XSS 过滤设置成无效状态，1 时有效。

### DNT

```
DNT: 1
```

属于 HTTP 请求首部，DNT  (Do Not Track)，拒绝个人信息被手机，是表示拒绝被精准广告追踪的一种方法。0 表示同意被追踪，1 为拒绝。

### P3P

```
P3P: CP="CAO DSP LAW CURa ADMa DEVa TAIa PSAa PSDa IVAa IVDa OUR BUS IND UNI COM NAV INT"
```

属于 HTTP 响应首部，通过利用P3P (The Platform for Privacy Preferences，在线隐私偏好平台)技术，可以让 Web 网站上的个人隐私变成一种仅供程序可理解的形式，以达到保护用户隐私的目的。

# 确保 Web 安全的 HTTPS

## HTTP 的缺点

### 通信使用明文可能会被窃听

由于 HTTP 本身不具备加密功能，所以也无法做到对通信整体（使用 HTTP 协议通信的请求和响应的内容）进行加密。即，HTTP 报文使用明文方式发送。

- TCP/IP 是可能被窃听的网络

  对通信内容进行加密，虽然也会被窥视到通信内容，但是有可能让人无法破解报文信息的含义。

- 加密处理防止被窃听

  **通信的加密**

  HTTP 协议中没有加密机制，但是可以通过和 SSL (Secure Socket Layer，安全套接层) 或 TLS (Transport Layer Security，安全传输层协议) 的组合使用，加密 HTTP 的通信内容。用 SSL 建立安全通信线路之后，就可以在这条线路上进行通信了。与 SSL 组合使用的 HTTP 被称为 HTTPS（HTTP Secure，超文本传输安全协议）或 HTTP over SSL。

  **内容的加密**

  把 HTTP 报文里所含的内容进行加密处理。要求客户端和服务区同时具备加密和解密机制。内容仍有被篡改的风险。

### 不验证通信方的身份就可能遭遇伪装

HTTP 协议中的请求和响应不会对通信方进行确认。无法确认“服务器是否就是发送请求中 URI 真正指定的主机，返回的响应是否真的返回到实际提出请求的客户端”等问题。

- 任何人都可发起请求

  服务器会对任何发送过来的请求返回响应。可能存在以下隐患。

  - 无法确定请求发送至目标的 Web 服务器是否是按真实意图返回响应的那台服务器。有可能是已伪装的 Web 服务器
  - 无法确定响应返回到的客户端是否是按真实意图接收响应的那个客户端。有可能是已伪装的客户端
  - 无法确定正在通信的对方是否具备访问权限。因为某些 Web 服务器上保存着重要的信息，只想发给特定用户通信的权限
  - 无法判定请求是来自何方、出自谁手
  - 即使是无意义的请求也会照单全收。无法阻止海量请求下的 DoS 攻击（Denial of Service，拒绝服务攻击）

- 查明对手的证书

  如果使用 SSL 可以确认通信方。SSL 不仅提供加密处理，而且还使用了一种被称为证书的手段，可用于确定方。客户端在开始通信前先确认服务器的证书。通过使用证书，以证明通信方就是意料中的服务器。另外，客户端持有证书即可完成个人身份的确认，也可用于对 Web 网站的认证环节。

### 无法证明报文完整性，可能已遭篡改

- 接收到的内容可能有误

  无法确认发出的请求/响应和接收到的请求/响应是前后相同的。像这样，请求或响应在传输途中，遭攻击者拦截并篡改内容的攻击称为中间人攻击（Min-in-the-Middle attack，MITM）

- 如何防止篡改

  常用的是 MD5 和 SHA-1 等散列值校验的方法，以及用来确认文件的数字签名方法。提供文件下载服务的 Web 网站也会提供相应的以 PGP（Pretty Good Privacy，完美隐私）创建的数字签名及 MD5 算法生成的散列值。PGP 是用来证明创建文件的数字签名，MD5 是由单向函数生成的散列值。不论使用哪一种方法，都需要操纵客户端的用户本人亲自检查验证下载的文件是否就是原来服务器上的文件。

  用这些方法依然无法百分百保证确认结果正确。为了有效防止这些弊端，有必要使用 HTTPS。SSL 提供认证和加密处理及摘要功能。

## HTTP+加密+认证+完整性保护=HTTPS

### HTTP 加上加密处理和认证以及完整性保护后即是 HTTPS

为解决明文传输以及无法确认通信方的问题，在 HTTP 上再加入加密处理和认证等机制。把添加了加密以及认证机制的 HTTP 称为 HTTPS（HTTP Secure）。使用 HTTPS 通信时，不再用 `http://` 而改用 `https://` 。当浏览器访问 HTTPS 通信有效的 Web 网站时，浏览器地址栏内会出现一个带锁的标记，同时显示方式会因浏览器的不同而又所改变。

### HTTPS 是身披 SSL 外壳的 HTTP

HTTPS 并非是应用层的一种新协议。只是 HTTP 通信接口部分用 SSL 和 TLS 协议代替而已。通常 HTTP 直接与 TCP 通信。当使用 SSL 时，则演变成先和 SSL 通信，再由 SSL 和 TCP 通信。采用 SSL 之后，HTTP 就拥有了 HTTPS 的加密、证书和完整性保护这些功能。

SSL 是独立于 HTTP 协议的，也可以运行在应用层的 SMTP 和Telnet 等协议均可配合 SSL 协议使用。可以说 SSL 是当前世界上应用最广泛的网络安全技术。

### 相互交换密钥的公开密钥加密技术

SSL 采用一种叫做公开密钥加密（Public-key cryptography）的加密处理方式。近代的加密方式中加密算法是公开的，而密钥是保密的，以保持加密方式的安全性。

- 共享密钥加密的困境

  加密和解密同用一个密钥的方式称为共享密钥加密（Common key crypto system），也被叫做对称密钥加密。如果通信被监听那么密钥就可能会落入攻击者之手，就失去了加密的意义，另外还得设法安全地保管接收到的密钥。

- 使用两把密钥的公开密钥加密

  公开密钥加密使用一堆非对称的密钥。一把叫做私有密钥（private key），另一把叫做公开密钥（public key）。使用公开密钥加密方式，发送密文的一方使用对方的公开密钥进行加密处理，对法收到被加密的信息后，再使用自己的私有密钥进行解密。

- HTTPS 采用混合加密机制

  HTTPS 采用共享密钥加密和公开密钥加密两者并用的混合加密机制。若密钥能够实现安全交换，那么有可能会考虑仅使用公开密钥加密来通信。但是公开密钥加密比共享密钥加密处理速度慢。所以应充分的利用两者各自的优势，在交换密钥环节使用公开密钥加密方式，之后的见你通信交换报文阶段则使用共享密钥加密方式。

### 证明公开密钥正确性的证书

公开密钥无法证明公开密钥本事就是货真价实的公开密钥。为了解决这个问题，可以使用由数字证书认证机构（CA，Certificate Authority）和其他相关机关颁发的公开密钥证书。数字证书认证机构的业务流程如下。

1. 服务器的运营人员向数字证书认证机构提出公开密钥的申请
2. 对申请的公开密钥做数字签名，分配这个已签名的公开密钥，并将该公开密钥放入公钥证书后绑定在一起
3. 服务器将公钥证书发送给客户端，以进行公开密钥加密方式通信
4. 客户端使用数字证书认证机构的公开密钥，对证书上的数字签名进行验证

一旦验证通过，客户端便可明确两件事：①认证服务器的公开密钥的是真实有效的数字认证机构；②服务器的公开密钥是值得信赖的。

- 可证明组织真实性的 EV SSL 证书

  证书的一个作用是用来证明作为通信一方的服务器是否规范，另外一个作用是可确认对方服务器背后运营的企业是否真实存在。拥有该特性的证书就是 EV SSL 证书（Extended Validation SSL Certificate）。持有 EV SSL 证书的 Web 网站能够获得更高的可信度，在浏览器地址栏处的背景色是绿色的。

- 用以确认客户端的客户端证书

  HTTPS 中还可以使用客户端证书。以客户端证书进行客户端认证，证明服务器正在通信的对方始终是预料之内的客户端。

- 认证机构信誉第一

  SSL 机制中介入认证机构之所以可行，是因为建立在其信用绝对可靠这一大前提下的。因为伪造证书上有规范认证机构的数字签名，所以浏览器会判定该证书是正当的。当伪造的证书被用作服务器伪装时，用户根本无法察觉。虽然存在可将证书无效化的证书吊销列表机制，以及从客户端删除根证书颁发机构的对策，但是距离生效还需要一段时间。

- 由自认证机构颁发的证书称为自签名证书

  如果使用 OpenSSL 这套开源程序，每个人都可以构建一套属于自己的认证机构，从而自己给自己颁发服务器证书。但该服务器证书在互联网上不可作为证书使用，似乎没什么帮助。

  独立构建的认证机构叫做自认证机构，由自认证机构颁发的“无用”证书被称为自签名证书。其无法消除伪装的可能性，即使使用 SSL 加密通信，也不排除正在和已经经过伪装的假服务器保持通信。

  **中级认证机构的证书可能会变成自认证证书**

### HTTPS 的安全通信机制

1. 客户端通过发送 `Client Hello` 报文开始 SSL 通信。报文中包含客户端支持的 SSL 的指定版本、加密组件（Cipher Suite）列表（所使用的加密算法及密钥长度等）
2. 服务器可进行 SSL 通信时，会议 `Server Hello` 报文作为应答。和客户端一样，在报文中包含 SSL 版本以及加密组件。服务器的加密组件内容是从接收到的客户端加密组件内筛选出来的
3. 之后服务器发送 `Certificate` 报文。报文中包含公开密钥证书
4. 最后服务器发送 `Server Hello Done` 报文通知客户端，最初阶段的 SSL 握手协商部分结束
5. SSL 第一次握手结束之后，客户端以 `Client Key Exchange` 报文作为回应。报文中包含通信加密中使用的一种被称为 Pre-master secret 的随机密码串。该报文已用步骤 3 中的公开密钥进行加密
6. 客户端继续发送 `Change Cipher Spec` 报文。该报文会提示服务器，在此报文之后的通信会采用 Pre-master secret 密钥加密
7. 客户端发送 `Finished` 报文。该报文包含连接至今全部报文的整体校验值。这次握手协商是否能够成功，要以服务器是否能够正确解密该报文作为判定标准
8. 服务器同样发送 `Change Cipher Spec` 报文
9. 服务器同样发送 `Finished` 报文
10. 服务器和客户端的 `Finished` 报文交换完毕之后，SSL 连接就算建立完成。通信受到 SSL 保护，从此开始进行应用层协议的通信，即发送 HTTP 请求
11. 应用层协议通信，发送 HTTP 响应
12. 由客户端断开连接。断开连接时发送 `close_notify` 报文。之后再发送 `TCP FIN` 报文来关闭与 TCP 的通信

在以上流程中，应用层发送数据时会附加一种叫做 MAC（Message Authentication Code）的报文摘要。MAC 能够查知报文是否遭到篡改，从而保护报文的完整性。

当使用 SSL 时，处理速度会变慢（比 HTTP 慢 2 到 100 倍）。分为通信慢和由于大量消耗 CPU 及内容等资源，导致处理速度变慢。

# 确认访问用户身份的认证

## BASIC 认证

是从 HTTP/1.0 就定义的认证方式。现在仍有一部分网站会使用这种认证方式。是 Web 服务器与通信客户端之间进行的认证方式。具体认证步骤如下。

1. 当请求的资源需要 BASIC 认证时，服务器会随状态码 `401 Authorization Required` 返回带 WWW-Authenticate 首部字段的响应。该字段包含认证的方法（BASIC）及 Request-URI 安全域字符串（realm）
2. 客户端为了通过 BASIC 认证，需要将用户 ID 及密码发送给服务器。发送的字符串内容由用户 ID 和密码中间以 `:` 连接构成，再经过 Base64 编码处理。处理得到的字符串写入首部字段 Authorization 后发送请求。当用户代理为浏览器时，用户仅需要输入用户 ID 和密码，由浏览器完成转换工作
3. 接收到包含 Authorization 请求的服务器，会对认证信息的正确性进行验证。如果通过则返回一条包含 Request-URI 资源的响应

Base64 并非加密处理，无需附加信息即可对其解码。使用 BASIC 认证的过程中被盗的可能性极高。一般浏览器无法实现认证注销操作，使 BASIC 认证使用上不够便捷灵活。因此它并不常用。

## DIGEST 认证

从 HTTP/1.1 起就有了 DIGEST 认证。DIGEST 认证同样使用质询/响应的方式（challenge/response），但不会像 BASIC 认证那样直接发送明码。

质询响应方式是指，一开始一方会先发送认证要求给另一方，接着使用从另一方那接收到的质询码计算生成响应码。最后将响应码返回给对方进行认证的方式。因为发送给对方的只是响应摘要及由质询码产生的计算结果，所以安全性更高。

DIGEST 认证的认证步骤如下。

1. 请求需要认证的资源时，服务器会随状态码 `401 Authorization Required` ，返回带 WWW-Authoricate 首部字段的响应。该字段内包含质问响应方式认证所需的临时质询码（随机数，nonce）。WWW-Authoricate 中必须包含 realm 和 nonce 两个字段信息。
2. 客户端接收到 401 状态码，返回的响应中包含 DIGEST 认证必须的首部字段 Authorization 信息。Authorization 内必须包含 `username` `realm` `nonce` `uri` 和 `response` 的字段信息。其中，`realm` 和 `nonce` 就是从之前服务器接收到的响应中的字段，`username` 是 `realm` 限定范围内可进行认证的用户名。`uri` 即 Request-URI 的值。`response` 也可叫做 Request-Digest，存放经过 MD5 运算后的密码字符串，形成响应码。
3. 接收到包含 Authorization 请求的服务器，会确认认证信息的正确性，认证通过后则返回包含 Request-URI 资源的响应，并在首部字段 Authentication-Info 写入一些认证成功相关的信息。

DIGEST 认证提供防止密码被窃听的保护机制，但不存在防止用户伪装的保护机制。与 BASIC 一样不够便捷灵活，使用受限。

## SSL 客户端认证

利用 SSL 客户端认证可以避免用户 ID 和密码被盗时被第三者冒充的情况发生。SSL 客户端认证是借由 HTTPS 的客户端证书完成认证的方式。为达到 SSL 客户端认证的目的，需要事先将客户端证书分发给客户端，且客户端必须安装此证书。SSL 客户端认证的步骤如下。

1. 接收到需要认证资源的请求，服务器会发送 `Certificate Request` 报文，要求客户端提供客户端证书。
2. 用户选择将发送的客户端证书后，客户端会把客户端证书信息以 `Client Certificate` 报文方式发送给服务器。
3. 服务器验证客户端证书验证通过后方可领取证书内客户端的公开密钥，然后开始 HTTPS 加密通信。

在多数情况下，SSL 客户端认证不会仅依靠证书完成认证，一般会和基于表单认证的组合形成一种双因素认证（Two-factor authentication）来使用。一个用于认证客户端计算机，一个用于认证用户本人行为。

使用 SSL 客户端认证需要用到客户端证书，而客户端证书需要支付一定费用，用于购买客户端证书，以及服务器运营者为保证自己搭建的认证机构安全运营所产生的费用。

## 基于表单的认证

### 认证多半为基于表单的认证

基于表单的认证方法并不是在 HTTP 协议中定义的。由于使用上的便利性及安全性问题，HTTP 协议标准提供的 BASIC 和 DIGEST 认证几乎不怎么使用。另外，SSL 客户端认证虽然有高度安全等级，但因为导入及维持费用等问题尚未普及。

比如 SSH 和 FTP 协议，服务器与客户端之间的认证是合乎标准规范的，并且满足了最基本的功能需求上的安全使用级别，因此这些协议的认证可以直接使用。但是对于 Web 网站的认证功能需要 Web 应用程序各自实现基于表单的认证方式。经过全面考虑过安全性能而实现的表单认证，会具有高度的安全等级，但表单认证的实现中存在问题的 Web 网站也屡见不鲜。

### Session 管理及 Cookie 应用

基于表单认证的标准规范尚未有定论，一般会使用 Cookie 来管理 Session（会话）。

基于表单认证本身是通过服务器端的 Web 应用，将客户端发送来的用户 ID 和密码进行认证，但鉴于 HTTP 是无状态协议，之前已认证成功的用户状态无法通过协议层面保存下来。于是使用 Cookie 来管理 Session，以弥补 HTTP 协议中的不存在的状态管理功能。步骤如下：

1. 客户端把用户 ID 和密码等登录信息放入报文的实体部分，通常是以 POST 方式吧请求发送给服务器。而这时，会使用 HTTPS 通信来进行 HTML 表单画面的显示和用户输入数据的发送

2. 服务器会发放用以识别用户的 Session ID。通过验证从客户端发来的登录信息进行身份验证，然后把用户的认证状态与 Session ID 绑定后记录在服务器端。向客户端返回响应时，会在首部字段 Set-Cookie 内写入 Session ID（如 PHPSESSID=028a8c…）

   当 Session ID 被第三方盗走，对方就可以伪装成你的身份进行恶意操作。因此 Session ID 应使用难以推测的字符串，且进行有效期管理。另外，为减轻跨站脚本攻击（XSS）造成的损失，建议事先在 Cookie 内加上 `HttpOnly` 属性

3. 客户端接收到从服务器端发来的 Session ID 后，会将其作为 Cookie 保存在本地，下次向服务器发送请求时，浏览器会自动发送 Cookie，所以 Session ID 也随之发送到服务器，可用于识别用户和其认证状态。

在服务器端应安全保存用户提交的密码等登录信息。通常，一种安全的保存方法时，先利用给密码加盐（salt）的方法增加额外信息，再使用散列（hash）函数计算出散列值后保存。