/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import qs from 'qs-native';
import  {Mailer} from 'react-native-mail';
 
import {CameraRoll} from "@react-native-camera-roll/camera-roll";
import  { Component, useEffect, useState} from "react";
import RNFetchBlob from "rn-fetch-blob";
//import RNFS from 'reacvt-native-fs';
import type {PropsWithChildren} from 'react';
import {
  Button,
  Image,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Keyboard,
   Platform,
    KeyboardAvoidingView, 
    TouchableWithoutFeedback,
    ImageBackground,
    ImageBackgroundComponent,
    TextInputChangeEventData,
    NativeSyntheticEvent,
    PermissionsAndroid,
    BackHandler
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
type SectionProps = PropsWithChildren<{
  title: string;
  
}>;

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): JSX.Element {

  const [posts, setPosts] = useState<any>();
  const [image, setImage] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [strSendEmail, setSendEmail] = useState<string>();
  const [generate_path, setGeneratePath] = useState<string>();
  const [generate_image, setGenerateImage] = useState<string>();
  

  const downloadGallery = async function() {
    let imageurl = message? message: "";
    let indexName1: number = imageurl? imageurl.lastIndexOf('/') : 0;
    let indexName2: number = imageurl? imageurl.lastIndexOf('?') : 0;
    let imageName = imageurl?.substring(indexName1,indexName2);
    imageName = imageName.replace('.jpeg', '.png');
    let dirs = RNFetchBlob.fs.dirs;
    let path = Platform.OS == 'ios' ? dirs['MainBundleDir'] + imageName : dirs.PictureDir + imageName;
    console.log(path);
    
    var base64code = image?.split("data:png;base64,")[1] ? image?.split("data:png;base64,")[1] : "";
    console.log("base64code:");
    //console.log(base64code);

    await RNFetchBlob.fs.writeFile(path, base64code, 'base64');
    console.log("Success Download:" );
    setGeneratePath(path);
    setGenerateImage(imageName);
    // if(Platform.OS == 'android'){
    //   RNFetchBlob.config({
    //     fileCache: true,
    //     appendExt: 'jpeg',
    //     indicator: true,
    //     IOSBackgroundTask: true,
    //     path: path,
    //     addAndroidDownloads : {
    //       useDownloadManager : true,
    //       notification: true,
    //       path: path,
    //       description: 'Image'
    //     }
    //   }).fetch("GET", imageurl).then(res => {
    //     console.log(res, 'Complete Download');
    //     setGeneratePath(path);
    //     setGenerateImage(imageName);
    //   });
    // } 
    // else {
    //    CameraRoll.saveToCameraRoll(imageurl);
    // }
  }

  const sendEmail = async function() {
    try{
      // let permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
      // await PermissionsAndroid.request(permission);
      // Promise.resolve();

      // const dirs = RNFetchBlob.fs.dirs;
      // let externalPath = dirs.DCIMDir + generate_image;
      // console.log(generate_path);
      // console.log(externalPath);
      // await RNFetchBlob.fs.cp(generate_path!!, externalPath).then((result)=>{
      //   console.log("File has been saved to: " + result);
      // }).catch(error => console.log("cp error", error));
      Mailer.mail({
        subject: 'Edit Picture',
        recipients:['natya099@gmail.com'],
        ccRecipients:['natya099@gmail.com'],
        bccRecipients:['natya099@gmail.com'],
        body:'Hello',
        isHTML: false,
        attachments:[{
          path:generate_path!!,
          type:'png'
        }]
      }, (error, event) => {
        Alert.alert(error, event);
      });
    }catch(error){
      Promise.reject(error);
    }    
    // let fromAddress : string = 'natya099@gmail.com';
    // let toAdress = strSendEmail;
    // let url = `mailto:${toAdress}`;
    // const query = qs.stringify({
    //   subject:fromAddress,
    //   body: "Send Picture Generate",
    //   attachment:qs.stringify( {        
    //     path : generate_path ? generate_path : "",
    //     type : 'jpeg',
    //     name : generate_image ? generate_image : "",
        
    //   })
    // });
    
    // url += `?${query}`;
    // const canOpen = await Linking.canOpenURL(url);

    // if(!canOpen){
    //   throw new Error(url);
    // }
    // await Linking.openURL(url);
    // // .then(()=> {
    // //   console.log("Send email successfullly");
    // // })

  }
  const fetchData = async function () {
    RNFetchBlob.fetch("POST",'https://v1.api.amethyste.moe/generate/sharpen', 
   {
    "Accept": 'application/json',
    'content-type': 'application/json',
    'Authorization': "Bearer a04af71fdc0bcfe01e5d9d33484931689a2385c2934ed15819981850cc0820388e756d77959e5a46981d3d05403cd85b3d6f8efa5b6ef1269d17959782417ae1"
    
  },

  JSON.stringify({
 url: `${message}`
  })).then((response) => {
  let base64Str = response.data;
  var imageBase64 = 'data:'+'png'+';base64,'+base64Str;
  setImage(imageBase64)
  // Return base64 image
})

  }

  const fetchFilter = async function () {
    RNFetchBlob.fetch("POST",'https://v1.api.amethyste.moe/generate/missionpassed', 
    {
     "Accept": 'application/json',
     'content-type': 'application/json',
     'Authorization': "Bearer a04af71fdc0bcfe01e5d9d33484931689a2385c2934ed15819981850cc0820388e756d77959e5a46981d3d05403cd85b3d6f8efa5b6ef1269d17959782417ae1"
     
   },
 
   JSON.stringify({
  url: `${message}`
   })).then((response) => {
   let base64Str = response.data;
   var imageBase64 = 'data:'+'png'+';base64,'+base64Str;
   setImage(imageBase64)
 })
  }

  const fetchFilter1 = async function () {
    RNFetchBlob.fetch("POST",'https://v1.api.amethyste.moe/generate/gay', 
    {
     "Accept": 'application/json',
     'content-type': 'application/json',
     'Authorization': "Bearer a04af71fdc0bcfe01e5d9d33484931689a2385c2934ed15819981850cc0820388e756d77959e5a46981d3d05403cd85b3d6f8efa5b6ef1269d17959782417ae1"
     
   },
 
   JSON.stringify({
  url: `${message}`
   })).then((response) => {
   let base64Str = response.data;
   var imageBase64 = 'data:'+'png'+';base64,'+base64Str;
   setImage(imageBase64)
 })
  }
  
  const fetchFilter2 = async function () {
    RNFetchBlob.fetch("POST",'https://v1.api.amethyste.moe/generate/fire', 
    {
     "Accept": 'application/json',
     'content-type': 'application/json',
     'Authorization': "Bearer a04af71fdc0bcfe01e5d9d33484931689a2385c2934ed15819981850cc0820388e756d77959e5a46981d3d05403cd85b3d6f8efa5b6ef1269d17959782417ae1"
     
   },
 
   JSON.stringify({
  url: `${message}`
   })).then((response) => {
   let base64Str = response.data;
   var imageBase64 = 'data:'+'png'+';base64,'+base64Str;
   setImage(imageBase64)
 })
  }
 
  const fetchFilter3 = async function () {
    RNFetchBlob.fetch("POST",'https://v1.api.amethyste.moe/generate/wasted', 
    {
     "Accept": 'application/json',
     'content-type': 'application/json',
     'Authorization': "Bearer a04af71fdc0bcfe01e5d9d33484931689a2385c2934ed15819981850cc0820388e756d77959e5a46981d3d05403cd85b3d6f8efa5b6ef1269d17959782417ae1"
     
   },
 
   JSON.stringify({
  url: `${message}`
   })).then((response) => {
   let base64Str = response.data;
   var imageBase64 = 'data:'+'png'+';base64,'+base64Str;
   setImage(imageBase64)
 })
  }

  const fetchFilter4 = async function () {
    RNFetchBlob.fetch("POST",'https://v1.api.amethyste.moe/generate/posterize', 
    {
     "Accept": 'application/json',
     'content-type': 'application/json',
     'Authorization': "Bearer a04af71fdc0bcfe01e5d9d33484931689a2385c2934ed15819981850cc0820388e756d77959e5a46981d3d05403cd85b3d6f8efa5b6ef1269d17959782417ae1"
     
   },
 
   JSON.stringify({
  url: `${message}`
   })).then((response) => {
   let base64Str = response.data;
   var imageBase64 = 'data:'+'png'+';base64,'+base64Str;
   setImage(imageBase64)
 })
  }
//obrazek bude zmenen po kliknuti na btn generate

  return (

    <ScrollView>
    <View style={{flex: 1, backgroundColor:'black'}}>
      <View style={{flex: 1, marginTop:10, backgroundColor: 'black', flexDirection:"row", alignContent:'flex-start', justifyContent:'flex-start'}} /> 
      <Text style={{color:'blue', fontSize:17, backgroundColor: 'black', flexDirection:"row", alignContent:'flex-start', justifyContent:'flex-start', marginLeft:15}} onPress={() => BackHandler.exitApp()}>{'\t'}Back</Text>     
   
      <View style={{flex: 2, marginTop:80, backgroundColor: 'black', flexDirection:"row", alignContent:'center', justifyContent:'center'}} /> 
      <Text style={[styles.sectionTitle,
      {color:'blueviolet', backgroundColor: 'black', flexDirection:"row", alignContent:'center', justifyContent:'center', marginLeft: 40, marginBottom:50, marginTop:-15},]
      }>{'\t'}Discord pic generator</Text>     

   <View style={{flex:3, backgroundColor: 'black', flexDirection:"row", alignContent:"flex-start"}} > 
   <TouchableOpacity
   style={{width:110, height:44, marginLeft:20}}><Button color={'darkorchid'} onPress={() => fetchData()}  title='Generate'></Button></TouchableOpacity>
   <TextInput 
  
          placeholder="enter image url"
          placeholderTextColor={"white"}
          keyboardAppearance="default"
          style={styles.placeholder}
          id='imgurl'
         value={message}
         onChangeText={(string) => setMessage(string)}
        ></TextInput>

        
</View>



<View style={{ marginBottom:20, backgroundColor: 'black', flexDirection:"row", alignContent:"flex-start",}} >
  <Text style={{fontSize:15, color:'mediumslateblue', backgroundColor: 'black', flexDirection:"row", alignContent:"flex-start", justifyContent:'flex-start', marginLeft:19, marginBottom:20, marginTop:20}}>Choose effect:</Text>
  <TouchableOpacity style={{width:40, height:40, marginLeft:13,marginTop:15,}}><Button color={'slateblue'} onPress={() => fetchFilter3()} title='1'></Button></TouchableOpacity>
  <TouchableOpacity style={{width:40, height:40, marginLeft:15, marginTop:15}}><Button color={'slateblue'} onPress={() => fetchFilter()} title='2'></Button></TouchableOpacity>
  <TouchableOpacity style={{width:40, height:40, marginLeft:15, marginTop:15}}><Button color={'slateblue'} onPress={() => fetchFilter1()} title='3'></Button></TouchableOpacity>
  <TouchableOpacity style={{width:40, height:40, marginLeft:15, marginTop:15}}><Button color={'slateblue'} onPress={() => fetchFilter2()} title='4'></Button></TouchableOpacity>
  <TouchableOpacity style={{width:40, height:40, marginLeft:15, marginTop:15}}><Button color={'slateblue'} onPress={() => fetchFilter4()} title='5'></Button></TouchableOpacity>


</View>

<ImageBackground source={require('./img/stitch.jpg')} style={styles.bgimage}>
<Image
           source={{uri: image ?? "" }}
           resizeMode="contain"
           style={styles.image}
           id='stitch'
         ></Image>
</ImageBackground>

         
<View style={{flex:4, backgroundColor: 'black', flexDirection:"row", alignContent:"flex-start", marginTop:40}} > 
   <TouchableOpacity style={{width:77, height:44, marginLeft:20}}><Button onPress={()=>sendEmail()} color={'mediumslateblue'} title='Send'></Button></TouchableOpacity>
   <TextInput
          placeholder="enter email"
          placeholderTextColor={"white"}
          keyboardAppearance="default"
          value={strSendEmail}
         onChangeText={(string) => setSendEmail(string)}
          style={styles.placeholder}
        ></TextInput>
</View>


<View style={{flex:5, backgroundColor: 'black', flexDirection:"row", alignContent:"center", justifyContent:"center"}} > 
   <TouchableOpacity style={{width:110, height:44, marginRight:20, marginTop:30}}><Button color={'slateblue'} onPress={()=>downloadGallery()} title='Download'></Button></TouchableOpacity>
   
</View>



     </View>

<View style={{width:'100%', height:80, backgroundColor:'black'}}>
<Text style={{fontSize:15, color:'white'}}>{message}</Text>
</View>

     </ScrollView>

    
  );
};


const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    backgroundColor:'black',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: '600',
    backgroundColor:'black'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  placeholder: {
    color: "white",
    height: 40,
    width: 214,
    backgroundColor: "rgba(14,14,14,1)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,1)",
    justifyContent:'center',
    marginLeft:30
  },
  image: {
    width: 270,
    height: 270,
    alignContent:'center',
    justifyContent:'center',
    alignSelf:'center'
  },
  bgimage: {
    width: 240,
    height: 240,
    alignContent:'center',
    justifyContent:'center',
    alignSelf:'center'
  },
 
});

export default App;
