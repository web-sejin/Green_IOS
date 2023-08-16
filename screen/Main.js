import React, {useState, useEffect, useRef} from 'react';
import {
  Alert,
  BackHandler,
  Button,
  Dimensions,
  FlatList,
  LogBox,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,  
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { CALL_PERMISSIONS_NOTI, usePermissions } from '../hooks/usePermissions'; 

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AutoHeightImage from "react-native-auto-height-image";
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';

import Font from '../assets/common/Font';
import Home from './Home'; //메인-중고상품 리스트
import Login from './member/Login'; //로그인
import Register from './member/Register'; //약관
import Register2 from './member/Register2'; //회원가입
import Findid from './member/Findid'; //아이디 찾기
import Findpw from './member/Findpw'; //비밀번호 찾기
import Match from './Match/Match';
import Chat from './Chat/Chat';
import Mypage from './Mypage/Mypage';
import Search from './Search'; //검색 리스트
import UsedWrite1 from './usedArticle/Write1'; //스크랩 글쓰기
import UsedWrite2 from './usedArticle/Write2'; //중고자재 글쓰기
import UsedWrite3 from './usedArticle/Write3'; //중고기계/장비 글쓰기
import UsedWrite4 from './usedArticle/Write4'; //폐기물 글쓰기
import UsedView from './usedArticle/View'; //상세페이지
import Bid from './usedArticle/Bid'; //입찰하기
import SalesComplete from './usedArticle/SalesComplete'; //판매완료업체선정
import UsedChat from './usedArticle/UsedChat'; //중고상품 채팅목록
import MatchWrite from './Match/MatchWrite'; //매칭 글쓰기
import MatchView from './Match/View'; //매칭 상세페이지
import DownUsed from './Match/DownUsed'; //매칭 도면다운로드 허용
import Estimate from './Match/Estimate'; //매칭 예상 견적서 등록
import MatchCompelte from './Match/MatchComplete'; //매칭 업체선정
import EstimateResult from './Match/EstimateResult'; //매칭 예상 견적서 보기
import MachChat from './Match/MachChat'; //매칭 채팅목록
import ChatRoom from './Chat/Room'; //채팅방
import UsedSaleList from './Mypage/UsedSaleList'; //마이페이지 판매내역
import UsedBuyList from './Mypage/UsedBuyList'; //마이페이지 구매내역
import UsedBidList from './Mypage/UsedBidList'; //마이페이지 입찰내역

LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabBarMenu = (props) => {
  const {state, navigation, optionsNum} = props;
  const screenName = state.routes[state.index].name;  

  return (
    <View style={styles.TabBarMainContainer}>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        onPress={() => {
          navigation.navigate('TabNavigator', {
            screen: 'Home',
          });
        }}
      >
        {screenName == 'Home' ? (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon1_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>홈</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon1_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>홈</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.TabBarBtn} 
        onPress={() => {
          navigation.navigate('TabNavigator', {
            screen: 'Match',
          });
        }}
      >
        {screenName == 'Match' ? (
          <>
          <AutoHeightImage width={27} source={require("../assets/img/tab_icon2_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>매칭</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={27} source={require("../assets/img/tab_icon2_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>매칭</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        onPress={() => {
          navigation.navigate('TabNavigator', {
            screen: 'Chat',
          });
        }}
      >
        {screenName == 'Chat' ? (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon3_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>채팅</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={20} source={require("../assets/img/tab_icon3_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>채팅</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.TabBarBtn} 
        onPress={() => {
          navigation.navigate('TabNavigator', {
            screen: 'Mypage',
          });
        }}
      >
        {screenName == 'Mypage' ? (
          <>
          <AutoHeightImage width={18} source={require("../assets/img/tab_icon4_on.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText, styles.tabViewTextOn]}>마이페이지</Text>
          </View>
          </>
        ) : (
          <>
          <AutoHeightImage width={18} source={require("../assets/img/tab_icon4_off.png")} style={styles.selectArr} />
          <View style={styles.tabView}>
            <Text style={[styles.tabViewText]}>마이페이지</Text>
          </View>
          </>
        )}
      </TouchableOpacity>
    </View>
  )
}

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator 
      initialRouteName="Home"
      screenOptions={{headerShown: false}}
      tabBar={ (props) => <TabBarMenu {...props} /> }
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{}}
      />
      <Tab.Screen
        name="Match"
        component={Match}
        options={{}}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{}}
      />
      <Tab.Screen
        name="Mypage"
        component={Mypage}
        options={{}}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown:false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Register2" component={Register2} />
      <Stack.Screen name="Findid" component={Findid} />
      <Stack.Screen name="Findpw" component={Findpw} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="UsedWrite1" component={UsedWrite1} />
      <Stack.Screen name="UsedWrite2" component={UsedWrite2} />
      <Stack.Screen name="UsedWrite3" component={UsedWrite3} />
      <Stack.Screen name="UsedWrite4" component={UsedWrite4} />
      <Stack.Screen name="UsedView" component={UsedView} />
      <Stack.Screen name="Bid" component={Bid} />
      <Stack.Screen name="SalesComplete" component={SalesComplete} />      
      <Stack.Screen name="UsedChat" component={UsedChat} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="MatchWrite" component={MatchWrite} />
      <Stack.Screen name="MatchView" component={MatchView} />
      <Stack.Screen name="MachChat" component={MachChat} />
      <Stack.Screen name="DownUsed" component={DownUsed} />
      <Stack.Screen name="Estimate" component={Estimate} />
      <Stack.Screen name="MatchCompelte" component={MatchCompelte} />
      <Stack.Screen name="EstimateResult" component={EstimateResult} />
      <Stack.Screen name="UsedSaleList" component={UsedSaleList} />
      <Stack.Screen name="UsedBuyList" component={UsedBuyList} />
      <Stack.Screen name="UsedBidList" component={UsedBidList} />      
      
    </Stack.Navigator>
  )
}

const Main = () => {  
  usePermissions(CALL_PERMISSIONS_NOTI);

  const toastConfig = {
		custom_type: (internalState) => (
			<View
				style={{
					backgroundColor: '#000000e0',
					borderRadius: 10,
					paddingVertical: 10,
					paddingHorizontal: 20,
					opacity: 0.8,
				}}
			>
				<Text
					style={{
						textAlign: 'center',
						color: '#FFFFFF',
						fontSize: 15,
						lineHeight: 22,
						fontFamily: Font.NotoSansCJKkrRegular,
						letterSpacing: -0.38,
					}}
				>
					{internalState.text1}
				</Text>
			</View>
		),
	};
  
  // useEffect(() => { 
  //   setTimeout(function(){SplashScreen.hide();}, 1500); 
  // }, []);

  return (
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <StackNavigator />
        <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  TabBarMainContainer: {
    position:'absolute',
    bottom:0,
    zIndex:1,
    width:'100%',
    height:80,
    backgroundColor:'#fff',
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 15.0,
    elevation: 10,
  },
  TabBarBtn: {width:'25%',height:80,display:'flex',justifyContent:'center',alignItems:'center'},
  TabBarBtnText: {},
  TabBarBtnText2: {color:'#EC5663'},
  tabView: {marginTop:8},
  tabViewText: {fontFamily:Font.NotoSansRegular,fontSize:12,lineHeight:14,color:'#C5C5C6'},
  tabViewTextOn: {fontFamily:Font.NotoSansBold,color:'#353636'},
});

export default Main;
