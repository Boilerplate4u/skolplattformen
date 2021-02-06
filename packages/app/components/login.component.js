import React, { useEffect } from 'react'
import { Platform, SafeAreaView, StyleSheet, Image, Linking, KeyboardAvoidingView, TouchableOpacity, View } from 'react-native'

import { Button, Icon, Modal, Card, Text, ImageBackground, Divider, Layout, TopNavigation, Input } from '@ui-kitten/components'
import Personnummer from 'personnummer'
import { useAsyncStorage } from 'use-async-storage'
import { useApi } from '@skolplattformen/api-hooks'

const funArguments = ['öppna', 'roliga', 'fungerande', 'billiga', 'snabba', 'fria', 'efterlängtade', 'coolare', 'första', 'upplysta', 'hemmagjorda', 'bättre', 'rebelliska', 'enkla', 'operfekta', 'fantastiska', 'agila'] // TODO: add moare

export const Login = ({ navigation, route }) => {
  const { api, isLoggedIn } = useApi()
  const [visible, showModal] = React.useState(false)
  const [valid, setValid] = React.useState(false)
  const [argument, setArgument] = React.useState('öppna')
  const [error, setError] = React.useState(null)
  const [socialSecurityNumberCache, setSocialSecurityNumberCache] = useAsyncStorage('@socialSecurityNumber')
  const [socialSecurityNumber, setSocialSecurityNumber] = React.useState(socialSecurityNumberCache)

  /* Initial load functions */
  useEffect(() => {
    setValid(Personnummer.valid(socialSecurityNumber))
  }, [socialSecurityNumber])

  const loginHandler = async () => {
    showModal(false)
    navigateToChildren()
  }

  useEffect(() => {
    setArgument(funArguments[Math.floor(Math.random() * funArguments.length)])
    api.on('login', loginHandler)

    return () => api.off('login', loginHandler)
  }, [])

  /* Helpers */
  const handleInput = (text) => {
    const isValid = Personnummer.valid(text)
    setValid(isValid)

    if (isValid) {
      const parsedInput = Personnummer.parse(text).format(true)
      setSocialSecurityNumber(parsedInput)
      setSocialSecurityNumberCache(parsedInput)
    } else {
      setSocialSecurityNumber(text)
    }
  }

  const openBankId = (token) => {
    try {
      const bankIdUrl = Platform.OS === 'ios' ? `https://app.bankid.com/?autostarttoken=${token.token}&redirect=null` : `bankid:///?autostarttoken=${token.token}&redirect=null`
      Linking.openURL(bankIdUrl)
    } catch (err) {
      setError('Öppna BankID manuellt')
    }
  }

  /* Navigation actions */
  const navigateToChildren = () => {
    navigation.navigate('Children')
  }

  const startLogin = async () => {
    showModal(true)
    const status = await api.login(socialSecurityNumber)
    if (status.token !== 'fake') {
      openBankId(status.token)
    }
    status.on('PENDING', () => console.log('BankID app not yet opened'))
    status.on('USER_SIGN', () => console.log('BankID app is open'))
    status.on('ERROR', () => setError('Inloggningen misslyckades, försök igen!') && showModal(false))
    status.on('OK', () => console.log('BankID ok'))
  }

  const startLogout = async () => {
    showModal(false)
    try {
      api.logout()
    } catch (err) {
      setError('fel uppdatod vid utloggning')
    }
  }

  /* Icons */
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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {isLoggedIn
          ? <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <TopNavigation title={`Skolplattformen.org - det ${argument} alternativet`} alignment='center' />
            <Image source={require('../assets/man.png')} style={{ maxHeight: 300, width: '100%', borderBottomWidth: 1 }} />
            <View style={{ marginTop: 80, justifyContent: 'flex-start', alignItems: 'flex-start', flex: 1 }}>
              <Text category='h4'>{socialSecurityNumber}</Text>
              <Text>{error || 'Hurra, du är inloggad!'}</Text>
              <Button
                status='success'
                size='medium'
                style={{ marginTop: 10, width: 200 }}
                accessoryRight={CheckIcon}
                onPress={() => navigateToChildren()}
              >
                {error ? 'Försök igen' : 'Fortsätt'}
              </Button>
              <Button
                onPress={() => startLogout()}
                accessoryRight={LogoutIcon}
                style={{ marginTop: 10, width: 200 }}
                size='medium'
              >
                Logga ut
            </Button>
            </View>
          </Layout>
          :
          <Layout style={{ flex: 1, padding: 24 }}>
            <TopNavigation title={`Skolplattformen.org - det ${argument} alternativet`} alignment='center' />
            {
              // hidden easter egg, just touch the image to login without bankId if you still have a valid token
            }
            <TouchableOpacity onPress={navigateToChildren} >
              <Image source={require('../assets/boys.png')} style={{ height: 320, marginTop: -20, marginLeft: -10, width: '110%' }} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-start', paddingHorizontal: 20, paddingBottom: 72 }}>
              <Input
                label='Personnummer' autoFocus value={socialSecurityNumber}
                style={{ minHeight: 70 }}
                accessoryLeft={PersonIcon}
                keyboardType='numeric'
                caption={(error?.message || '')}
                onChangeText={text => handleInput(text)}
                placeholder='Ditt personnr (10 eller 12 siffror)'
              />
              <Button
                onPress={startLogin} style={{ width: '100%' }}
                appearence='ghost'
                disabled={!valid}
                status='primary'
                accessoryRight={SecureIcon}
                size='medium'
              >
                Öppna BankID
              </Button>
            </View>
          </Layout>
        }
        <Modal
          visible={visible}
          style={styles.modal}
          backdropStyle={styles.backdrop}
          onBackdropPress={() => showModal(false)}
        >
          <Card disabled>
            <Text style={{ margin: 10 }}>Väntar på BankID...</Text>

            <Button
              visible={!isLoggedIn}
              onPress={() => showModal(false)}
            >
              Avbryt
          </Button>
          </Card>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 192
  },
  modal: {
    width: '80%'
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
})
