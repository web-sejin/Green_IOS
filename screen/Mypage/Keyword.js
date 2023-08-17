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

const Keyword = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [keywords, setKeywords] = useState('');

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setKeywords('');
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

  function _submit(){
    if(keywords == ''){
      ToastMessage('키워드를 입력해 주세요.');
      return false;
    }
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'키워드 등록'} />			               
      <ScrollView>
        <View style={styles.registArea}>
          <View style={[styles.registBox]}>
            <View style={[styles.typingBox]}>
              <View style={styles.typingTitle}>
                <Text style={styles.typingTitleText}>키워드 (최대 10개 등록 가능)</Text>
              </View>
              <View style={[styles.typingInputBox]}>
                <TextInput
                  value={keywords}
                  onChangeText={(v) => {setKeywords(v)}}
                  placeholder={"키워드를 등록해 주세요."}
                  style={[styles.input]}
                  placeholderTextColor={"#8791A1"}
                />
              </View>
            </View>
            <TouchableOpacity 
              style={styles.certChkBtn2}
              activeOpacity={opacityVal}
              onPress={() => {_submit()}}
            >
              <Text style={styles.certChkBtnText2}>등록</Text>
            </TouchableOpacity>

            <View style={[styles.alertBox, styles.mgTop30]}>
              <AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
              <Text style={styles.alertBoxText}>관심 키워드 등록을 통해서 관련 상품이나 매칭이 등록되면 알림을 보내드립니다.</Text>
            </View>            
          </View>
        </View>
        <View style={styles.keywordList}>
          <View style={[styles.keywordLi, styles.keywordLiFst]}>
            <Text style={styles.keywordLiText}>1. 중고</Text>
            <TouchableOpacity>
              <AutoHeightImage width={21} source={require("../../assets/img/write_btn_off2.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.keywordLi}>
            <Text style={styles.keywordLiText}>2. 쌉니다</Text>
            <TouchableOpacity>
              <AutoHeightImage width={21} source={require("../../assets/img/write_btn_off2.png")} />
            </TouchableOpacity>
          </View>
          <View style={styles.keywordLi}>
            <Text style={styles.keywordLiText}>3. 마트</Text>
            <TouchableOpacity>
              <AutoHeightImage width={21} source={require("../../assets/img/write_btn_off2.png")} />
            </TouchableOpacity>
          </View>        
        </View>
        <View style={styles.notData}>
          <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
          <Text style={styles.notDataText}>등록된 입찰내역이 없습니다.</Text>
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
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	registArea: {},
	registBox: {padding:20},
  typingBox: {},
	typingTitle: {},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
  certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
  keywordList: {paddingHorizontal:20,paddingVertical:10,},
  keywordLi: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:13,paddingHorizontal:20,backgroundColor:'#F0F4F8',borderRadius:12,marginTop:10,},
  keywordLiFst: {marginTop:0,},
  keywordLiText: {width:(innerWidth-121),fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:18,color:'#222'},
  notData: {height:(widnowHeight-410),display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default Keyword