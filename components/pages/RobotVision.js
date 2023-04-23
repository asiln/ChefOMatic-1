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
      <TTensorCamera
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
