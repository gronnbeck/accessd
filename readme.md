# accessd

A simple distributed access control management API.

## Disclaimer
This is just a side project. Testing different ideas and concepts. Wanted
to try to create something simpler and more scaleable than LDAP.

## API

Get user info

```http
GET /v0/users/:userId
```

Get group info

```http
GET /v0/groups/:groupId
```

Register user to a group

```http
POST /v0/groups/:groupId/users/:userId
```

## Known Issues

 * Registering user to a group has the possibility of entering a state
 where either a user belongs to a group and the group does not contain a user
 or vica-versa. This can be solved using a write-log for detecting
 inconsistency, and include either a manual step or an automatic job for
 fixing it.


## Dependencies
  * etcd
