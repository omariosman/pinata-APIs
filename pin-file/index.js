const axios = require("axios");
const express = require("express");
const fs = require("fs");
const FormData = require("form-data");
const basePathConverter = require("base-path-converter");
const rfs = require("recursive-fs");
require("dotenv").config();

const JWT = process.env.JWT;
const PINATA_API = process.env.PINATA_API;



const app = express();

app.post("/upload", async (req, res) => {

    if (req.method !== "POST") {
        res.status(400).json({ error: "Invalid request method. Please use POST." });
        return;
    }
    
    try {
        let formData = new FormData();
        const filePath = "./files/car.jpg";
        const readStream = fs.createReadStream(filePath);
        formData.append("file", readStream);
        const response = await axios.post(PINATA_API, formData, {
        headers: {
            ...formData.getHeaders(),
            "Authorization": `Bearer ${JWT}`,
            },
        });
        const pinataResponse = response.data;
        const fileHash = pinataResponse.IpfsHash;
        res.status(200).send(`File uploaded to IPFS: ${fileHash}`);
    } catch(err) {
        res.status(500).send(`Error happened while uploading the file to IPFS: ${err}`);
    }
    
   /*
    try {
        const src = "./files";
        const { dirs, files } = await rfs.read(src);

        let data = new FormData();
    
        for (const file of files) {
          data.append(`file`, fs.createReadStream(file), {
            filepath: basePathConverter(src, file),
          });
        }
    
        const filesResponse = await axios.post(PINATA_API, data, {
        headers: {
                ...data.getHeaders(),
                "Authorization": `Bearer ${JWT}`,
            },
        });
        baseHash = filesResponse.data.IpfsHash;
        res.status(200).send(`Directory uploaded to IPFS successfully: ${baseHash}`);
      } catch (err) {
        res.status(500).send(`Error happened while uploading the file to IPFS: ${err}`);
      }
      */
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});