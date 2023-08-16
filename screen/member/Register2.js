import React, {useState, useEffect, useCallback} from 'react';
import {Alert, Button, Dimensions, View, Text, TextInput, TouchableOpacity, Modal, Image, Pressable, StyleSheet, ScrollView, ToastAndroid, Keyboard, KeyboardAvoidingView, FlatList,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutoHeightImage from "react-native-auto-height-image";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import Geolocation from 'react-native-geolocation-service';
import Postcode from '@actbase/react-daum-postcode';
import Toast from 'react-native-toast-message'

import Font from "../../assets/common/Font";
import ToastMessage from "../../components/ToastMessage";
import Header from '../../components/Header';
import {Avatar} from '../../components/Avatar';

const widnowWidth = Dimensions.get('window').width;
const innerWidth = widnowWidth - 40;
const widnowHeight = Dimensions.get('window').height;
const opacityVal = 0.8;

let t1;
let tcounter;
let temp;

const Register2 = ({navigation, route}) => {
	const [routeLoad, setRouteLoad] = useState(false);
	const [pageSt, setPageSt] = useState(false);

	const [modal1, setModal1] = useState(false); //비밀번호 설정
	const [modal2, setModal2] = useState(false); //공장 및 인증 정보 설정
	const [modal3, setModal3] = useState(false); //내 공장1 정보 등록
	const [modal4, setModal4] = useState(false); //카메라,갤러리 선택
	const [modal5, setModal5] = useState(false); //내 공장1 선택,등록,수정,삭제
	const [modal6, setModal6] = useState(false); //내 공장2 정보 등록
	const [modal7, setModal7] = useState(false); //내 공장2 선택,등록,수정,삭제
	const [toastModal, setToastModal] = useState(false);
	const [toastText, setToastText] = useState('');

	const [mbHp, setMbHp] = useState('');
	const [certNumber, setCertNumber] = useState('');
	const [mbEmail, setMbEmail] = useState('');
	const [mbNickname, setMbNickname] = useState('');
	const [pw, setPw] = useState('');
	const [pw2, setPw2] = useState('');
	const [mbcompanyNumber, setMbCompanyNumber] = useState('');
	const [mbcompanyName, setMbCompanyName] = useState('');
	const [mbName, setMbName] = useState('');
	const [mbCompanyAddr, setMbCompanyAddr] = useState('');
	const [picture, setPickture] = useState('');
	const [state, setState] = useState(false);
	const [timeStamp, setTimeStamp] = useState('');
	const [phoneIntervel, setPhoneInterval] = useState(false);
	const [factName1, setFactName1] = useState('');
	const [factCode1, setFactCode1] = useState('');
	const [factAddr1, setFactAddr1] = useState('');
	const [factAddrDt1, setFactAddrDt1] = useState('');
	const [factName2, setFactName2] = useState('');
	const [factCode2, setFactCode2] = useState('');
	const [factAddr2, setFactAddr2] = useState('');
	const [factAddrDt2, setFactAddrDt2] = useState('');
	const [location, setLocation] = useState('');
	const [postcodeOn, setPostcodeOn] = useState(false);
	const [postcodeOn2, setPostcodeOn2] = useState(false);
	const [factActive, setFactActive] = useState();
	const [my1, setMy1] = useState(false);
	const [my2, setMy2] = useState(false);

	const isFocused = useIsFocused();
	useEffect(() => {
		let isSubscribed = true;

		if(!isFocused){
			if(!pageSt){
				setModal1(false);
				setModal2(false);
				setModal3(false);
				setModal4(false);
				setModal5(false);
				setModal6(false);
				setModal7(false);				
				setToastModal(false);
				setToastText('');
				setMbHp('');
				setCertNumber('');
				setMbEmail('');
				setMbNickname('');
				setPw('');
				setPw2('');
				setMbCompanyNumber('');
				setMbCompanyName('');
				setMbName('');
				setMbCompanyAddr('');
				setPickture();
				setState(false);
				setTimeStamp('');
				setPhoneInterval(false);
				setLocation('');
				setPostcodeOn(false);
				setFactName1('');
				setFactCode1('');
				setFactAddr1('');
				setFactAddrDt1('');
				setFactName2('');
				setFactCode2('');
				setFactAddr2('');
				setFactAddrDt2('');
				setFactActive();
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

	const timer_start = () => {
		tcounter = 180;
		t1 = setInterval(Timer, 1000);
		//console.log(t1);
	};

	const Timer = () => {
		//setPhoneInterval(false);
		tcounter = tcounter - 1;
		// temp = Math.floor(tcounter / 60);
		// temp = temp + (tcounter % 60);

		temp = Math.floor(tcounter/60);
		if(Math.floor(tcounter/60) < 10)  temp = '0'+temp;
		temp = temp + ":";
		if((tcounter % 60) < 10)temp = temp + '0';
		temp = temp + (tcounter % 60);

		//console.log(temp);
		setTimeStamp(temp);
		//setIntervals(true); //실행중


		if (tcounter <= 0) {
				//timer_stop();
				setPhoneInterval(false);
		}
	};

	const _sendSmsButton = () => {
		// console.log('sms');
		if(mbHp == "" || mbHp.length!=11){
			ToastMessage('휴대폰번호를 정확히 입력해 주세요.');
			return false;
		}

		// timer_start();
		if(phoneIntervel){
			ToastMessage(tcounter + '초 후에 재발송할 수 있습니다.');
			return false;
		}

		//setSmsRandNumber(randomNumber(6));
		setPhoneInterval(true);
	}

	const _authComplete = () => {
		if(tcounter <= 0){
			ToastMessage('인증시간이 만료되었습니다.\n인증번호를 재발송 받아주세요.');
			return false;
		 }
		 timer_stop();
		//  if(smsRandNumber == ransoo){
		// 	setAuthTitle('인증확인');
		// 	setPhoneInterval(false);
		// 	setAuthButtonState(true);//인증버튼 비활성화
		// 	ToastMessage('본인인증이 완료되었습니다.\n다음단계로 이동하세요.');
		// 	setNextButtonState(false);
		// 	return true;
		//  }else{
		// 	setAuthTitle('인증완료');
		// 	setAuthButtonState(false); //인증버튼 비활성화
		// 	ToastMessage('인증번호가 일치하지 않습니다.');
		// 	setNextButtonState(true);
		// 	return false;
		//  }
	}

	const timer_stop = () => {
		clearInterval(t1);
		setTimeStamp('');
		setPhoneInterval(false);
	};

	useEffect(()=>{
		if(!phoneIntervel){
			timer_stop();
		}else{
			timer_start();
		}
	},[phoneIntervel]);

	const onAvatarChange = (image: ImageOrVideo) => {
    console.log(image);
		setModal4(false);
		setPickture(image.path);
    // upload image to server here 
  };

	function nextStep(){
		setModal1(true);
	}

	function nextStep2(){
		setModal2(true);
	}

	function findMyPosition(v){
		Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      },
      error => {
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
	}

	function chkFactoryInfo(v){
		if(v == "1"){
			if(factName1 == ''){
				setToastText('공장명을 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factCode1 == ''){
				setToastText('우편번호를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddr1 == ''){
				setToastText('주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddrDt1 == ''){
				setToastText('상세주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}			

			if(!factActive){
				setFactActive('1');
			}

			setPostcodeOn(false)
			setModal3(false)
			setModal5(false)
			setMy1(true)

		}else if(v == "2"){			
			if(factName2 == ''){
				setToastText('공장명을 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factCode2 == ''){
				setToastText('우편번호를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddr2 == ''){
				setToastText('주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			if(factAddrDt2 == ''){
				setToastText('상세주소를 입력해 주세요.');
				setToastModal(true);
				setTimeout(()=>{ setToastModal(false) },1000);
				return false;
			}

			setPostcodeOn2(false)
			setModal6(false)
			setModal7(false)
			setMy2(true)
		}

		setModal3(false);
	}

	function submitRegist(){

	}

	return (
		<SafeAreaView style={styles.safeAreaView}>
			<Header navigation={navigation} headertitle={'휴대폰, 이메일 설정'} />
			<KeyboardAwareScrollView>
				<View style={styles.registArea}>
					<View style={[styles.registBox, styles.borderBot]}>
						<View style={styles.alertBox}>
							<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
							<Text style={styles.alertBoxText}>등록된 휴대폰 번호로 거래를 하실 수 있습니다.</Text>
						</View>

						<View style={[styles.typingBox, styles.mgTop30]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>휴대폰 번호</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={mbHp}
									keyboardType = 'numeric'
									onChangeText={(v) => {setMbHp(v)}}
									placeholder={"휴대폰번호를 입력해 주세요."}
									style={[styles.input, styles.input2]}
									placeholderTextColor={"#8791A1"}
									maxLength={11}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={() => {_sendSmsButton()}}
								>
									<Text style={styles.certChkBtnText}>인증번호</Text>
								</TouchableOpacity>
							</View>
							<View style={[styles.typingInputBox]}>
								<TextInput
									value={certNumber}
									keyboardType = 'numeric'
									onChangeText={(v) => {setCertNumber(v)}}
									placeholder={"인증번호 입력"}
									style={[styles.input]}
									placeholderTextColor={"#8791A1"}
									maxLength={11}
								/>
								<View style={styles.timeBox}>
									<Text style={styles.timeBoxText}>
										{timeStamp}
									</Text>
								</View>
								<TouchableOpacity 
									style={styles.certChkBtn2}
									activeOpacity={opacityVal}
									onPress={() => {_authComplete()}}
								>
									<Text style={styles.certChkBtnText2}>인증번호 확인</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>

					<View style={[styles.registBox, styles.borderTop, styles.paddBot13]}>
						<View style={[styles.typingBox]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>이메일</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									keyboardType='email-address'
									value={mbEmail}
									onChangeText={(v) => {setMbEmail(v)}}
									placeholder={'이메일을 입력해 주세요.'}
									placeholderTextColor="#C5C5C6"
									style={[styles.input, styles.input2]}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={() => {}}
								>
									<Text style={styles.certChkBtnText}>중복확인</Text>
								</TouchableOpacity>
							</View>
						</View>

						<View style={[styles.typingBox, styles.mgTop35]}>
							<View style={styles.typingTitle}>
								<Text style={styles.typingTitleText}>닉네임</Text>
							</View>
							<View style={[styles.typingInputBox, styles.typingFlexBox]}>
								<TextInput
									value={mbNickname}									
									onChangeText={(v) => {setMbNickname(v)}}
									placeholder={"닉네임을 입력해 주세요."}
									style={[styles.input, styles.input2]}
									placeholderTextColor={"#8791A1"}
								/>
								<TouchableOpacity 
									style={styles.certChkBtn}
									activeOpacity={opacityVal}
									onPress={() => {}}
								>
									<Text style={styles.certChkBtnText}>중복확인</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</KeyboardAwareScrollView>
			<View style={styles.nextFix}>
				<TouchableOpacity 
					style={styles.nextBtn}
					activeOpacity={opacityVal}
					onPress={() => nextStep()}
				>
					<Text style={styles.nextBtnText}>다음</Text>
				</TouchableOpacity>
			</View>

			<Modal
				visible={modal1}
				animationType={"slide"}
				onRequestClose={() => {setModal1(false)}}
			>
				<View style={styles.header}>
					<>
					<TouchableOpacity 
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => (setModal1(false))}
					>
						<AutoHeightImage width={9} source={require("../../assets/img/icon_header_back.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>비밀번호 설정</Text>
					</>
				</View>
				<KeyboardAwareScrollView>
					<View style={styles.registArea}>
						<View style={[styles.registBox]}>
							<View style={styles.alertBox}>
								<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
								<Text style={styles.alertBoxText}>비밀번호는 일반 로그인에 사용됩니다.</Text>
								<Text style={[styles.alertBoxText, styles.alertBoxText2]}>6자 이상 영문, 숫자, 특수문자만 가능합니다.</Text>
							</View>

							<View style={[styles.typingBox, styles.mgTop30]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>비밀번호</Text>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										secureTextEntry={true}
										value={pw}
										onChangeText={(v) => {setPw(v)}}
										placeholder={'비밀번호 입력(6자 이상 영문, 숫자, 특수문자)'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										secureTextEntry={true}
										value={pw2}
										onChangeText={(v) => {setPw2(v)}}
										placeholder={'비밀번호 재입력'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>
						</View>
					</View>
				</KeyboardAwareScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => nextStep2()}
					>
						<Text style={styles.nextBtnText}>다음</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
				visible={modal2}
				animationType={"slide"}
				onRequestClose={() => {setModal2(false)}}
			>
				<View style={styles.header}>
					<>
					<TouchableOpacity
					 onPress={() => (setModal2(false))} 
					 activeOpacity={opacityVal}
					 style={styles.headerBackBtn}
					>
						<AutoHeightImage width={9} source={require("../../assets/img/icon_header_back.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>공장 및 인증 정보 설정</Text>
					</>
				</View>
				<KeyboardAwareScrollView>
					<View style={styles.registArea}>
						<View style={[styles.registBox]}>
							<View style={styles.alertBox}>
								<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
								<Text style={styles.alertBoxText}>내 공장은 최대 2개 등록 가능합니다.</Text>
								<Text style={[styles.alertBoxText, styles.alertBoxText2]}>최소 1개 등록 해야 하며, 가입 후 변경 가능합니다.</Text>
							</View>

							<View style={[styles.typingBox, styles.mgTop30]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>선택된 공장</Text>
								</View>

								{my1 ? (
								<TouchableOpacity 
									style={[styles.typingInputBox, styles.typingFactory, factActive=='1' ? styles.typingFactoryOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{setModal5(true)}}
								>
									<Text style={[styles.myFactoryText, styles.myFactoryText2, factActive=='1' ? styles.myFactoryTextOn : null]}>
										{factName1}
									</Text>
									<AutoHeightImage width={3} source={require("../../assets/img/icon_dot.png")} style={styles.myFactoryArr} />
								</TouchableOpacity>
								) : (
								<TouchableOpacity 
									style={[styles.typingInputBox, styles.typingFactory]}
									activeOpacity={opacityVal}
									onPress={()=>{setModal3(true)}}
								>
									<Text style={styles.myFactoryText}>
										내 공장1 등록하기
									</Text>
									<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} style={styles.myFactoryArr} />
								</TouchableOpacity>
								)}

								{my2 ? (
								<TouchableOpacity 
									style={[styles.typingInputBox, styles.typingFactory, factActive=='2' ? styles.typingFactoryOn : null]}
									activeOpacity={opacityVal}
									onPress={()=>{setModal7(true)}}
								>
									<Text style={[styles.myFactoryText, styles.myFactoryText2, factActive=='2' ? styles.myFactoryTextOn : null]}>
										{factName2}
									</Text>
									<AutoHeightImage width={3} source={require("../../assets/img/icon_dot.png")} style={styles.myFactoryArr} />
								</TouchableOpacity>
								) : (
								<TouchableOpacity 
									style={[styles.typingInputBox, styles.typingFactory]}
									activeOpacity={opacityVal}
									onPress={()=>{setModal6(true)}}
								>
									<Text style={styles.myFactoryText}>
									내 공장2 등록하기
									</Text>
									<AutoHeightImage width={7} source={require("../../assets/img/icon_arrow2.png")} style={styles.myFactoryArr} />
								</TouchableOpacity>
								)}
							</View>

							<View style={[styles.alertBox, styles.mgTop35]}>
								<AutoHeightImage width={20} source={require("../../assets/img/icon_alert.png")} style={styles.icon_alert} />
								<Text style={styles.alertBoxText}>사업자등록증을 등록하여 인증된 회원들과 거래를 시작해 보세요. 가입 후에도 등록 가능합니다.</Text>
							</View>
							{!state ? (
							<TouchableOpacity
								style={styles.addBtn}
								activeOpacity={opacityVal}
								onPress={() => {setState(true)}}
							>
								<AutoHeightImage width={13} source={require("../../assets/img/icon_plus.png")} style={styles.icon_add} />
								<Text style={styles.addBtnText}>등록</Text>
							</TouchableOpacity>
							) : null}
						</View>
						{state ? (
						<View style={[styles.registBox, styles.registBox2]}>
							<View style={[styles.typingBox]}>
								<View style={[styles.typingTitle, styles.typingTitleFlex]}>
									<Text style={styles.typingTitleText}>사업자 번호</Text>
									<TouchableOpacity 
										style={styles.resetBtn}
										activeOpacity={opacityVal}
										onPress={() => {setMbCompanyNumber()}}
									>
										<AutoHeightImage width={13} source={require("../../assets/img/icon_reset.png")} style={styles.icon_reset} />
										<Text style={styles.resetBtnText}>초기화</Text>
									</TouchableOpacity>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										keyboardType='email-address'
										value={mbcompanyNumber}
										onChangeText={(v) => {setMbCompanyNumber(v)}}
										placeholder={'사업자 번호를 입력해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>상호(법인명)</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={mbcompanyName}									
										onChangeText={(v) => {setMbCompanyName(v)}}
										placeholder={"상호(법인명)을 입력해 주세요."}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>성명</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={mbName}									
										onChangeText={(v) => {setMbName(v)}}
										placeholder={"성명을 입력해 주세요."}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>사업장 소재지</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={mbCompanyAddr}									
										onChangeText={(v) => {setMbCompanyAddr(v)}}
										placeholder={"사업장 소재지를 입력해 주세요."}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>사업자등록증 사진</Text>
								</View>
								<TouchableOpacity
									activeOpacity={opacityVal}						
									onPress={() => {setModal4(true);}}
								>
									{picture ? (
										<AutoHeightImage width={102} source={{uri: picture}} />
									) : (
										<AutoHeightImage 
											width={102} 
											source={require("../../assets/img/pick_photo.jpg")}
											style={[styles.photoBox]}
										/>
									)}
								</TouchableOpacity>
							</View>
						</View>
						) : null}
					</View>
				</KeyboardAwareScrollView>
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => submitRegist()}
					>
						<Text style={styles.nextBtnText}>가입완료</Text>
					</TouchableOpacity>
				</View>				
			</Modal>

			<Modal
        visible={modal3}
				animationType={"slide"}
				onRequestClose={() => {setModal3(false)}}
      >
				<View style={styles.header}>
					<>
					<TouchableOpacity
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => {setModal3(false)}} 						
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>내 공장1 정보 등록</Text>
					</>
				</View>
				<KeyboardAwareScrollView>
					<View style={styles.registArea}>
						<View	View style={[styles.registBox]}>
							<View style={[styles.typingBox]}>
								<View style={[styles.typingTitle]}>
									<Text style={styles.typingTitleText}>공장명</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factName1}
										onChangeText={(v) => {setFactName1(v)}}
										placeholder={'공장명을 입력해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>공장 주소</Text>
								</View>
								<View style={styles.findLocal}>
									<TouchableOpacity 
										style={styles.findLocalBtn}
										activeOpacity={opacityVal}
										onPress={() => {findMyPosition('1')}}
									>
										<AutoHeightImage width={16} source={require("../../assets/img/icon_local.png")} />
										<Text style={styles.findLocalBtnText}>현재 위치로 찾기</Text>
									</TouchableOpacity>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										value={factCode1}									
										keyboardType = 'numeric'
										onChangeText={(v) => {setFactCode1(v)}}
										placeholder={"우편번호"}
										style={[styles.input, styles.input3]}
										placeholderTextColor={"#8791A1"}
									/>
									<TouchableOpacity 
										style={[styles.certChkBtn, styles.certChkBtn3]}
										activeOpacity={opacityVal}
										onPress={() => {setPostcodeOn(!postcodeOn)}}
									>
										<Text style={styles.certChkBtnText3}>우편번호 검색</Text>
									</TouchableOpacity>
								</View>
								{postcodeOn ? (
								<View style={[styles.postcodeBox]}>
									<Postcode
										style={{ width: innerWidth, height: 320 }}
										jsOptions={{ animation: true }}
										onSelected={data => {
											//console.log(JSON.stringify(data))
											const kakaoAddr = data;												
											setFactCode1(kakaoAddr.zonecode);
											setFactAddr1(kakaoAddr.address);
											setFactAddrDt1(kakaoAddr.buildingName);
											setPostcodeOn(false);
										}}
									/>
								</View>
								) : null}
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddr1}									
										onChangeText={(v) => {setFactAddr1(v)}}
										placeholder={"주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddrDt1}									
										onChangeText={(v) => {setFactAddrDt1(v)}}
										placeholder={"상세 주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
							</View>
						</View>
					</View>
				</KeyboardAwareScrollView>								
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							chkFactoryInfo('1')								
					}}
					>
						<Text style={styles.nextBtnText}>확인</Text>
					</TouchableOpacity>
				</View>						
			</Modal>			
		
			<Modal
        visible={modal4}
				transparent={true}
				onRequestClose={() => {setModal4(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setModal4(false)}}
				></Pressable>
				<View style={styles.modalCont}>
					<Avatar 
						onChange={onAvatarChange} 
						//source={require('../../assets/img/pick_photo.jpg')}
					/>
				</View>
      </Modal>

			<Modal
				visible={modal5}
				transparent={true}
				onRequestClose={() => {setModal5(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setModal5(false)}}
				></Pressable>
				<View style={styles.modalCont2}>
					<View style={styles.modalCont2Box}>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.choice]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive('1')
								setModal5(false)
							}}
						>
							<Text style={styles.modalCont2BtnText}>선택</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
								setModal3(true)
								setModal5(false)
							}}
						>
							<Text style={styles.modalCont2BtnText}>수정</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive()
								setFactName1('')
								setFactCode1('')
								setFactAddr1('')
								setFactAddrDt1('')
								setModal5(false)
							}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity 
						style={[styles.modalCont2Btn, styles.cancel]}
						activeOpacity={opacityVal}
						onPress={() => {
							setModal5(false)
						}}
					>
						<Text style={styles.modalCont2BtnText}>취소</Text>
					</TouchableOpacity>
				</View>
      </Modal>

			<Modal
        visible={modal6}
				animationType={"slide"}
				onRequestClose={() => {setModal6(false)}}
      >
				<View style={styles.header}>
					<>
					<TouchableOpacity
						style={styles.headerBackBtn}
						activeOpacity={opacityVal}
						onPress={() => (setModal6(false))}						
					>
						<AutoHeightImage width={14} source={require("../../assets/img/icon_close.png")} />
					</TouchableOpacity>
					<Text style={styles.headerTitle}>내 공장2 정보 등록</Text>
					</>
				</View>
				<KeyboardAwareScrollView>
					<View style={styles.registArea}>
						<View	View style={[styles.registBox]}>
							<View style={[styles.typingBox]}>
								<View style={[styles.typingTitle]}>
									<Text style={styles.typingTitleText}>공장명</Text>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factName2}
										onChangeText={(v) => {setFactName2(v)}}
										placeholder={'공장명을 입력해 주세요.'}
										placeholderTextColor="#8791A1"
										style={[styles.input]}
									/>
								</View>
							</View>

							<View style={[styles.typingBox, styles.mgTop35]}>
								<View style={styles.typingTitle}>
									<Text style={styles.typingTitleText}>공장 주소</Text>
								</View>
								<View style={styles.findLocal}>
									<TouchableOpacity 
										style={styles.findLocalBtn}
										activeOpacity={opacityVal}
										onPress={() => {findMyPosition('2')}}
									>
										<AutoHeightImage width={16} source={require("../../assets/img/icon_local.png")} />
										<Text style={styles.findLocalBtnText}>현재 위치로 찾기</Text>
									</TouchableOpacity>
								</View>
								<View style={[styles.typingInputBox, styles.typingFlexBox]}>
									<TextInput
										value={factCode2}									
										keyboardType = 'numeric'
										onChangeText={(v) => {setFactCode2(v)}}
										placeholder={"우편번호"}
										style={[styles.input, styles.input3]}
										placeholderTextColor={"#8791A1"}
									/>
									<TouchableOpacity 
										style={[styles.certChkBtn, styles.certChkBtn3]}
										activeOpacity={opacityVal}
										onPress={() => {setPostcodeOn2(!postcodeOn2)}}
									>
										<Text style={styles.certChkBtnText3}>우편번호 검색</Text>
									</TouchableOpacity>
								</View>
								{postcodeOn2 ? (
								<View style={[styles.postcodeBox]}>
									<Postcode
										style={{ width: innerWidth, height: 320 }}
										jsOptions={{ animation: true }}
										onSelected={data => {
											//console.log(JSON.stringify(data))
											const kakaoAddr = data;												
											setFactCode2(kakaoAddr.zonecode);
											setFactAddr2(kakaoAddr.address);
											setFactAddrDt2(kakaoAddr.buildingName);
											setPostcodeOn2(false);
										}}
									/>
								</View>
								) : null}
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddr2}									
										onChangeText={(v) => {setFactAddr2(v)}}
										placeholder={"주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
								<View style={[styles.typingInputBox]}>
									<TextInput
										value={factAddrDt2}									
										onChangeText={(v) => {setFactAddrDt2(v)}}
										placeholder={"상세 주소"}
										style={[styles.input]}
										placeholderTextColor={"#8791A1"}
									/>
								</View>
							</View>
						</View>
					</View>
				</KeyboardAwareScrollView>								
				<View style={styles.nextFix}>
					<TouchableOpacity 
						style={styles.nextBtn}
						activeOpacity={opacityVal}
						onPress={() => {
							chkFactoryInfo('2')								
					}}
					>
						<Text style={styles.nextBtnText}>확인</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			<Modal
				visible={modal7}
				transparent={true}
				onRequestClose={() => {setModal7(false)}}
      >
				<Pressable 
					style={styles.modalBack}
					onPress={() => {setModal7(false)}}
				></Pressable>
				<View style={styles.modalCont2}>
					<View style={styles.modalCont2Box}>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.choice]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive('2')
								setModal7(false)
						}}
						>
							<Text style={styles.modalCont2BtnText}>선택</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.modify]}
							activeOpacity={opacityVal}
							onPress={() => {
								setModal6(true)
								setModal7(false)
							}}
						>
							<Text style={styles.modalCont2BtnText}>수정</Text>
						</TouchableOpacity>
						<TouchableOpacity 
							style={[styles.modalCont2Btn, styles.delete]}
							activeOpacity={opacityVal}
							onPress={() => {
								setFactActive()
								setFactName2('')
								setFactCode2('')
								setFactAddr2('')
								setFactAddrDt2('')
								setModal7(false)
							}}
						>
							<Text style={[styles.modalCont2BtnText, styles.modalCont2BtnText2]}>삭제</Text>
						</TouchableOpacity>
					</View>
					<TouchableOpacity 
						style={[styles.modalCont2Btn, styles.cancel]}
						activeOpacity={opacityVal}
						onPress={() => {
							setModal7(false)
						}}
					>
						<Text style={styles.modalCont2BtnText}>취소</Text>
					</TouchableOpacity>
				</View>
      </Modal>

			<Modal
        visible={toastModal}
				animationType={"slide"}
				transparent={true}
      >
				<View style={styles.toastModal}>
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
							{toastText}
						</Text>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	)
}

const styles = StyleSheet.create({
	safeAreaView: {flex:1,backgroundColor:'#fff'},
	safeAreaView2: {},
	borderTop: {borderTopWidth:6,borderTopColor:'#F1F4F9'},
	borderBot: {borderBottomWidth:1,borderBottomColor:'#E1E8F0'},
	mgTop30: {marginTop:30},
	mgTop35: {marginTop:35},
	paddBot13: {paddingBottom:13},
	registArea: {},
	registBox: {padding:20,paddingVertical:30,},
	registBox2: {paddingTop:0,marginTop:-5},
	alertBox: {width:innerWidth,padding:15,paddingLeft:45,backgroundColor:'#F3FAF8',borderRadius:12,position:'relative',},
	icon_alert: {position:'absolute',left:15,top:15},
	alertBoxText: {fontFamily:Font.NotoSansRegular,fontSize:14,lineHeight:20,color:'#000',},
	alertBoxText2: {marginTop:3,},
	typingBox: {},
	typingTitle: {},
	typingTitleFlex: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between',},
	typingTitleText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:17,color:'#000',},
	typingInputBox: {marginTop:10,position:'relative'},
	typingFlexBox: {display:'flex',flexDirection:'row',justifyContent:'space-between',},
	input: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,paddingLeft:12,fontSize:15,color:'#000'},
	input2: {width:(innerWidth - 90),},
	input3: {width:(innerWidth - 120),},
	certChkBtn: {width:80,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#353636',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText: {fontFamily:Font.NotoSansMedium,fontSize:15,color:'#353636'},
	certChkBtn2: {width:innerWidth,height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',marginTop:10,},
	certChkBtnText2: {fontFamily:Font.NotoSansBold,fontSize:16,color:'#fff'},
	certChkBtn3: {width:110,height:58,backgroundColor:'#31B481',borderWidth:0,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'},
	certChkBtnText3: {fontFamily:Font.NotoSansBold,fontSize:15,color:'#fff'},
	nextFix: {height:105,padding:20,paddingTop:12,},
	nextBtn: {height:58,backgroundColor:'#31B481',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',},
	nextBtnText: {fontFamily:Font.NotoSansBold,fontSize:16,lineHeight:58,color:'#fff'},

	header: {height:50,backgroundColor:'#fff',position:'relative',display:'flex',justifyContent:'center',paddingLeft:20, paddingRight:20},
	headerBackBtn: {width:30,height:50,position:'absolute',left:20,top:0,zIndex:10,display:'flex',justifyContent:'center'},
	headerTitle: {fontFamily:Font.NotoSansMedium,textAlign:'center',fontSize:17,lineHeight:50,color:'#000'},

	typingFactory: {width:innerWidth,height:58,backgroundColor:'#fff',borderWidth:1,borderColor:'#E5EBF2',borderRadius:12,
	paddingLeft:12,display:'flex',justifyContent:'center',position:'relative',},
	typingFactoryOn: {borderColor:'#31B481'},
	myFactoryText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:56,color:'#8791A1'},
	myFactoryText2: {color:'#000'},
	myFactoryTextOn: {fontFamily:Font.NotoSansMedium,color:'#31B481'},
	myFactoryArr: {position:'absolute',right:20,top:21,},
	addBtn: {width:innerWidth,height:58,backgroundColor:'#E3E9ED',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:20,},
	addBtnText: {fontFamily:Font.NotoSansRegular,fontSize:15,lineHeight:19,color:'#8791A1',marginLeft:8},
	modalBack: {width:widnowWidth,height:widnowHeight,backgroundColor:'#000',opacity:0.5},
	modalCont: {width:innerWidth,height:154,padding:30,paddingLeft:20,paddingRight:20,backgroundColor:'#fff',borderRadius:10,position:'absolute',left:20,top:((widnowHeight/2)-88)},	
	photoBox: {marginTop:10,borderWidth:1,borderColor:'#E1E1E1',borderRadius:12,overflow:'hidden'},
	resetBtn: {display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',width:75,height:22,backgroundColor:'#31B481',borderRadius:12,},
	resetBtnText: {fontFamily:Font.NotoSansBold,fontSize:13,lineHeight:22,color:'#fff',marginLeft:5,},
	timeBox: {position:'absolute',right:20,top:0,},
	timeBoxText: {fontFamily:Font.NotoSansMedium,fontSize:15,lineHeight:56,color:'#000'},
	findLocal: {marginTop:10,},
	findLocalBtn: {width:innerWidth,height:58,backgroundColor:'#E9ECF0',borderRadius:12,display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center',},
	findLocalBtnText: {fontFamily:Font.NotoSansMedium,fontSize:14,color:'#8791A1',marginLeft:5},
	toastModal: {width:widnowWidth,height:(widnowHeight - 50),display:'flex',alignItems:'center',justifyContent:'flex-end'},

	modalCont2: {width:innerWidth,borderRadius:10,position:'absolute',left:20,bottom:35},
	modalCont2Box: {},
	modalCont2Btn: {width:innerWidth,height:58,backgroundColor:'#F1F1F1',display:'flex',alignItems:'center',justifyContent:'center',},
	choice: {borderTopLeftRadius:12,borderTopRightRadius:12,borderBottomWidth:1,borderColor:'#B1B1B1'},
	modify: {borderBottomWidth:1,borderColor:'#B1B1B1'},
	delete: {borderBottomLeftRadius:12,borderBottomRightRadius:12,},
	cancel: {backgroundColor:'#fff',borderRadius:12,marginTop:10,},
	modalCont2BtnText: {fontFamily:Font.NotoSansMedium,fontSize:19,color:'#007AFF'},
	modalCont2BtnText2: {color:'#DF4339'},
});

export default Register2