# epp-registrobr
Modulo para integração epp registrobr.

##Sample
```
var Epp = require('registrobr-epp');
var fs = require('fs');
var connection;

connection = new Epp({
  login: "<login>",
  password: "<password>"
});

connection.hello().then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});
```

##Configs
```
{
  "ssl": <ssl>,
  "key": "<key>",
  "cert": "<cert>",
  "ca": ["<ca>"],
  "port": <port>,
  "host": "<host>",
  "login": "<login>",
  "password": "<password>"
}
```

##Methods
```
connection.hello(...);
connection.login(...);
connection.logout(...);
connection.contact_create(...);
connection.contact_info(...);
connection.contact_update(...);
connection.org_create(...);
connection.org_update(...);
connection.org_check(...);
connection.org_info(...);
connection.domain_check(...);
connection.domain_info(...);
connection.domain_create(...);
connection.domain_update(...);
connection.domain_renew(...);
connection.domain_delete(...);
connection.poll_request(...);
connection.poll_delete(...);
```
