import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
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

const MatchOrder = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [mbId, setMbId] = useState();
  const [score, setScore] = useState(3);
  const [visible, setVisible] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setMbId();
        setScore(3);
        setVisible(false);
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

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'발주내역'} />
			<ScrollView>
        <View>
          <View style={[styles.matchCompleteMb, styles.matchCompleteMbFst, styles.borderBot]}>
            <View style={[styles.compBtn]}>
              <View style={[styles.compWrap, styles.compWrapFst]}>
                <View style={styles.compInfo}>                  
                  <View style={styles.compInfoName}>
                    <Text style={styles.compInfoNameText}>견적 요청 드립니다.</Text>
                  </View>
                  <View style={styles.compInfoDate}>
                    <Text style={styles.compInfoDateText}>김포시 고촌읍 · 3일전</Text>
                  </View>
                  <View style={styles.compInfoLoc}>
                    <Text style={styles.compInfoLocText}>NC가공-밀링-플라스틱-도면무</Text>
                  </View>
                </View>
                <View style={styles.compThumb}>
                  <AutoHeightImage width={70} source={require("../../assets/img/sample1.jpg")} />
                </View>
              </View>
              <View style={styles.matchPrice}>
                <Text style={styles.matchPriceText}>발주금액</Text>
                <Text style={styles.matchPriceText2}>10,000원</Text>
              </View>
            </View>
            <View style={styles.btnBox}>
              <TouchableOpacity
                style={[styles.btn, styles.btn2, styles.btn3]}
                activeOpacity={opacityVal}
                onPress={()=>{
                  setVisible(true);
                }}
              >
                <Text style={styles.btnText}>거래평가 작성</Text>
              </TouchableOpacity>
            </View>  
          </View>
          <View style={[styles.matchCompleteMb, styles.borderTop]}>
            <View style={[styles.compBtn]}>
              <View style={styles.compWrap}>
                <View style={styles.compInfo}>                  
                  <View style={styles.compInfoName}>
                    <Text style={styles.compInfoNameText}>견적 요청 드립니다.</Text>
                  </View>
                  <View style={styles.compInfoDate}>
                    <Text style={styles.compInfoDateText}>김포시 고촌읍 · 3일전</Text>
                  </View>
                  <View style={styles.compInfoLoc}>
                    <Text style={styles.compInfoLocText}>NC가공-밀링-플라스틱-도면무</Text>
                  </View>
                </View>
                <View style={styles.compThumb}>
                  <AutoHeightImage width={70} source={require("../../assets/img/sample1.jpg")} />
                </View>
              </View>
              <View style={styles.matchPrice}>
                <Text style={styles.matchPriceText}>발주금액</Text>
                <Text style={styles.matchPriceText2}>100,000원</Text>
              </View>
              <View style={styles.matchPrice}>
                <Text style={styles.matchPriceText}>거래평가점수</Text>
                <Text style={styles.matchPriceText2}>2점</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={visible}
				transparent={true}
				onRequestClose={() => {
          setScore(3);
          setVisible(false);
        }}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {
            setScore(3);
            setVisible(false);
          }}
				></Pressable>
				<View style={[styles.modalCont, styles.modalCont2]}>
					<View style={styles.avatarTitle}>
            <Text style={styles.avatarTitleText}>거래평가</Text>
          </View>
          <View style={styles.avatarDesc}>
            <Text style={styles.avatarDescText}>거래평가 할 회원에게 별점으로</Text>
            <Text style={styles.avatarDescText}>발주를 완료를 하여 주세요.</Text>
          </View>
          <View style={styles.starBox}>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(1)}}
            >
              {score > 0 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(2)}}
            >
              {score > 1 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(3)}}
            >
              {score > 2 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(4)}}
            >
              {score > 3 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.star}
              activeOpacity={opacityVal}
              onPress={()=>{setScore(5)}}
            >
              {score > 4 ? (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_on.png")} />  
              ) : (
              <AutoHeightImage width={32} source={require("../../assets/img/review_star_off.png")} />
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.avatarBtnBox}>
            <TouchableOpacity 
              style={styles.avatarBtn}
              onPress={() => {fnSubmit()}}
            >
              <Text style={styles.avatarBtnText}>평가 하지 않고 완료</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.avatarBtn, styles.avatarBtn2]}
              onPress={() => {fnSubmit()}}
            >
              <Text style={styles.avatarBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
				</View>
      </Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
  borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
  mgTop30: {marginTop:30,},
  mgTop35: {marginTop:35,},
  salesAlert: {padding:20,paddingTop:25,},
  alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
  nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},
  matchCompleteMb: {paddingVertical:30},
  matchCompleteMbFst: {paddingTop:20,},
  compBtn: {paddingHorizontal:20},
  compWrap: {display:'flex',flexDirection:'row',justifyContent:'space-between',position:'relative',paddingBottom:10,},
  compRadio: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#C5C5C6',borderRadius:50,position:'absolute',top:30,left:0,display:'flex',alignItems:'center',justifyContent:'center'},
  comRadioChk: {backgroundColor:'#31B481',borderColor:'#31B481',},
  compInfo: {width:(innerWidth-70)},
  compInfoDate: {marginVertical:5,},
  compInfoDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:21,color:'#7E93A8'},
  compInfoName: {},
  compInfoNameText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:25,color:'#353636'},
  compInfoLoc: {display:'flex',flexDirection:'row',alignItems:'center',},
  compInfoLocText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:15,color:'#000',},
  compThumb: {width:70,height:70,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},
  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-140)},	
  modalCont2: {top:((widnowHeight/2)-166)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919'},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  starBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'center',marginTop:20},
  star: {marginHorizontal:4,},
  matchPrice: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',backgroundColor:'#F3FAF8',borderRadius:12,paddingVertical:10,paddingHorizontal:15,marginTop:10,},
  matchPriceText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:20,color:'#353636'} ,
  matchPriceText2: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:20,color:'#31B481'},
  btnBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'space-between',paddingHorizontal:20,marginTop:10,},
  btn: {width:((innerWidth/2)-5),height:58,backgroundColor:'#353636',borderRadius:12,display:'flex',alignItems:"center",justifyContent:'center'},
  btn2: {backgroundColor:'#31B481',},
  btn3: {width:innerWidth},
  btnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:20,color:'#fff'},
  modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,padding:20,paddingBottom:30,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-140)},	
  modalCont2: {top:((widnowHeight/2)-166)},
  avatarTitle: {paddingBottom:15,borderBottomWidth:1,borderColor:'#CCCCCC'},
	avatarTitleText: {textAlign:'center',fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:18,color:'#191919'},
  avatarDesc: {marginTop:20,},
  avatarDescText: {textAlign:'center',fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:22,color:'#191919'},
	avatarBtnBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',marginTop:30,},
	avatarBtn: {width:((widnowWidth/2)-45),height:58,backgroundColor:'#C5C5C6',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	avatarBtn2: {backgroundColor:'#31B481'},
	avatarBtnText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:58,color:'#fff'},
  starBox: {display:'flex',flexDirection:'row',alignItems:"center",justifyContent:'center',marginTop:20},
  star: {marginHorizontal:4,},
})

export default MatchOrder