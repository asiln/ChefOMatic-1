/*
import { SafeAreaView, StyleSheet, Text, View, Linking, Button, Image, Platform } from 'react-native'
import React, {useState,useEffect} from 'react';
import axios from "axios"
import env from '../../Env';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';


const TensorCamera= cameraWithTensors(Camera)

export default function RobotVision() {

  // let textureDims= Platform.OS =="ios"?{

  const apiEndpoint = `${env.url}/predict-video`
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [recording, setRecording] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
      console.log("Done")
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      cosole.log(status)
      setHasPermission(status === 'granted');

    })();
  }, []);
  
  
  const handleCameraReady = async () => {
    let startTime = Date.now();
    while (isMounted) {
      if ((Date.now() - startTime) > 2000) {
        startTime = Date.now();
        if (camera) {
          const data = await camera.takePictureAsync({ base64: true });
          sendFrameToBackend(data.base64);
          console.log(typeof(data.base64))
        }
      }
    }
  };

    
  const sendFrameToBackend = async (frame) => {
    const response = await axios.post(apiEndpoint, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "frame": frame })
    });

    const responseData = await response.json();
    console.log(responseData);
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={handleCameraReady}
        playSoundOnCapture={false}
        ref={(ref) => setCamera(ref)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%'
  }
});
*/



import { Dimensions, SafeAreaView, StyleSheet, Text, View, Linking, Button, Image, Platform } from 'react-native'
import React, {useState,useEffect} from 'react';
import axios from "axios"
import env from '../../Env';
import { Camera } from 'expo-camera';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as tf from '@tensorflow/tfjs'
import Canvas from 'react-native-canvas' 


const TensorCamera= cameraWithTensors(Camera)
const {width,height} = Dimensions.get('window')
export default function RobotVision(props) {

  

  let textureDims= Platform.OS =="ios"?{height:1920,width:1080}:{height:1200,width:1600}

  const apiEndpoint = `${env.url}/predict-video`
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [isMounted, setIsMounted] = useState(true);
  const [animationFrameId, setAnimationFrameId] = useState(null); 


  useEffect(() => {
    const cleanup = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    if (camera) {
      camera.stopAsync();
    }
  };
  console.log("start")
    return () => {
      setIsMounted(false);
      cleanup();
      console.log("Done")
    };
  }, [camera,animationFrameId]);

 
  useEffect(() => {
    const getPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      console.log("Camera Ready")
      await tf.ready()
      console.log("TF Ready")

    }
    getPermissions()
  }, []);
  


  const handleCameraStream = (images)=>{
    let animationFrameId = null;
    const loop= async()=>{
      

      const nextImageTensor = images.next().value
      var img = tf.browser.toPixels(nextImageTensor)

      // var response = await sendFrameToBackend(img)
      // plotBoxes(response)
      
      setAnimationFrameId(requestAnimationFrame(loop))
      
    };
      loop()
       return animationFrameId;
  }



    
  const sendFrameToBackend = async (frame) => {
    const response = await axios.post(apiEndpoint, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "frame": frame })
    });

    const responseData = await response.json();
    return responseData
  };

const plotBoxes = async(backendResponse)=>{

}


const handleCanvas = async (can)=>{
  can.width = width;
  can.height = height;
  const ctx= can.getContext('2d')
  ctx.strokeStyle="green"
  ctx.fillStyle="green"
  ctx.lineWidth = 2;
}


  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onReady={handleCameraStream}
        cameraTextureHeight={textureDims.height}
        cameraTextureWidth={textureDims.width}
        resizeHeight={200}
        resizeWidth={152}
        resizeDepth={3}
        autorender={true}
        playSoundOnCapture={false}
        useCustomShadersToResize={false}
        // ref={(ref) => setCamera(ref)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    width: '100%',
    height: '100%'
  }
});

