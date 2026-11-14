import { StyleSheet, Alert } from 'react-native';
import WebView, { type WebViewMessageEvent } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const handleMessage = (e: WebViewMessageEvent) => {
    try {
      const message = JSON.parse(e.nativeEvent.data);

      if (
        message.type === 'SAVE_IMAGE' &&
        typeof message.payload?.url === 'string'
      ) {
        Alert.alert('이미지 저장 요청 성공', message.payload.url);
      }
    } catch {
      Alert.alert('오류', '메시지를 해석하지 못했습니다.');
    }
  };

  return (
    // SafeAreaView는 기기에서 제공하는 안전 영역의 크기를 확인해 필요한 방향에 padding을 적용
    <SafeAreaView style={{ flex: 1 }}>
      <WebView
        style={styles.container}
        source={{ uri: 'http://192.168.25.23:5173/' }}
        onMessage={handleMessage}
      ></WebView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
