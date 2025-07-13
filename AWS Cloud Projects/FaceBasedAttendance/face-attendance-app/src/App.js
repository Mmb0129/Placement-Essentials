import './App.css';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [image, setImage] = useState(null);
  const [uploadResultMessage, setUploadResultMessage] = useState("Please Upload an image to authenticate.");
  const [imageName, setImageName] = useState("placeholder.jpg");
  const [isAuth, setAuth] = useState(false);

  async function sendImage(e) {
    e.preventDefault();
    const newImageName = uuidv4();
    setImageName(newImageName);

    try {
      await fetch(`https://hgvem518a9.execute-api.ap-south-1.amazonaws.com/dev/facebasedattendance-visitors/${newImageName}.jpeg`, {
        method: 'PUT',
        headers: {
          'Content-Type': "image/jpeg"
        },
        body: image
      });

      const response = await AuthenticatorResponse(newImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, Welcome to Work`);
      } else {
        setAuth(false);
        setUploadResultMessage("Auth failed, not our employee");
      }
    } catch (err) {
      setAuth(false);
      setUploadResultMessage("There is an error");
      console.error(err);
    }
  }

  async function AuthenticatorResponse(imageName) {
    const requestUrl = 'https://hgvem518a9.execute-api.ap-south-1.amazonaws.com/dev/employee?' +
      new URLSearchParams({ objectKey: `${imageName}.jpeg` });

    return fetch(requestUrl, {
      method: "GET",
      headers: {
        'Accept': "application/json",
        "Content-Type": "application/json"
      }
    }).then(response => response.json())
      .then((data)=>{
        return data;
      })
      .catch(error => {
        console.error(error);
        return { Message: "Error" };
      });
  }

  return (
    <div className="App">
      <h2>Face Based Attendance System</h2>

      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])} />
        <button type='submit'>Authenticate</button>
      </form>

      <div className={isAuth ? 'success' : 'failure'}>
        {uploadResultMessage}
      </div>
      <img src={`./visitors/${imageName}`} alt='visitor' />
      
      {console.log(`./visitors/${imageName}`)}

      {/* <img src={`https://facebasedattendance-visitors.s3.ap-south-1.amazonaws.com/${imageName}.jpeg`} alt='visitor' height={250} width={250} /> */}
    </div>
  );
}

export default App;
