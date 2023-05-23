const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
});

const storageRef = admin.storage().bucket('gs://web3---patreon.appspot.com');

function uploadFile(tokenId, startDate) {
  const fileRef = storageRef.file(`metadata/${tokenId}.json`);

  const data = {
    attributes: [
      {
        trait_type: 'expiry',
        value: Number(startDate) + 2592000000,
      },
    ],
    description: 'Full access to exclusive content',
    image:
      'https://firebasestorage.googleapis.com/v0/b/web3---patreon.appspot.com/o/images%2FAccessPass.png?alt=media&token=da669b83-396e-413a-9505-93e5978b9dab',
  };
  const dataString = JSON.stringify(data);

  const stream = fileRef.createWriteStream();
  stream.write(dataString);
  stream.end();

  stream.on('error', (error) => {
    console.error('Error updating patreon metadata', error);
  });
  stream.on('finish', () => {
    console.log('Finished updating patreon metadata');
  });
}

app.get('/extraMonth', async (req, res) => {
  const { query } = req;
  let startDate = Date.now();

  console.log(startDate);

  if (query.expiry) {
    startDate = query.expiry;
  }
  uploadFile(query.id, startDate);

  return res.status(200).json({});
});

app.listen(port, () => {
  console.log(`Listening for API calls`);
});
