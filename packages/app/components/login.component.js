import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import { SafeAreaView, StyleSheet, Image, Linking, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native'
import { Button, Icon, Modal, Card, Text, ImageBackground, Divider, Layout, TopNavigation, Input } from '@ui-kitten/components'
import Personnummer from 'personnummer'
import {useAsyncStorage} from 'use-async-storage'
import { ScrollView } from 'react-native-gesture-handler'
import {api} from '../lib/backend'

const baseUrl = 'https://api.skolplattformen.org'
const funArguments = ['öppna', 'roliga', 'fungerande', 'billiga', 'snabba', 'fria', 'efterlängtade', 'coolare', 'första', 'upplysta', 'hemmagjorda', 'bättre', 'rebelliska', 'enkla', 'operfekta', 'fantastiska', 'agila'] // TODO: add moare

export const Login = ({ navigation, route }) => {
  const [visible, setVisible] = React.useState(false)
  const [valid, setValid] = React.useState(false)
  const [loggedIn, setLoggedIn] = React.useState(false)
  const [argument, setArgument] = React.useState('öppna')
  const [error, setError] = React.useState(null)
  const [hasBankId, setHasBankId] = React.useState(false)
  const [socialSecurityNumber, setSocialSecurityNumber] = useAsyncStorage('@socialSecurityNumber')
  const [cookie, setCookie, clearCookie] = useAsyncStorage('@cookie')

  useEffect(() => {
    setValid(Personnummer.valid(socialSecurityNumber))
    if (cookie) api.setSessionCookie(cookie)
  }, [socialSecurityNumber, cookie])

  useEffect(() => {
    setArgument(funArguments[Math.floor(Math.random() * funArguments.length)])
  }, [])

  const navigateToChildren = () => {
    console.log('continuing..')
    navigation.navigate('Children')
  }

  const SecureIcon = (style) => (
    <Icon {...style} name='keypad-outline' />
  ) 
  const CheckIcon = (style) => (
    <Icon {...style} name='checkmark-outline' />
  ) 
  const LogoutIcon = (style) => (
    <Icon {...style} name='close-outline' />
  ) 
  const PersonIcon = (style) => (
    <Icon {...style} name='person-outline' />
  )

  const handleInput = (text) => {
    const isValid = Personnummer.valid(text)
    setValid(isValid)

    if (isValid) {
      const parsedInput = Personnummer.parse(text).format(true)
      setSocialSecurityNumber(parsedInput)
    } else {
      setSocialSecurityNumber(text)
    }
  }

  const openBankId = (token) => {
    try {
      const bankIdUrl = Platform.OS === 'ios' ? `https://app.bankid.com/?autostarttoken=${token.token}&redirect=null` : `bankid:///?autostarttoken=${token.token}&redirect=null`  
      Linking.openURL(bankIdUrl)
    } catch(err){ 
      setHasBankId(false)
      setError('Öppna BankID manuellt')
    }
  }

  const startLogin = async () => {
    setVisible(true)
    console.log('requesting login for', socialSecurityNumber)
    const loginStatus = await api.login(socialSecurityNumber)
    openBankId(loginStatus.token) // TODO: verify this solution after issue https://github.com/kolplattformen/embedded-api/issues/3 is resolved
    loginStatus.on("PENDING", () => console.log("BankID app not yet opened"))
    loginStatus.on("USER_SIGN", () => console.log("BankID app is open"))
    loginStatus.on("ERROR", () => setError('Inloggningen misslyckades, försök igen!') && setVisible(false))
    loginStatus.on("OK", async () => {
      setLoggedIn(true)
      const session = api.getSessionCookie()
      setCookie(session)
      navigateToChildren()
      setVisible(false)
    })
  }

  const logout = async () => {
    setVisible(false)
    setLoggedIn(false)
    clearCookie()
    api.logout()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <TopNavigation title={`Skolplattformen.org - det ${argument} alternativet`} alignment='center'/>
      {loggedIn ? <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        <Image source={require('../assets/man.png')} style={{maxHeight: 300, width: '100%', borderBottomWidth:1 }}></Image>
        <View style={{ marginTop: 80, justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1}}>
          <Text category="h4">{socialSecurityNumber}</Text>
          <Text>{error ? error : 'Hurra, du är inloggad!'}</Text>
          <Button
            status="success"
            size="medium"
            style={{marginTop: 10, width: 200}}
            accessoryRight = {CheckIcon}
            onPress={() => navigateToChildren()}>
            {error ? 'Försök igen' : 'Fortsätt'}
          </Button>
          <Button 
            onPress={() => logout()}
            accessoryRight={LogoutIcon}
            style={{marginTop: 10, width: 200}}
            size="medium">
            Logga ut
          </Button>
        </View>
      </Layout>
    : <KeyboardAvoidingView>
        <Layout style={{ flex: 1 }}>
          { 
            // hidden easter egg, just touch the image to login without bankId if you still have a valid token
          }
          <TouchableOpacity onPress={navigateToChildren} style={{height: 320}}> 
            <Image source={require('../assets/boys.png')} style={{height: 320, marginTop: -20, marginLeft: -10, width: '110%'}}></Image>
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 20}}>
            <Input label='Personnummer' autoFocus={true} value={socialSecurityNumber}
              style={{minHeight:70}}
                accessoryLeft = {PersonIcon}
                keyboardType='numeric'
                caption={error && error.message || ''}
                onChangeText = {text => handleInput(text)}
                placeholder="Ditt personnr (10 eller 12 siffror)"/>
            <Button onPress={startLogin} style={{width: "100%"}} 
              appearence='ghost' 
              disabled={!valid}
              status='primary'
              accessoryRight={SecureIcon}
              size='medium'>
              Öppna BankID
            </Button>
          </View>
        </Layout>
      </KeyboardAvoidingView>
    }
        <Modal
        visible={visible}
        style={styles.modal}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true}>
          {hasBankId ? <Text style={{margin: 10}}>Öppnar BankID. Växla tillbaka hit sen.</Text> : <Text style={{margin: 10}}>Väntar på BankID...</Text>}
          
          <Button 
            visible={!loggedIn}
            onPress={() => setVisible(false)}>
            Avbryt
          </Button>
        </Card>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  modal: {
    width: "80%"
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})