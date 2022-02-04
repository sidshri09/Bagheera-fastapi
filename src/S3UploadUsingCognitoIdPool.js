import React, { useState } from "react";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import {
  S3Client,
  PutObjectCommand
} from "@aws-sdk/client-s3";
import FileUploader from "./FileUploader";

const S3_BUCKET = process.env.REACT_APP_BUCKET_NAME;
const REGION = process.env.REACT_APP_REGION;
// Go to the node_modules folder
// Search for the react-scripts folder
// Inside config folder, you will see webpack.config.js file.
// Under the resolve part in ine number 303, add this
// resolve: {
//   fallback: {
//     util: require.resolve("util/")
//   },
// // ...
// }

const myBucket = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID, // IDENTITY_POOL_ID
  }),
});

const S3UploadUsingCognitoIdPool = () => {
  const [uploaded, setUploaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const signupUrl = "http://localhost:8000/users";
  const signupProdUrl = "https://fastapi-bagheera.herokuapp.com/users";

  const updateProfilePic = async (key) => {
    const response = await fetch(signupProdUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ profile_pic: `https://bagheera-img.s3.amazonaws.com/${key}` }),
    });
    const data = await response.json();

    if (response.status === 200) {
      window.location.reload()
      
    }
    
  };


  

  const uploadFile = async (file) => {
    const key = localStorage.getItem("user_id")+"/"+file.name
    try {
      const params = {
        Body: file,
        Bucket: S3_BUCKET,
        Key: key,
      };
      const command = new PutObjectCommand(params);

      try {
        myBucket.send(command).then((data) => {
          console.log(data.$metadata.httpStatusCode);
          if (data.$metadata.httpStatusCode === 200) {
            setUploaded(true);
            updateProfilePic(key)
          }
        });
      } catch (err) {
        return alert("There was an error uploading your photo: ", err.message);
      }
    } catch (err) {
      if (!file.length) {
        return alert("Choose a file to upload first.");
      }
    }
  };

  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        padding: "10px",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          padding: "10px",
          justifyContent: "center",
        }}
      >
        <FileUploader uploadFile={uploadFile} />
      </div>
      <div>{uploaded ? <h3 style={{fontFamily:'cursive'}}>Upload Successfull</h3> : null}</div>
    </div>
  );
};

export default S3UploadUsingCognitoIdPool;
