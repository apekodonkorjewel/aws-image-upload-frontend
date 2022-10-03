import {useDropzone} from 'react-dropzone';
import logo from './logo.svg';
import React, {useState, useEffect, useCallback} from 'react';
import './App.css';
import axios from 'axios';

const UserProfiles = () => {
  const [UserProfiles, setUserProfiles] = useState([]);
  const fetchUserProfiles = () => {
    axios.get("http://localhost:8080/api/v1/user-profile").then(res => {
      console.log(res);
      const data = res.data;
      setUserProfiles(res.data);
    });
  }

  useEffect(() => {
    fetchUserProfiles();
  }, []);

  return UserProfiles.map((userProfile, index) => {
    return(
      <div key={index}>
        {userProfile.userProfileID ? (
        <img
            src ={`http://localhost:8080/api/v1/user-profile/${userProfile.userProfileID}/image/download`} 
            />
        ) : null }
        {/* to do: profile image */}
        <br/> <br/>
        <h1>{userProfile.username}</h1>
        <p>{userProfile.userProfileID}</p>
        <Dropzone {...userProfile} />
        <br/>
      </div>
    )
  });
}


function Dropzone({userProfileID}) {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    console.log(file);

    const formData = new FormData();
    formData.append("file", file);

    axios.post(`http://localhost:8080/api/v1/user-profile/${userProfileID}/image/upload`,
      formData,{
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    ).then(() => {
      console.log("File uploaded successfully")
    }).catch(err => {
      console.log(err);
    });
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the image here ...</p> :
          <p>Drag 'n' drop a profile image, or click to select a profile image</p>
      }
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <UserProfiles/>
    </div>
  );
}

export default App;
