import './App.css';
import React, {useState, useEffect} from 'react';
import AgoraRTC from "agora-rtc-sdk-ng"

function App() {

  const [engine, setEngine] = useState(null);
  const [notification, setNotification] = useState('');
  const [error, setError] = useState('');

  let channelParameters =
  {
    // A variable to hold a local audio track.
    localAudioTrack: null,
    // A variable to hold a remote audio track.
    remoteAudioTrack: null,
    // A variable to hold the remote user id.
    remoteUid: null,
  };

  
//   appid
// : 
// "9c7635d3d5f2451b9a9845fc32d13175"
// channel
// : 
// "channel-d"
// token
// : 
// "007eJxTYOBextdy6nZLbG5smfS/az+m1rNt6CmVtei/2MPsc8XimI8Cg2WyuZmxaYpximmakYmpYZJloqWFiWlasrFRiqGxobmpxLzvyQ2BjAyZ+nOYGRkgEMTnZEjOSMzLS83RTWFgAADEuiBI"
// uid
// : 
// "12"


  const handleJoin = async () => {
    
    //Get form data
    let form = document.querySelector("form");
    let data = new FormData(form)
    const formData = {};
    for (var pair of data.entries()) {
      formData[pair[0]] = pair[1]
    }

    // Join a channel.
    try {
      await engine.join(formData.appId, formData.channel, formData.token, formData.uid);
      setNotification('Joined channel' + formData.channel + 'with UID' + formData.uid);
    } catch (error) {
      setError(error);
    }

    // Create a local audio track from the microphone audio.
    channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    
    // Publish the local audio track in the channel.
    await engine.publish(channelParameters.localAudioTrack);
    
    setNotification(notification + ' Published audio to channel');
    console.log("Publish success!");
  };

  const handleLeave = async () => {
    // Destroy the local audio track.
    channelParameters.localAudioTrack.close();
    // Leave the channel
    await engine.leave();
    console.log("You left the channel");
    // Refresh the page for reuse
    window.location.reload();
  }

  useEffect(() => {
    // Create an instance of the Agora Engine
    const agoraEngine = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});
    setEngine(agoraEngine);
    // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
    agoraEngine.on("user-published", async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event.
      await agoraEngine.subscribe(user, mediaType);
      console.log("subscribe success");

      // Subscribe and play the remote audio track.
      if (mediaType === "audio") {
        channelParameters.remoteUid = user.uid;
        // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
        channelParameters.remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. 
        channelParameters.remoteAudioTrack.play();
        setNotification("Remote user connected: " + user.uid);
      }

      // Listen for the "user-unpublished" event.
      agoraEngine.on("user-unpublished", user => {
        console.log(user.uid + "has left the channel");
        setNotification("Remote user has left the channel");
      });
    });
  }, []);

  return (
    <>
      <script type="module" src="/main.js"></script>
      <h2 style={{textAlign: 'center', fontSize: '2rem'}}>Get started with Voice Calling</h2>
      <div class="row">
        <div>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleJoin(e.target);
          }}
            style={{display: 'flex', flexDirection: 'column', width: '25rem', margin: '0 auto'}}
          >
            <label for='appId'>App Id</label>
            <input name='appId' style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem'}} required/>
            <label for='token'>Token</label>
            <input name='token' style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem'}} required/>
            <label for='channel'>Channel</label>
            <input name='channel' style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem'}} required/>
            <label for='uid'>UID</label>
            <input name='uid' style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem'}} required/>
            <div style={{display: 'flex', gap: '1rem'}}>
              <input type='submit' value="Join" style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: 'none', background: '#0da5dc', flex:'1', borderRadius:'0.25em', color:'#fff', cursor:'pointer'}} />
              <button type="button" id="leave" onClick={handleLeave}  style={{marginBottom: '1rem', padding: '0.5rem', fontSize: '1.25rem', border: 'none', background: '#dd4d4d', flex:'1', borderRadius:'0.25em', color:'#fff', cursor:'pointer'}}>Leave</button>
            </div>
          </form>

        </div>
      </div>
      <br />
      {notification && <div style={{color:'green', textAlign:'center'}}>{notification}</div>}
      {error && <div style={{color:'red', textAlign:'center'}}>{error}</div>}
    </>
  );
}

export default App;
