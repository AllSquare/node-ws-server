/*
** Made by Alexis Bertholom
** Email   alexis.bertholom.jd@gmail.com
**
** Started on Tue Jul 11 16:48:52 2017
*/

import * as url from 'url';
import * as express from 'express';
import * as WebSocket from 'ws';
import * as bodyparser from 'body-parser';
import {getUserByToken} from './db/connector';

interface WsStore
{
  [uid: number]: Set<WebSocket>;
};

const store: WsStore = {};

function broadcast(users: Array<number>, message: string)
{
  const promises: Array<Promise<any>> = [];
  const uniq = {};
  users.forEach(uid => {
    if (store[uid] && !uniq[uid])
      store[uid].forEach(ws => {
        promises.push(new Promise((resolve, reject) => {
          ws.send(message, (err) => (err ? reject(err) : resolve()));
        }));
      });
    uniq[uid] = true;
  });
  return Promise.all(promises).catch(console.error);
}

function requestHandler(req, res)
{
  const {users, message} = req.body;
  if (!users || !Array.isArray(users))
    return res.status(400).send("'users' parameter: expected userIds array");
  if (!message || typeof(message) !== 'string')
    return res.status(400).send("'message' parameter: expected string");
  broadcast(users, message);
  res.sendStatus(200);
}

function startHttpServer(port: number)
{
  return new Promise((resolve, reject) => {
    express().use(bodyparser.urlencoded()).use(bodyparser.json()).post('*', requestHandler).listen(port, (err) => (err ? reject(err) : resolve()));
  });
}

function verifyClient(info, callback)
{
  const {req} = info;
  const {query} = url.parse(req.url, true);
  let {auth_token} = req.headers;
  if (!auth_token && !(auth_token = query.auth_token))
    return callback(false, 400, 'Exepected query parameter or header: auth_token');
  getUserByToken(auth_token).then(user => {
    if (user)
    {
      req.uid = user.id;
      callback(true);
    }
    else
      callback(false, 401, 'Unauthorized');
  }).catch(err => callback(false, 500, 'Internal Server Error' + ': ' + err.toString()));
}

function onConnection(socket: WebSocket)
{
  const req = socket.upgradeReq;
  const uid = req['uid'];
  if (!store[uid])
    store[uid] = new Set;
  store[uid].add(socket);
  socket.on('close', () => {
    store[uid].delete(socket);
  });
}

async function startWsServer(port: number)
{
  const wss = new WebSocket.Server({ port, verifyClient });
  wss.on('connection', onConnection);
}

const {HTTP_PORT, WS_PORT} = process.env;

if (!HTTP_PORT)
  throw new Error('Expected env.HTTP_PORT')
if (!WS_PORT)
  throw new Error('Expected env.WS_PORT')

Promise.all([
  startHttpServer(Number.parseInt(HTTP_PORT)),
  startWsServer(Number.parseInt(WS_PORT)),
])
