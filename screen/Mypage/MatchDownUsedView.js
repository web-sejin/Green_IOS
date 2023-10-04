import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Api from '../../Api';
import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

const MatchDownUsedView = ({navigation, route}) => {
  const usedState = route.state;
  let pageTitle = '도면권한 요청내역';

  const idx = route.params.idx;
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  
  const [itemInfo, setItemInfo] = useState({});
  const [totalCnt, setTotalCnt] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [nowPage, setNowPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [allChk, setAllChk] = useState(false); //모두 선택

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
        setVisible(false);
        setVisible2(false);
        setIsLoading(false);
			}
		}else{   
			setRouteLoad(true);
			setPageSt(!pageSt);
      setNowPage(1);
      getData();
      setAllChk(false);
		}

		return () => isSubscribed = false;
	}, [isFocused]);

  const getData = async () => {
    setIsLoading(false);
    await Api.send('GET', 'list_request_dwg', {'is_api': 1, mc_idx: idx, page: 1}, (args)=>{
			let resultItem = args.resultItem;
			let responseJson = args.responseJson;
			let arrItems = args.arrItems;
			//console.log('args ', args);
			if(responseJson.result === 'success' && responseJson){
				console.log("list_request_dwg : ",responseJson);
        setItemInfo(responseJson);
				setItemList(responseJson.data);
        setTotalPage(responseJson.total_page);
        setTotalCnt(responseJson.total_count);
			}else{
				setItemList([]);
        setNowPage(1);
				console.log('결과 출력 실패!', responseJson.result_text);
        //ToastMessage(responseJson.result_text);
			}
		}); 
    setIsLoading(true);
  }
  const moreData = async () => {    
    if(totalPage > nowPage){
      await Api.send('GET', 'list_request_dwg', {is_api: 1, mc_idx: idx, page:nowPage+1}, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
        let arrItems = args.arrItems;
        //console.log('args ', args);
        if(responseJson.result === 'success' && responseJson){
          //console.log('list_chat more : ',responseJson.data);				
          const addItem = itemList.concat(responseJson.data);				
          setItemList(addItem);			
          setNowPage(nowPage+1);
        }else{
          console.log(responseJson.result_text);
          //console.log('결과 출력 실패!');
        }
      });
    }
  }
  const getList = ({item, index}) => (    
    <TouchableOpacity
      style={styles.memberBoxBtn}
      activeOpacity={opacityVal}
      onPress={() => {handleChange(item.dp_idx)}}
    >
      <View style={[styles.memberBoxBtnWrap, index==0?styles.memberBoxNotLine:null,]}>
        <View style={[styles.chkShape, styles.chkShapeAbs, item.is_checked==1 ? styles.chkShapeOn : null]}>
          <AutoHeightImage width={13} source={require("../../assets/img/icon_chk_on.png")} />
        </View>
        <View style={styles.memberInfo}>
          <View style={styles.memberDate}>
            <Text style={styles.memberDateText}>{item.dp_regdate}</Text>
          </View>
          <View style={styles.memberNick}>
            <Text style={styles.memberNickText}>{item.mb_nick}</Text>
          </View>
          <View style={styles.memberLoc}>
            <AutoHeightImage width={9} source={require("../../assets/img/icon_local3.png")} />
            <Text style={styles.memberLocText}>{item.mb_loc}</Text>
          </View>
        </View>
        <View style={styles.memberThumb}>
          {item.mb_img ? (
            <AutoHeightImage width={79} source={{uri: item.mb_img}} />
          ) : (
            <AutoHeightImage width={79} source={require("../../assets/img/not_profile.png")} />
          )}          
        </View>
      </View>
    </TouchableOpacity>
	);

  useEffect(() => {
		//console.log('allChk : ', allChk);
    let chkVal = 0;
    if(allChk){
      chkVal = 1;
    }else{
      chkVal = 0;
    }
		let selectCon = itemList.map((item) => {
			if(item.is_checked === chkVal){
				return {...item, is_checked: chkVal};
			}else{
				return {...item, is_checked: item.is_checked};
			}
		});

		setItemList(selectCon);
	}, [allChk]);

  //개별 선택
  const handleChange = (idx) => {  
    let temp = itemList.map((item) => {
			if(idx === item.dp_idx){
				//console.log('idx : ', idx, ' con idx : ', item.dp_idx);
        //console.log(item.is_checked);
        if(item.is_checked == 0){
          return { ...item, is_checked:1 };
        }else{
          return { ...item, is_checked:0 };
        }				
			}

			return item;
		}); 
    //console.log("temp : ",temp);   
		setItemList(temp);

    let selectedTotal = temp.filter((item) => item.is_checked);
		//console.log('temp.length : ', temp.length, 'totalSelected : ', selectedTotal.length);
		if(temp.length === selectedTotal.length){
			setAllChk(true);
		}else{			
			setAllChk(false);
		}
	};

  //전체 선택, 전체 선택 해제
	const changeAllChecked = (checked) => {
		let allCheckStatus = checked;
    let allCheckStatus2 = 0;
		//console.log('checked : ', checked);
		if(checked === true){
      allCheckStatus = false;
			allCheckStatus2 = 0;
		}else{
      allCheckStatus = true;
			allCheckStatus2 = 1;
		}
		let selectCon = itemList.map((item) => {
			return {...item, is_checked: allCheckStatus2};
		});

		setItemList(selectCon);
		setAllChk(allCheckStatus);
	}

  //선택된 회원 권한 허용
  const checkedPermit = async () => {
    let permitList = '';
    itemList.map((item, index) => {
      if(item.is_checked == 1){
        if(permitList != ''){ permitList += ","; }        
        permitList += item.dp_idx;
      }
    })

    if(permitList == ''){
      ToastMessage('허용할 회원을 1명 이상 선택해 주세요.');
    }else{
      const formData = {
        is_api:1,
        mc_idx:idx,
        permit:permitList
      };
  
      Api.send('POST', 'ok_permit_dwg', formData, (args)=>{
        let resultItem = args.resultItem;
        let responseJson = args.responseJson;
  
        if(responseJson.result === 'success'){
          console.log('성공 : ',responseJson);
          setNowPage(1);
          setTotalPage(1);
          getData();
          setAllChk(false);
          ToastMessage('선택한 회원의 다운로드 권한을 허용했습니다.');
        }else{
          console.log('결과 출력 실패!', responseJson);
          //ToastMessage(responseJson.result_text);
        }
      });
    }
  }

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={pageTitle} />
      <View style={[styles.listLi, usedState != 1 ? styles.listLi2 : null]}>
        <>
        {itemInfo.mc_image ? (
        <View style={styles.pdImage}>
          <AutoHeightImage width={131} source={{uri:itemInfo.mc_image}} style={styles.listImg} />
        </View>
        ) : null}
        <View style={styles.listInfoBox}>
          <View style={styles.listInfoTitle}>
            <Text style={styles.listInfoTitleText}>{itemInfo.mc_name}</Text>
          </View>
          <View style={styles.listInfoDesc}>
            <Text style={styles.listInfoDescText}>{itemInfo.mc_date}</Text>
          </View>
          <View style={styles.listInfoCate}>
            <Text style={styles.listInfoCateText}>{itemInfo.mc_summary}</Text>
          </View>
          <View style={styles.listInfoCnt}>
            <View style={styles.listInfoCntBox}>
              <AutoHeightImage width={15} source={require("../../assets/img/icon_star.png")}/>
              <Text style={styles.listInfoCntBoxText}>{itemInfo.mb_score}</Text>
            </View>
            <View style={styles.listInfoCntBox}>
              <AutoHeightImage width={14} source={require("../../assets/img/icon_review.png")}/>
              <Text style={styles.listInfoCntBoxText}>{itemInfo.mc_chat_cnt}</Text>
            </View>
            <View style={[styles.listInfoCntBox, styles.listInfoCntBox2]}>
              <AutoHeightImage width={16} source={require("../../assets/img/icon_heart.png")}/>
              <Text style={styles.listInfoCntBoxText}>{itemInfo.mc_like_cnt}</Text>
            </View>
          </View>
        </View>
        </>
      </View>

      <View style={styles.allChkBox}>
        <TouchableOpacity
          style={styles.allChkBtn}
          activeOpacity={opacityVal}
          onPress={() => changeAllChecked(allChk)}
        >
          <View style={[styles.chkShape, allChk ? styles.chkShapeOn : null]}>
            <AutoHeightImage width={13} source={require("../../assets/img/icon_chk_on.png")} />
          </View>
          <View style={styles.chkTextBox}>
            <Text style={styles.chkText}>전체</Text>
            <Text style={[styles.chkText, styles.chkTextBold]}>{totalCnt}개</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitBtn}
          activeOpacity={opacityVal}
          onPress={()=>{checkedPermit()}}
        >
          <Text style={styles.submitBtnText}>선택 허용</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={itemList}
        renderItem={(getList)}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0.6}
        onEndReached={moreData}
        disableVirtualization={false}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.notData}>
              <AutoHeightImage width={74} source={require("../../assets/img/not_data.png")} />
              <Text style={styles.notDataText}>권한 요청한 회원이 없습니다.</Text>
            </View>
          ):(
            <View style={[styles.indicator]}>
              <ActivityIndicator size="large" />
            </View>
          )
        }
      />
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},  
  listLi: {display:'flex',flexDirection:'row',flexWrap:'wrap',padding:20,paddingBottom:0,},
  listLi2: {paddingBottom:20,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  pdImage: {width:99,height:99,borderRadius:12,overflow:'hidden',alignItems:'center',justifyContent:'center'},
	listImg: {borderRadius:12},
	listInfoBox: {width:(innerWidth - 99),paddingLeft:15,},
	listInfoTitle: {},
	listInfoTitleText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:22,color:'#000'},
	listInfoDesc: {marginTop:5},
	listInfoDescText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#888'},
	listInfoCate: {marginTop:5},
	listInfoCateText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:19,color:'#353636'},
	listInfoCnt: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:10,},
	listInfoCntBox: {display:'flex',flexDirection:'row',alignItems:'center',marginRight:15,},
	listInfoCntBox2: {marginRight:0},
	listInfoCntBoxText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:17,color:'#000',marginLeft:4,},
	listInfoPriceBox: {marginTop:10},
	listInfoPriceArea: {display:'flex',flexDirection:'row',alignItems:'center'},
	listInfoPriceState: {display:'flex',alignItems:'center',justifyContent:'center',width:54,height:24,borderRadius:12,marginRight:8,},
	listInfoPriceState1: {backgroundColor:'#31B481'},
	listInfoPriceState2: {backgroundColor:'#F58C40'},
	listInfoPriceStateText: {fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:15,color:'#fff'},
	listInfoPrice: {},
	listInfoPriceText: {fontFamily:Font.NotoSansBold,fontSize:15,lineHeight:24,color:'#000'},
  listInfoState: {display:'flex',flexDirection:'row',marginTop:8,},
  listInfoStateText: {display:'flex',alignItems:'center',justifyContent:'center',height:24,paddingHorizontal:10,backgroundColor:'#797979',
  borderRadius:12,fontFamily:Font.NotoSansMedium,fontSize:12,lineHeight:29,color:'#fff',},
  listInfoStateText2: {backgroundColor:'#31B481'}, 
  allChkBox: {height:62,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#E9EEF6'},
  allChkBtn: {display:'flex',flexDirection:'row',alignItems:'center',},
  chkShape: {width:21,height:21,backgroundColor:'#fff',borderWidth:1,borderColor:'#ccc',borderRadius:50,display:'flex',alignItems:'center',justifyContent:'center'},
  chkShapeAbs: {position:'absolute',left:0,top:37,},
  chkShapeOn: {backgroundColor:'#31B481',borderColor:'#31B481'},
  chkTextBox: {display:'flex',flexDirection:'row',alignItems:'center',marginLeft:10,},
  chkText: {fontFamily:Font.NotoSansMedium,fontSize:14,lineHeight:19,color:'#000'},
  chkTextBold: {fontFamily:Font.NotoSansBold,marginLeft:2,},
  submitBtn: {width:70,height:40,alignItems:'flex-end',justifyContent:'center',},
  submitBtnText: {fontFamily:Font.NotoSansBold,fontSize:14,lineHeight:19,color:'#000'},
  memberList: {paddingHorizontal:20,},
  memberBoxBtn: {paddingHorizontal:20,},
  memberBoxBtnWrap: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',position:'relative',paddingVertical:30,paddingLeft:31,borderTopWidth:1,borderColor:'#E9EEF6',},
  memberBoxNotLine: {borderTopWidth:0},
  memberBoxComplete: {paddingLeft:0,},
  memberInfo: {width:(innerWidth-139)},
  memberDate: {},
  memberDateText: {fontFamily:Font.NotoSansRegular,fontSize:13,lineHeight:19,color:'#7E93A8'},
  memberNick: {marginTop:8,},
  memberNickText: {fontFamily:Font.NotoSansBold,fontSize:17,lineHeight:21,color:'#353636'},
  memberLoc: {display:'flex',flexDirection:'row',alignItems:'center',marginTop:6,},
  memberLocText: {fontFamily:Font.NotoSansMedium,fontSize:13,lineHeight:21,color:'#000',marginLeft:5,},
  memberThumb: {width:79,height:79,borderRadius:50,overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center'},
  indicator: {width:widnowWidth,height:widnowHeight-280,backgroundColor:'rgba(255,255,255,0.5)',display:'flex', alignItems:'center', justifyContent:'center'},
  notData: {height:widnowHeight-300,display:'flex',alignItems:'center',justifyContent:'center',},
	notDataText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:16,color:'#353636',marginTop:17,},
})

export default MatchDownUsedView