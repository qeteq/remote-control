import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

const rootDir = path.resolve(__dirname, '..', '..', 'front');

export const createServer = () =>
  http.createServer(function (req, res) {
    const filePath = path.join(
      rootDir,
      req.url === '/' ? 'index.html' : req.url!
    );

    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });
