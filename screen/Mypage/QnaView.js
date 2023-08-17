import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const QnaView = ({navigation, route}) => {
  const contState = route.params.state;

	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				//setAll(false);
			}
		}else{
			//console.log("isFocused");
			if(route.params){
				//console.log("route on!!");
			}else{
				//console.log("route off!!");
			}
			setRouteLoad(true);
			setPageSt(!pageSt);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const sampleText = '시스템 점검 안내입니다.\n\n내용글입니다.';

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'1:1문의'} />
			<ScrollView>
        <View style={styles.boView}>
          <View style={styles.boViewTit}>
            {contState == 1 ? (
						<Text style={styles.noticeState1}>[답변대기]</Text>
						) : null}

						{contState == 2 ? (
						<Text style={styles.noticeState2}>[답변완료]</Text>
						) : null}
            <Text style={styles.boViewTitText}>문의합니다.</Text>
          </View>
          <View style={styles.boViewDesc}>
            <Text style={styles.boViewDescText}>2023.04.25</Text>
          </View>
          <View style={styles.boViewCont}>
            <Text style={styles.boViewContText}>{sampleText}</Text>
          </View>

          {contState == 2 ? (
						<View style={[styles.boViewCont, styles.boViewCont2]}>
              <View style={styles.boViewCont2Box}>
                <Text style={styles.boViewCont2BoxText}>[관리자 답변]</Text>
                <Text style={styles.boViewCont2BoxText2}>2023.04.25</Text>
              </View>
              <Text style={styles.boViewContText}>답변 드립니다.</Text>
            </View>
					) : null}

          <TouchableOpacity 
            style={styles.boBackBtn}
            activeOpacity={opacityVal}
            onPress={()=>{
              navigation.navigate('QnaModify');
            }}
          >
            <Text style={styles.boBackBtnText}>수정하기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.boBackBtn, styles.boBackBtn2]}
            activeOpacity={opacityVal}
            onPress={()=>{
              navigation.navigate('QnaList');
            }}
          >
            <Text style={[styles.boBackBtnText, styles.boBackBtn2Text]}>목록으로</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E3E3E4'},
	indicator: {height:widnowHeight-185, display:'flex', alignItems:'center', justifyContent:'center'},
  indicator2: {marginTop:62},
  boView: {padding:20,paddingBottom:20,},
  boViewTit: {display:'flex',flexDirection:'row',alignItems:'center'},
  noticeState1: {width:87,fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:23,color:'#ED5F5F',},
	noticeState2: {width:87,fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:23,color:'#31B481'},
  boViewTitText: {width:(innerWidth-87),fontFamily:Font.NotoSansBold,fontSize:18,lineHeight:23,color:'#191919',},
  boViewDesc: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:15,},
  boViewDescText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:22,color:'#191919'},
  boViewCont: {padding:20,paddingBottom:30,backgroundColor:'#fdfdfd',borderTopWidth:2,borderTopColor:'#191919',borderBottomWidth:1,borderBottomColor:'#ECECEC',marginTop:20,},
  boViewCont2: {borderTopWidth:1,marginTop:0,paddingTop:30,},
  boViewCont2Box: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10,},
  boViewCont2BoxText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:23,color:'#000'},
  boViewCont2BoxText2: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:23,color:'#191919'},
  boViewContText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:23,color:'#000'},
  boBackBtn: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex', alignItems:'center', justifyContent:'center',marginTop:35,},  
  boBackBtnText:{fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:22,color:'#fff'},
  boBackBtn2: {backgroundColor:'#fff',borderWidth:1,borderColor:'#000',marginTop:10,},
  boBackBtn2Text:{color:'#000'},
})

export default QnaView