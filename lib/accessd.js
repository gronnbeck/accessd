import express from 'express';
import Etcd from 'node-etcd';
import Promise from 'promise';

const PORT = 8000;
const ETCD_HOST = null;

const app = express();

const etcd = new Etcd(ETCD_HOST);

const getUserGroups = (userId) => {
  return new Promise((resolve, reject) => {
    const handler = (error, data) => {
      if (error) reject(error)
      else resolve(data.node.nodes)
    }

    etcd.get(`users/${userId}/groups`, handler)
  });
}

const getUsersOfGroup = (groupId) => new Promise(
  (resolve, reject) => {
    const handler = (error, data) => {
      if (error) reject(error)
      else resolve(data.node.nodes)
    }

    etcd.get(`groups/${groupId}/users`, handler)
  });



const registerUserToGroup = (userId, groupId) => {
  return new Promise((resolve, reject) => {
    console.log(`Regisetering user ${userId} to group ${groupId}`);
    etcd.set(`users/${userId}/groups/${groupId}`, true);
    etcd.set(`groups/${groupId}/users/${userId}`, true);
    resolve();
  });
}

app.get('/v0/users/:userId', (req, res) => {
  const userId = req.params.userId;
  getUserGroups(userId).then(
    (user) => res.send(user),
    (error) => res.status(500).send({ error: error }));
});

app.get('/v0/groups/:groupId', (req, res) => {
  const groupId = req.params.groupId;
  getUsersOfGroup(groupId).then(
    (group) => res.send(group),
    (error) => res.status(500).send({ error: error }));
});

app.post('/v0/groups/:groupId/users/:userId', (req, res) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;
  registerUserToGroup(userId, groupId).then(
    () => res.send({success: true}),
    (error) => res.status(500).send({message: 'Unhandeled error', error: error}));
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
