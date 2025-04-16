
import { useEffect, useRef, useState } from 'react'

function CameraVideo() {
  const videoDiv = useRef()
  
  const verCamara = () => {
    navigator.mediaDevices
      .getUserMedia({
      video:{width:1920,height:1080}
      })
      .then(stream => {
        let miVideo = videoDiv.current;
        miVideo.srcObject = stream;
        miVideo.play()
      }).catch(err => {
        console.log(err)
    })
  }  

  useEffect(() => {
    verCamara();
  },[videoDiv])

  return (
    <>
      <video ref={videoDiv}></video>      
    </>
  )
}

export default CameraVideo
